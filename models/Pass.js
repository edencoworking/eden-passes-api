const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['day', 'week', 'month'],
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pass', passSchema);