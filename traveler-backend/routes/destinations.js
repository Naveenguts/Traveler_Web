const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Get all destinations
router.get('/', destinationController.getAllDestinations);

// Get single destination
router.get('/:id', destinationController.getDestinationById);

// Seed destinations (for development)
router.post('/seed', destinationController.seedDestinations);

module.exports = router;
