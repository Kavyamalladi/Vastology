const express = require('express');
const router = express.Router();

// Import models
const VastuRule = require('../models/VastuRule');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const { validateVastuRule, validatePagination } = require('../middleware/validation');

// Import utilities
const catchAsync = require('../utils/catchAsync');

// @desc    Get all Vastu rules
// @route   GET /api/vastu/rules
// @access  Public
router.get('/rules', validatePagination, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = { isActive: true };
  
  // Add filters
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.direction) {
    query.direction = { $in: [req.query.direction, 'any'] };
  }
  if (req.query.roomType) {
    query.roomType = { $in: [req.query.roomType, 'any'] };
  }
  if (req.query.element) {
    query.element = { $in: [req.query.element, 'any'] };
  }
  if (req.query.importance) {
    query.importance = req.query.importance;
  }
  if (req.query.impact) {
    query.impact = req.query.impact;
  }

  const rules = await VastuRule.find(query)
    .sort({ priority: -1, importance: -1 })
    .skip(skip)
    .limit(limit)
    .select('name category description direction roomType element importance impact benefits consequences remedies');

  const total = await VastuRule.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      rules,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  });
}));

// @desc    Get Vastu rule by ID
// @route   GET /api/vastu/rules/:id
// @access  Public
router.get('/rules/:id', catchAsync(async (req, res) => {
  const rule = await VastuRule.findById(req.params.id);

  if (!rule || !rule.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Vastu rule not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { rule }
  });
}));

// @desc    Search Vastu rules
// @route   GET /api/vastu/rules/search
// @access  Public
router.get('/rules/search', catchAsync(async (req, res) => {
  const { q, category, direction, roomType, element, importance } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const filters = {};
  if (category) filters.category = category;
  if (direction) filters.direction = direction;
  if (roomType) filters.roomType = roomType;
  if (element) filters.element = element;
  if (importance) filters.importance = importance;

  const rules = await VastuRule.searchRules(q, filters);

  res.status(200).json({
    success: true,
    data: { rules }
  });
}));

// @desc    Get rules by category
// @route   GET /api/vastu/rules/category/:category
// @access  Public
router.get('/rules/category/:category', catchAsync(async (req, res) => {
  const { category } = req.params;
  const { direction, roomType, element } = req.query;

  const options = {};
  if (direction) options.direction = direction;
  if (roomType) options.roomType = roomType;
  if (element) options.element = element;

  const rules = await VastuRule.getByCategory(category, options);

  res.status(200).json({
    success: true,
    data: { rules }
  });
}));

// @desc    Get critical rules
// @route   GET /api/vastu/rules/critical
// @access  Public
router.get('/rules/critical', catchAsync(async (req, res) => {
  const rules = await VastuRule.getCriticalRules();

  res.status(200).json({
    success: true,
    data: { rules }
  });
}));

// @desc    Get applicable remedies for a rule
// @route   GET /api/vastu/rules/:id/remedies
// @access  Public
router.get('/rules/:id/remedies', catchAsync(async (req, res) => {
  const { budget = 'medium', difficulty = 'medium' } = req.query;
  
  const rule = await VastuRule.findById(req.params.id);

  if (!rule || !rule.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Vastu rule not found'
    });
  }

  const applicableRemedies = rule.getApplicableRemedies(budget, difficulty);

  res.status(200).json({
    success: true,
    data: { remedies: applicableRemedies }
  });
}));

