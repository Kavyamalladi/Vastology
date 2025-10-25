const mongoose = require('mongoose');

const vastuRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Rule name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'direction',
      'room-placement',
      'five-elements',
      'energy-flow',
      'color-scheme',
      'furniture-placement',
      'entrance',
      'kitchen',
      'bedroom',
      'bathroom',
      'puja-room',
      'general'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  detailedExplanation: {
    type: String,
    trim: true
  },
  direction: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'center', 'any']
  },
  roomType: {
    type: String,
    enum: [
      'bedroom',
      'living-room',
      'kitchen',
      'bathroom',
      'dining-room',
      'study',
      'puja-room',
      'balcony',
      'entrance',
      'any'
    ]
  },
  element: {
    type: String,
    enum: ['earth', 'water', 'fire', 'air', 'space', 'any']
  },
  importance: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  impact: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  remedies: [{
    type: {
      type: String,
      enum: ['color', 'placement', 'decoration', 'construction', 'other']
    },
    description: String,
    cost: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    timeRequired: String
  }],
  benefits: [String],
  consequences: [String],
  exceptions: [String],
  modernAdaptations: [String],
  scientificBasis: String,
  references: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
vastuRuleSchema.index({ category: 1, direction: 1 });
vastuRuleSchema.index({ roomType: 1, importance: 1 });
vastuRuleSchema.index({ element: 1, impact: 1 });
vastuRuleSchema.index({ isActive: 1, priority: -1 });
vastuRuleSchema.index({ tags: 1 });

// Virtual for rule complexity
vastuRuleSchema.virtual('complexity').get(function() {
  let complexity = 0;
  
  if (this.remedies.length > 3) complexity += 1;
  if (this.exceptions.length > 0) complexity += 1;
  if (this.modernAdaptations.length > 0) complexity += 1;
  if (this.scientificBasis) complexity += 1;
  
  return complexity;
});

// Method to get applicable remedies
vastuRuleSchema.methods.getApplicableRemedies = function(budget = 'medium', difficulty = 'medium') {
  return this.remedies.filter(remedy => {
    const budgetMatch = budget === 'any' || remedy.cost === budget || remedy.cost === 'low';
    const difficultyMatch = difficulty === 'any' || remedy.difficulty === difficulty || remedy.difficulty === 'easy';
    return budgetMatch && difficultyMatch;
  });
};

// Static method to get rules by category
vastuRuleSchema.statics.getByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  
  if (options.direction) query.direction = { $in: [options.direction, 'any'] };
  if (options.roomType) query.roomType = { $in: [options.roomType, 'any'] };
  if (options.element) query.element = { $in: [options.element, 'any'] };
  if (options.importance) query.importance = options.importance;
  
  return this.find(query).sort({ priority: -1, importance: -1 });
};

// Static method to get critical rules
vastuRuleSchema.statics.getCriticalRules = function() {
  return this.find({ 
    isActive: true, 
    importance: 'critical' 
  }).sort({ priority: -1 });
};

// Static method to search rules
vastuRuleSchema.statics.searchRules = function(searchTerm, filters = {}) {
  const query = {
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  if (filters.category) query.category = filters.category;
  if (filters.direction) query.direction = { $in: [filters.direction, 'any'] };
  if (filters.roomType) query.roomType = { $in: [filters.roomType, 'any'] };
  if (filters.element) query.element = { $in: [filters.element, 'any'] };
  if (filters.importance) query.importance = filters.importance;
  
  return this.find(query).sort({ priority: -1, importance: -1 });
};

// Pre-save middleware to update version
vastuRuleSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  next();
});

module.exports = mongoose.model('VastuRule', vastuRuleSchema);
