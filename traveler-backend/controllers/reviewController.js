const Review = require('../models/Review');
const Destination = require('../models/Destination');
const mongoose = require('mongoose');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { destinationId, destinationName, rating, comment } = req.body;

    // Validate input
    if (!destinationId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters long'
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      destination: destinationId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this destination'
      });
    }

    // Create review
    const review = await Review.create({
      destination: destinationId,
      destinationName: destinationName,
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      rating,
      comment: comment.trim()
    });

    // Update destination average rating and review count
    await updateDestinationRating(destinationId);

    // Populate user info before sending response
    await review.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// Get reviews for a destination
exports.getDestinationReviews = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ destination: destinationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const total = await Review.countDocuments({ destination: destinationId });

    // Calculate average rating
    const ratings = await Review.aggregate([
      { $match: { destination: new mongoose.Types.ObjectId(destinationId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const stats = ratings[0] || { averageRating: 0, totalReviews: 0 };

    res.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        averageRating: stats.averageRating ? stats.averageRating.toFixed(1) : '0',
        totalReviews: stats.totalReviews
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update fields
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = rating;
    }

    if (comment) {
      if (comment.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Comment must be at least 10 characters long'
        });
      }
      review.comment = comment.trim();
    }

    await review.save();

    // Update destination rating
    await updateDestinationRating(review.destination);

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const destinationId = review.destination;
    await review.deleteOne();

    // Update destination rating
    await updateDestinationRating(destinationId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpfulBy.includes(req.user.id);

    if (alreadyMarked) {
      // Remove the helpful mark
      review.helpfulBy = review.helpfulBy.filter(
        userId => userId.toString() !== req.user.id
      );
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add helpful mark
      review.helpfulBy.push(req.user.id);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyMarked ? 'Helpful mark removed' : 'Marked as helpful',
      helpful: review.helpful,
      isMarked: !alreadyMarked
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review',
      error: error.message
    });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('destination', 'name country image');

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

// Helper function to update destination rating
async function updateDestinationRating(destinationId) {
  try {
    const reviews = await Review.find({ destination: destinationId });
    
    if (reviews.length === 0) {
      await Destination.findByIdAndUpdate(destinationId, {
        averageRating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Destination.findByIdAndUpdate(destinationId, {
      averageRating: averageRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Update destination rating error:', error);
  }
}

module.exports = exports;