// @desc    Get five elements information
// @route   GET /api/vastu/elements
// @access  Public
router.get('/elements', catchAsync(async (req, res) => {
  const elements = [
    {
      name: 'Earth',
      symbol: '🌍',
      color: 'Brown/Yellow',
      direction: 'Southwest',
      characteristics: ['Stability', 'Foundation', 'Grounding'],
      rooms: ['Bedroom', 'Study', 'Storage'],
      materials: ['Clay', 'Stone', 'Ceramic', 'Wood'],
      colors: ['Brown', 'Yellow', 'Orange', 'Beige'],
      remedies: ['Add earth elements', 'Use brown colors', 'Place heavy furniture']
    },
    {
      name: 'Water',
      symbol: '💧',
      color: 'Blue/Black',
      direction: 'Northeast',
      characteristics: ['Fluidity', 'Flow', 'Purity'],
      rooms: ['Bathroom', 'Kitchen', 'Puja Room'],
      materials: ['Glass', 'Mirror', 'Crystal', 'Metal'],
      colors: ['Blue', 'Black', 'Dark Blue', 'Navy'],
      remedies: ['Add water features', 'Use blue colors', 'Place mirrors']
    },
    {
      name: 'Fire',
      symbol: '🔥',
      color: 'Red/Orange',
      direction: 'Southeast',
      characteristics: ['Energy', 'Passion', 'Transformation'],
      rooms: ['Kitchen', 'Dining Room', 'Study'],
      materials: ['Metal', 'Copper', 'Brass', 'Stainless Steel'],
      colors: ['Red', 'Orange', 'Pink', 'Coral'],
      remedies: ['Add fire elements', 'Use red colors', 'Place electrical appliances']
    },
    {
      name: 'Air',
      symbol: '💨',
      color: 'White/Gray',
      direction: 'Northwest',
      characteristics: ['Movement', 'Vitality', 'Communication'],
      rooms: ['Living Room', 'Balcony', 'Study'],
      materials: ['Wood', 'Bamboo', 'Light Fabrics'],
      colors: ['White', 'Gray', 'Light Blue', 'Silver'],
      remedies: ['Improve ventilation', 'Use light colors', 'Add wind chimes']
    },
    {
      name: 'Space',
      symbol: '🌌',
      color: 'Purple/Violet',
      direction: 'Center',
      characteristics: ['Balance', 'Harmony', 'Spirituality'],
      rooms: ['Center of house', 'Meditation room', 'Puja room'],
      materials: ['Open space', 'Crystals', 'Sacred objects'],
      colors: ['Purple', 'Violet', 'Indigo', 'Deep Blue'],
      remedies: ['Keep center open', 'Use purple colors', 'Add spiritual elements']
    }
  ];

  res.status(200).json({
    success: true,
    data: { elements }
  });
}));

// @desc    Get directions information
// @route   GET /api/vastu/directions
// @access  Public
router.get('/directions', catchAsync(async (req, res) => {
  const directions = [
    {
      name: 'North',
      element: 'Water',
      color: 'Blue/Black',
      deity: 'Kubera',
      characteristics: ['Wealth', 'Career', 'Opportunities'],
      rooms: ['Study', 'Office', 'Storage'],
      tips: ['Keep clean and organized', 'Avoid heavy furniture', 'Use blue colors']
    },
    {
      name: 'South',
      element: 'Fire',
      color: 'Red/Orange',
      deity: 'Yama',
      characteristics: ['Fame', 'Recognition', 'Reputation'],
      rooms: ['Living Room', 'Dining Room', 'Guest Room'],
      tips: ['Use red colors', 'Avoid water features', 'Keep well-lit']
    },
    {
      name: 'East',
      element: 'Air',
      color: 'White/Gray',
      deity: 'Indra',
      characteristics: ['Health', 'Family', 'New Beginnings'],
      rooms: ['Main Door', 'Living Room', 'Study'],
      tips: ['Keep open and airy', 'Use light colors', 'Avoid heavy furniture']
    },
    {
      name: 'West',
      element: 'Air',
      color: 'White/Gray',
      deity: 'Varuna',
      characteristics: ['Children', 'Creativity', 'Pleasure'],
      rooms: ['Children Room', 'Dining Room', 'Balcony'],
      tips: ['Use light colors', 'Keep well-ventilated', 'Avoid dark colors']
    },
    {
      name: 'Northeast',
      element: 'Water',
      color: 'Blue/Black',
      deity: 'Ishaan',
      characteristics: ['Spirituality', 'Wisdom', 'Knowledge'],
      rooms: ['Puja Room', 'Study', 'Meditation Room'],
      tips: ['Keep clean and pure', 'Use blue colors', 'Avoid kitchen or toilet']
    },
    {
      name: 'Southeast',
      element: 'Fire',
      color: 'Red/Orange',
      deity: 'Agni',
      characteristics: ['Energy', 'Cooking', 'Transformation'],
      rooms: ['Kitchen', 'Dining Room'],
      tips: ['Use red colors', 'Keep well-lit', 'Avoid water features']
    },
    {
      name: 'Southwest',
      element: 'Earth',
      color: 'Brown/Yellow',
      deity: 'Nairutya',
      characteristics: ['Relationships', 'Stability', 'Grounding'],
      rooms: ['Master Bedroom', 'Storage', 'Heavy Items'],
      tips: ['Use earth colors', 'Place heavy furniture', 'Avoid water features']
    },
    {
      name: 'Northwest',
      element: 'Air',
      color: 'White/Gray',
      deity: 'Vayu',
      characteristics: ['Support', 'Help', 'Movement'],
      rooms: ['Guest Room', 'Children Room', 'Balcony'],
      tips: ['Keep light and airy', 'Use light colors', 'Avoid heavy items']
    }
  ];

  res.status(200).json({
    success: true,
    data: { directions }
  });
}));

