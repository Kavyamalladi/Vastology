const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Analysis title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  files: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  floorPlan: {
    dimensions: {
      length: Number,
      width: Number,
      area: Number,
      unit: {
        type: String,
        enum: ['sqft', 'sqm'],
        default: 'sqft'
      }
    },
    orientation: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'],
      required: true
    },
    rooms: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['bedroom', 'living-room', 'kitchen', 'bathroom', 'dining-room', 'study', 'puja-room', 'balcony', 'other'],
        required: true
      },
      position: {
        x: Number,
        y: Number
      },
      dimensions: {
        length: Number,
        width: Number,
        area: Number
      },
      direction: {
        type: String,
        enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'center']
      }
    }]
  },
  vastuAnalysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    energyFlow: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      issues: [String],
      recommendations: [String]
    },
    directionalAnalysis: {
      north: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      south: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      east: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      west: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      northeast: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      northwest: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      southeast: {
        score: Number,
        issues: [String],
        recommendations: [String]
      },
      southwest: {
        score: Number,
        issues: [String],
        recommendations: [String]
      }
    },
    fiveElements: {
      earth: {
        score: Number,
        balance: String,
        recommendations: [String]
      },
      water: {
        score: Number,
        balance: String,
        recommendations: [String]
      },
      fire: {
        score: Number,
        balance: String,
        recommendations: [String]
      },
      air: {
        score: Number,
        balance: String,
        recommendations: [String]
      },
      space: {
        score: Number,
        balance: String,
        recommendations: [String]
      }
    },
    roomAnalysis: [{
      roomName: String,
      roomType: String,
      vastuScore: Number,
      issues: [String],
      recommendations: [String],
      remedies: [String]
    }],
    remedies: [{
      type: {
        type: String,
        enum: ['color', 'placement', 'decoration', 'construction', 'other']
      },
      description: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      cost: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      }
    }],
    positiveAspects: [String],
    negativeAspects: [String],
    summary: String,
    expertNotes: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingStartedAt: Date,
  completedAt: Date,
  processingTime: Number, // in seconds
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ 'vastuAnalysis.overallScore': -1 });
analysisSchema.index({ isPublic: 1, createdAt: -1 });
analysisSchema.index({ tags: 1 });

// Virtual for processing duration
analysisSchema.virtual('processingDuration').get(function() {
  if (this.processingStartedAt && this.completedAt) {
    return Math.round((this.completedAt - this.processingStartedAt) / 1000);
  }
  return null;
});

// Virtual for file count
analysisSchema.virtual('fileCount').get(function() {
  return this.files.length;
});

// Virtual for room count
analysisSchema.virtual('roomCount').get(function() {
  return this.floorPlan.rooms.length;
});

// Pre-save middleware to calculate area
analysisSchema.pre('save', function(next) {
  if (this.floorPlan.dimensions.length && this.floorPlan.dimensions.width) {
    this.floorPlan.dimensions.area = this.floorPlan.dimensions.length * this.floorPlan.dimensions.width;
  }
  
  // Calculate room areas
  this.floorPlan.rooms.forEach(room => {
    if (room.dimensions.length && room.dimensions.width) {
      room.dimensions.area = room.dimensions.length * room.dimensions.width;
    }
  });
  
  next();
});

// Method to update analysis status
analysisSchema.methods.updateStatus = function(status) {
  this.status = status;
  
  if (status === 'processing') {
    this.processingStartedAt = new Date();
  } else if (status === 'completed') {
    this.completedAt = new Date();
    if (this.processingStartedAt) {
      this.processingTime = Math.round((this.completedAt - this.processingStartedAt) / 1000);
    }
  }
  
  return this.save();
};

// Method to increment views
analysisSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to like analysis
analysisSchema.methods.like = function() {
  this.likes += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to share analysis
analysisSchema.methods.share = function() {
  this.shares += 1;
  return this.save({ validateBeforeSave: false });
};

// Static method to get popular analyses
analysisSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName avatar');
};

// Static method to get recent analyses
analysisSchema.statics.getRecent = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName avatar');
};

module.exports = mongoose.model('Analysis', analysisSchema);
