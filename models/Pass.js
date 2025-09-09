const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pass', passSchema);