// @desc    Get room-specific Vastu guidelines
// @route   GET /api/vastu/rooms/:roomType
// @access  Public
router.get('/rooms/:roomType', catchAsync(async (req, res) => {
  const { roomType } = req.params;

  const roomGuidelines = {
    'bedroom': {
      name: 'Bedroom',
      idealDirection: 'Southwest',
      avoidDirection: 'Northeast',
      colors: ['Pink', 'Light Blue', 'Green', 'White'],
      avoidColors: ['Red', 'Black', 'Dark Blue'],
      furniture: ['Bed should face east or south', 'Avoid mirrors facing bed', 'Keep head towards south'],
      tips: ['Keep clean and organized', 'Avoid electronics near bed', 'Use soft lighting']
    },
    'kitchen': {
      name: 'Kitchen',
      idealDirection: 'Southeast',
      avoidDirection: 'Northeast',
      colors: ['Yellow', 'Orange', 'Red', 'White'],
      avoidColors: ['Blue', 'Black', 'Green'],
      furniture: ['Stove should face east', 'Sink should be in northeast', 'Keep clean and organized'],
      tips: ['Keep well-lit', 'Avoid clutter', 'Use fire element colors']
    },
    'living-room': {
      name: 'Living Room',
      idealDirection: 'North or East',
      avoidDirection: 'Southwest',
      colors: ['White', 'Light Blue', 'Green', 'Yellow'],
      avoidColors: ['Red', 'Black', 'Dark colors'],
      furniture: ['Seating should face north or east', 'Avoid heavy furniture in center', 'Keep open and airy'],
      tips: ['Keep well-ventilated', 'Use light colors', 'Avoid clutter']
    },
    'bathroom': {
      name: 'Bathroom',
      idealDirection: 'Northwest or West',
      avoidDirection: 'Northeast',
      colors: ['White', 'Light Blue', 'Light Green'],
      avoidColors: ['Red', 'Black', 'Dark colors'],
      furniture: ['Keep clean and organized', 'Avoid mirrors facing door', 'Use light colors'],
      tips: ['Keep well-ventilated', 'Avoid keeping it in northeast', 'Use white or light colors']
    },
    'study': {
      name: 'Study Room',
      idealDirection: 'North or Northeast',
      avoidDirection: 'Southwest',
      colors: ['White', 'Light Blue', 'Green', 'Yellow'],
      avoidColors: ['Red', 'Black', 'Dark colors'],
      furniture: ['Desk should face north or east', 'Keep books organized', 'Use proper lighting'],
      tips: ['Keep clean and organized', 'Avoid distractions', 'Use light colors']
    }
  };

  const guidelines = roomGuidelines[roomType];

  if (!guidelines) {
    return res.status(404).json({
      success: false,
      message: 'Room type not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { guidelines }
  });
}));

// @desc    Create Vastu rule (Admin only)
// @route   POST /api/vastu/rules
// @access  Private/Admin
router.post('/rules', protect, authorize('admin'), validateVastuRule, catchAsync(async (req, res) => {
  const rule = await VastuRule.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Vastu rule created successfully',
    data: { rule }
  });
}));

// @desc    Update Vastu rule (Admin only)
// @route   PUT /api/vastu/rules/:id
// @access  Private/Admin
router.put('/rules/:id', protect, authorize('admin'), validateVastuRule, catchAsync(async (req, res) => {
  const rule = await VastuRule.findById(req.params.id);

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: 'Vastu rule not found'
    });
  }

  Object.keys(req.body).forEach(key => {
    rule[key] = req.body[key];
  });

  rule.lastModifiedBy = req.user.id;
  await rule.save();

  res.status(200).json({
    success: true,
    message: 'Vastu rule updated successfully',
    data: { rule }
  });
}));

// @desc    Delete Vastu rule (Admin only)
// @route   DELETE /api/vastu/rules/:id
// @access  Private/Admin
router.delete('/rules/:id', protect, authorize('admin'), catchAsync(async (req, res) => {
  const rule = await VastuRule.findById(req.params.id);

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: 'Vastu rule not found'
    });
  }

  rule.isActive = false;
  await rule.save();

  res.status(200).json({
    success: true,
    message: 'Vastu rule deactivated successfully'
  });
}));

module.exports = router;
