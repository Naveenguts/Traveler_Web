const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Public routes
router.get('/destination/:destination', activityController.getActivitiesByDestination);
router.get('/category/:category', activityController.getActivitiesByCategory);
router.get('/search', activityController.searchActivities);
router.get('/:id', activityController.getActivityDetail);

// Admin routes (protected in actual implementation)
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
