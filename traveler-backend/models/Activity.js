const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  
  // Images
  images: [{
    url: String,
    alt: String
  }],
  
  // Pricing & Duration
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: 'USD'
  },
  duration: {
    hours: Number,
    minutes: { type: Number, default: 0 }
  },
  
  // Description & Details
  shortDescription: String,
  fullDescription: String,
  
  // Highlights (bullet points)
  highlights: [String],
  
  // What's Included/Excluded
  includes: [String],
  excludes: [String],
  
  // Important Information
  whatToBring: [String],
  notAllowed: [String],
  knowBeforeYouGo: [String],
  
  // Activity Provider
  provider: {
    name: String,
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: Number
  },
  
  // Ratings & Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Booking Options
  pickupIncluded: Boolean,
  freeCancel: Boolean,
  freeCancelHours: { type: Number, default: 24 },
  reserveNowPayLater: Boolean,
  
  // Categories & Tags
  category: {
    type: String,
    enum: ['Tours', 'Adventure', 'Cultural', 'Food', 'Sports', 'Beach', 'Mountain', 'Water', 'Other'],
    required: true
  },
  tags: [String],
  
  // Availability
  isAvailable: { type: Boolean, default: true },
  maxGroupSize: Number,
  minGroupSize: { type: Number, default: 1 },
  
  // Activity ID (reference to Destination if needed)
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  
  timestamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  }
});

// Create indexes for better search performance
activitySchema.index({ destination: 1, country: 1 });
activitySchema.index({ category: 1 });
activitySchema.index({ averageRating: -1 });
activitySchema.index({ basePrice: 1 });

module.exports = mongoose.model('Activity', activitySchema);
