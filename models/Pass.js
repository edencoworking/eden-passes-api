const mongoose = require('mongoose');

const PassSchema = new mongoose.Schema({
  // Pass identification
  passNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20
  },
  
  // Pass type and category
  passType: {
    type: String,
    required: true,
    enum: [
      'day_pass',
      'weekly_pass', 
      'monthly_pass',
      'quarterly_pass',
      'annual_pass',
      'guest_pass',
      'event_pass'
    ]
  },
  
  // User information
  holderName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  holderEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  holderPhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Pass validity
  startDate: {
    type: Date,
    required: true
  },
  
  endDate: {
    type: Date,
    required: true
  },
  
  // Access and status
  accessLevel: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'vip', 'admin'],
    default: 'basic'
  },
  
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'suspended', 'cancelled'],
    default: 'active'
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  currency: {
    type: String,
    required: true,
    default: 'USD',
    maxlength: 3
  },
  
  // Additional features
  amenitiesIncluded: [{
    type: String,
    enum: [
      'wifi',
      'printing',
      'meeting_rooms',
      'coffee',
      'parking',
      'storage',
      'mail_service',
      'phone_booth',
      '24_7_access'
    ]
  }],
  
  // Usage tracking
  checkinCount: {
    type: Number,
    default: 0
  },
  
  lastCheckin: {
    type: Date
  },
  
  // Metadata
  notes: {
    type: String,
    maxlength: 500
  },
  
  issuedBy: {
    type: String,
    required: true,
    maxlength: 100
  },
  
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PassSchema.index({ holderEmail: 1 });
PassSchema.index({ passNumber: 1 });
PassSchema.index({ status: 1 });
PassSchema.index({ passType: 1 });
PassSchema.index({ startDate: 1, endDate: 1 });

// Virtual for checking if pass is currently valid
PassSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.startDate <= now && 
         this.endDate >= now;
});

// Virtual for days remaining
PassSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Pre-save middleware to auto-generate pass number if not provided
PassSchema.pre('save', function(next) {
  if (!this.passNumber) {
    const prefix = this.passType.toUpperCase().substr(0, 3);
    const timestamp = Date.now().toString().substr(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    this.passNumber = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to validate dates
PassSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// Ensure virtual fields are serialized
PassSchema.set('toJSON', { virtuals: true });
PassSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pass', PassSchema);