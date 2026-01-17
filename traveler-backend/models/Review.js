const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  destinationName: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  helpful: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for faster queries
reviewSchema.index({ destination: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
