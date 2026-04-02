const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Get all activities for a destination
exports.getActivitiesByDestination = async (req, res) => {
  try {
    const { destination } = req.params;
    const { category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    // Build filter object
    let filter = { 
      destination: { $regex: destination, $options: 'i' },
      isAvailable: true 
    };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortObj = { createdAt: -1 };
    if (sort === 'price-low-high') sortObj = { basePrice: 1 };
    if (sort === 'price-high-low') sortObj = { basePrice: -1 };
    if (sort === 'rating') sortObj = { averageRating: -1 };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch activities
    const activities = await Activity.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
};

// Get single activity details
exports.getActivityDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }

    const activity = await Activity.findById(id).populate('destinationId');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error fetching activity detail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity details',
      error: error.message
    });
  }
};

// Create activity (admin only)
exports.createActivity = async (req, res) => {
  try {
    const {
      name,
      destination,
      country,
      images,
      basePrice,
      originalPrice,
      duration,
      shortDescription,
      fullDescription,
      highlights,
      includes,
      excludes,
      whatToBring,
      notAllowed,
      knowBeforeYouGo,
      provider,
      category,
      tags,
      pickupIncluded,
      freeCancel,
      freeCancelHours,
      reserveNowPayLater,
      maxGroupSize,
      minGroupSize
    } = req.body;

    // Validate required fields
    if (!name || !destination || !country || !basePrice || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, destination, country, basePrice, category'
      });
    }

    const activity = await Activity.create({
      name,
      destination,
      country,
      images,
      basePrice,
      originalPrice,
      duration,
      shortDescription,
      fullDescription,
      highlights,
      includes,
      excludes,
      whatToBring,
      notAllowed,
      knowBeforeYouGo,
      provider,
      category,
      tags,
      pickupIncluded,
      freeCancel,
      freeCancelHours,
      reserveNowPayLater,
      maxGroupSize,
      minGroupSize
    });

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error.message
    });
  }
};

// Update activity
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      { ...req.body, updated: new Date() },
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message
    });
  }
};

// Delete activity
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
      error: error.message
    });
  }
};

// Get activities by category
exports.getActivitiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const activities = await Activity.find({ category, isAvailable: true })
      .sort({ averageRating: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments({ category, isAvailable: true });

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      activities
    });
  } catch (error) {
    console.error('Error fetching activities by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
};

// Search activities
exports.searchActivities = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;

    let filter = { isAvailable: true };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } },
        { shortDescription: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    const activities = await Activity.find(filter)
      .sort({ averageRating: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Error searching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search activities',
      error: error.message
    });
  }
};
