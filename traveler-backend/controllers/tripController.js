const Trip = require('../models/Trip');

// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const trips = await Trip.find(query).sort({ createdAt: -1 });
    res.json({ success: true, trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ success: false, message: 'Error fetching trips', error: error.message });
  }
};

// Get a single trip by ID
exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, trip });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ success: false, message: 'Error fetching trip', error: error.message });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { userId, destinationName, country, startDate, endDate, description, coverImage, price, duration, status } = req.body;

    if (!userId || !destinationName || !country || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, destinationName, country, startDate, endDate' 
      });
    }

    const trip = new Trip({
      userId,
      destinationName,
      country,
      startDate,
      endDate,
      description: description || `Trip to ${destinationName}`,
      coverImage: coverImage || '',
      price: price || 0,
      duration: duration || 0,
      status: status || 'upcoming'
    });

    await trip.save();
    res.status(201).json({ success: true, trip, message: 'Trip created successfully' });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ success: false, message: 'Error creating trip', error: error.message });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow userId to be changed
    delete updates.userId;

    const trip = await Trip.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, trip, message: 'Trip updated successfully' });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ success: false, message: 'Error updating trip', error: error.message });
  }
};

// Cancel a trip
exports.cancelTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndUpdate(
      id,
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, trip, message: 'Trip cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling trip:', error);
    res.status(500).json({ success: false, message: 'Error cancelling trip', error: error.message });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndDelete(id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ success: false, message: 'Error deleting trip', error: error.message });
  }
};

// Get trip statistics for a user
exports.getTripStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Trip.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      upcoming: 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json({ success: true, stats: formattedStats });
  } catch (error) {
    console.error('Error fetching trip stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching trip stats', error: error.message });
  }
};
