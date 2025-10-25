const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const Analysis = require('../models/Analysis');

// Import middleware
const { protect, authorize, requireEmailVerification } = require('../middleware/auth');
const { validateProfileUpdate, validatePagination } = require('../middleware/validation');

// Import utilities
const catchAsync = require('../utils/catchAsync');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        subscription: user.subscription,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, validateProfileUpdate, catchAsync(async (req, res) => {
  const { firstName, lastName, phone, gender, dateOfBirth } = req.body;

  const user = await User.findById(req.user.id);

  // Check if phone number is being changed and if it's already in use
  if (phone && phone !== user.phone) {
    const existingUser = await User.findOne({ phone, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already in use by another account'
      });
    }
    user.isPhoneVerified = false; // Reset phone verification if phone is changed
  }

  // Update user fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (gender) user.gender = gender;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        subscription: user.subscription,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
}));

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', protect, catchAsync(async (req, res) => {
  const { language, notifications, vastuPreferences } = req.body;

  const user = await User.findById(req.user.id);

  if (language) {
    user.preferences.language = language;
  }

  if (notifications) {
    if (notifications.email !== undefined) {
      user.preferences.notifications.email = notifications.email;
    }
    if (notifications.sms !== undefined) {
      user.preferences.notifications.sms = notifications.sms;
    }
    if (notifications.push !== undefined) {
      user.preferences.notifications.push = notifications.push;
    }
  }

  if (vastuPreferences) {
    if (vastuPreferences.region) {
      user.preferences.vastuPreferences.region = vastuPreferences.region;
    }
    if (vastuPreferences.elements) {
      Object.keys(vastuPreferences.elements).forEach(element => {
        if (vastuPreferences.elements[element] !== undefined) {
          user.preferences.vastuPreferences.elements[element] = vastuPreferences.elements[element];
        }
      });
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: {
      preferences: user.preferences
    }
  });
}));

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', protect, catchAsync(async (req, res) => {
  // This would typically handle file upload
  // For now, we'll just return a success message
  res.status(200).json({
    success: true,
    message: 'Avatar upload endpoint - implementation needed'
  });
}));

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', protect, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Soft delete - deactivate account
  user.isActive = false;
  await user.save();

  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

// @desc    Get user's analyses
// @route   GET /api/users/analyses
// @access  Private
router.get('/analyses', protect, validatePagination, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const analyses = await Analysis.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('title description status createdAt updatedAt vastuAnalysis.overallScore');

  const total = await Analysis.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {
      analyses,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Get analysis statistics
  const totalAnalyses = await Analysis.countDocuments({ user: userId });
  const completedAnalyses = await Analysis.countDocuments({ 
    user: userId, 
    status: 'completed' 
  });
  const pendingAnalyses = await Analysis.countDocuments({ 
    user: userId, 
    status: 'pending' 
  });

  // Get average score
  const avgScoreResult = await Analysis.aggregate([
    { $match: { user: userId, status: 'completed' } },
    { $group: { _id: null, avgScore: { $avg: '$vastuAnalysis.overallScore' } } }
  ]);
  const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

  // Get recent activity
  const recentAnalyses = await Analysis.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status createdAt vastuAnalysis.overallScore');

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalAnalyses,
        completedAnalyses,
        pendingAnalyses,
        averageScore: Math.round(averageScore)
      },
      recentActivity: recentAnalyses
    }
  });
}));

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), validatePagination, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  });
}));

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
}));

// @desc    Update user by ID (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), catchAsync(async (req, res) => {
  const { role, isActive, subscription } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (subscription) {
    if (subscription.plan) user.subscription.plan = subscription.plan;
    if (subscription.isActive !== undefined) user.subscription.isActive = subscription.isActive;
    if (subscription.endDate) user.subscription.endDate = subscription.endDate;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
}));

// @desc    Delete user by ID (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Soft delete
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully'
  });
}));

module.exports = router;
