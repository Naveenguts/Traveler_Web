const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Get all trips for a user (with optional status filter)
// GET /api/trips/user/:userId?status=upcoming
router.get('/user/:userId', tripController.getUserTrips);

// Get trip statistics for a user
// GET /api/trips/user/:userId/stats
router.get('/user/:userId/stats', tripController.getTripStats);

// Get a single trip by ID
// GET /api/trips/:id
router.get('/:id', tripController.getTripById);

// Create a new trip
// POST /api/trips
router.post('/', tripController.createTrip);

// Update a trip
// PUT /api/trips/:id
router.put('/:id', tripController.updateTrip);

// Cancel a trip (sets status to cancelled)
// PATCH /api/trips/:id/cancel
router.patch('/:id/cancel', tripController.cancelTrip);

// Delete a trip
// DELETE /api/trips/:id
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
