const express = require('express');
const router = express.Router();

// Import models
const Analysis = require('../models/Analysis');
const User = require('../models/User');

// Import middleware
const { protect, optionalAuth, requirePremium } = require('../middleware/auth');
const { validateAnalysis, validatePagination, validateObjectId } = require('../middleware/validation');

// Import utilities
const catchAsync = require('../utils/catchAsync');

// @desc    Get all analyses (public)
// @route   GET /api/analysis
// @access  Public
router.get('/', optionalAuth, validatePagination, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const query = { isPublic: true };
  
  // Add filters if provided
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.minScore) {
    query['vastuAnalysis.overallScore'] = { $gte: parseInt(req.query.minScore) };
  }
  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  const analyses = await Analysis.find(query)
    .populate('user', 'firstName lastName avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('title description status createdAt updatedAt vastuAnalysis.overallScore tags views likes');

  const total = await Analysis.countDocuments(query);

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

// @desc    Get user's analyses
// @route   GET /api/analysis/my-analyses
// @access  Private
router.get('/my-analyses', protect, validatePagination, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const analyses = await Analysis.find({ user: req.user.id })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('title description status createdAt updatedAt vastuAnalysis.overallScore tags views likes');

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

// @desc    Get analysis by ID
// @route   GET /api/analysis/:id
// @access  Private/Public
router.get('/:id', optionalAuth, validateObjectId('id'), catchAsync(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id)
    .populate('user', 'firstName lastName avatar');

  if (!analysis) {
    return res.status(404).json({
    success: false,
    message: 'Analysis not found'
    });
  }

  // Check if user can access this analysis
  if (!analysis.isPublic && (!req.user || analysis.user._id.toString() !== req.user.id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Increment views if not the owner
  if (!req.user || analysis.user._id.toString() !== req.user.id) {
    await analysis.incrementViews();
  }

  res.status(200).json({
    success: true,
    data: { analysis }
  });
}));

// @desc    Create new analysis
// @route   POST /api/analysis
// @access  Private
router.post('/', protect, validateAnalysis, catchAsync(async (req, res) => {
  const { title, description, floorPlan, isPublic, tags } = req.body;

  const analysis = await Analysis.create({
    user: req.user.id,
    title,
    description,
    floorPlan,
    isPublic: isPublic || false,
    tags: tags || [],
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Analysis created successfully',
    data: { analysis }
  });
}));

// @desc    Update analysis
// @route   PUT /api/analysis/:id
// @access  Private
router.put('/:id', protect, validateObjectId('id'), catchAsync(async (req, res) => {
  const { title, description, isPublic, tags } = req.body;

  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  // Check if user owns this analysis
  if (analysis.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  if (title) analysis.title = title;
  if (description !== undefined) analysis.description = description;
  if (isPublic !== undefined) analysis.isPublic = isPublic;
  if (tags) analysis.tags = tags;

  await analysis.save();

  res.status(200).json({
    success: true,
    message: 'Analysis updated successfully',
    data: { analysis }
  });
}));

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
// @access  Private
router.delete('/:id', protect, validateObjectId('id'), catchAsync(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  // Check if user owns this analysis
  if (analysis.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  await Analysis.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Analysis deleted successfully'
  });
}));

// @desc    Start analysis processing
// @route   POST /api/analysis/:id/start
// @access  Private
router.post('/:id/start', protect, requirePremium, validateObjectId('id'), catchAsync(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  // Check if user owns this analysis
  if (analysis.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  if (analysis.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Analysis is already being processed or completed'
    });
  }

  // Update status to processing
  await analysis.updateStatus('processing');

  // Simulate analysis processing (in real implementation, this would trigger AI analysis)
  setTimeout(async () => {
    try {
      // Simulate analysis results
      const mockResults = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        energyFlow: {
          score: Math.floor(Math.random() * 30) + 70,
          issues: ['Kitchen placement needs adjustment'],
          recommendations: ['Move kitchen to southeast corner']
        },
        directionalAnalysis: {
          north: { score: 85, issues: [], recommendations: ['Good placement'] },
          south: { score: 75, issues: ['Bedroom in south'], recommendations: ['Consider moving bedroom'] },
          east: { score: 90, issues: [], recommendations: ['Excellent placement'] },
          west: { score: 80, issues: [], recommendations: ['Good placement'] },
          northeast: { score: 70, issues: ['Bathroom in northeast'], recommendations: ['Move bathroom'] },
          northwest: { score: 85, issues: [], recommendations: ['Good placement'] },
          southeast: { score: 95, issues: [], recommendations: ['Excellent placement'] },
          southwest: { score: 75, issues: ['Kitchen in southwest'], recommendations: ['Move kitchen'] }
        },
        fiveElements: {
          earth: { score: 80, balance: 'Good', recommendations: ['Add more earth elements'] },
          water: { score: 75, balance: 'Moderate', recommendations: ['Add water features'] },
          fire: { score: 85, balance: 'Good', recommendations: ['Maintain current fire elements'] },
          air: { score: 90, balance: 'Excellent', recommendations: ['Excellent air flow'] },
          space: { score: 85, balance: 'Good', recommendations: ['Good space utilization'] }
        },
        roomAnalysis: [
          {
            roomName: 'Living Room',
            roomType: 'living-room',
            vastuScore: 85,
            issues: [],
            recommendations: ['Excellent placement'],
            remedies: []
          },
          {
            roomName: 'Kitchen',
            roomType: 'kitchen',
            vastuScore: 65,
            issues: ['Wrong direction'],
            recommendations: ['Move to southeast'],
            remedies: ['Use yellow colors', 'Add fire elements']
          }
        ],
        remedies: [
          {
            type: 'color',
            description: 'Use yellow colors in kitchen',
            priority: 'high',
            cost: 'low',
            difficulty: 'easy'
          },
          {
            type: 'placement',
            description: 'Move kitchen to southeast corner',
            priority: 'high',
            cost: 'high',
            difficulty: 'hard'
          }
        ],
        positiveAspects: ['Good living room placement', 'Excellent air flow'],
        negativeAspects: ['Kitchen in wrong direction', 'Bathroom in northeast'],
        summary: 'Overall good Vastu compliance with some areas needing attention. Focus on kitchen and bathroom placement for optimal energy flow.',
        expertNotes: 'Consider consulting a Vastu expert for detailed recommendations.'
      };

      analysis.vastuAnalysis = mockResults;
      await analysis.updateStatus('completed');

    } catch (error) {
      console.error('Analysis processing error:', error);
      await analysis.updateStatus('failed');
    }
  }, 5000); // 5 second delay to simulate processing

  res.status(200).json({
    success: true,
    message: 'Analysis processing started',
    data: { analysis }
  });
}));

