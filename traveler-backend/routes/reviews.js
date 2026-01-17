const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// Create a review (protected)
router.post('/', auth, reviewController.createReview);

// Get reviews for a destination (public)
router.get('/destination/:destinationId', reviewController.getDestinationReviews);

// Update a review (protected)
router.put('/:reviewId', auth, reviewController.updateReview);

// Delete a review (protected)
router.delete('/:reviewId', auth, reviewController.deleteReview);

// Mark review as helpful (protected)
router.post('/:reviewId/helpful', auth, reviewController.markHelpful);

// Get user's reviews (protected)
router.get('/my-reviews', auth, reviewController.getUserReviews);

module.exports = router;
