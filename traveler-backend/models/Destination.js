const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  galleryImages: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  highlights: {
    type: [String],
    default: []
  },
  includes: {
    included: {
      type: [String],
      default: []
    },
    excluded: {
      type: [String],
      default: []
    }
  },
  importantInfo: {
    whatToBring: {
      type: [String],
      default: []
    },
    notAllowed: {
      type: [String],
      default: []
    }
  },
  bookingInfo: {
    duration: {
      type: String,
      default: ''
    },
    cancellationPolicy: {
      type: String,
      default: ''
    },
    reserveNowPayLater: {
      type: Boolean,
      default: false
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    discountedPrice: {
      type: Number,
      min: 0
    },
    mealsIncluded: {
      type: [String],
      default: []
    }
  },
  famousFoods: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        default: ''
      },
      bestPlace: {
        type: String,
        default: ''
      }
    }],
    default: []
  },
  topRestaurants: {
    type: [String],
    default: []
  },
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
  popularityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search and filtering
destinationSchema.index({ name: 1, country: 1 });
destinationSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Destination', destinationSchema);