// @desc    Like analysis
// @route   POST /api/analysis/:id/like
// @access  Private
router.post('/:id/like', protect, validateObjectId('id'), catchAsync(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  if (!analysis.isPublic) {
    return res.status(403).json({
      success: false,
      message: 'Cannot like private analysis'
    });
  }

  await analysis.like();

  res.status(200).json({
    success: true,
    message: 'Analysis liked successfully',
    data: { likes: analysis.likes }
  });
}));

// @desc    Share analysis
// @route   POST /api/analysis/:id/share
// @access  Private
router.post('/:id/share', protect, validateObjectId('id'), catchAsync(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    });
  }

  if (!analysis.isPublic) {
    return res.status(403).json({
      success: false,
      message: 'Cannot share private analysis'
    });
  }

  await analysis.share();

  res.status(200).json({
    success: true,
    message: 'Analysis shared successfully',
    data: { shares: analysis.shares }
  });
}));

// @desc    Get popular analyses
// @route   GET /api/analysis/popular
// @access  Public
router.get('/popular', optionalAuth, catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const analyses = await Analysis.getPopular(limit);

  res.status(200).json({
    success: true,
    data: { analyses }
  });
}));

// @desc    Get recent analyses
// @route   GET /api/analysis/recent
// @access  Public
router.get('/recent', optionalAuth, catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const analyses = await Analysis.getRecent(limit);

  res.status(200).json({
    success: true,
    data: { analyses }
  });
}));

module.exports = router;
