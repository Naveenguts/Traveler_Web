const Destination = require('../models/Destination');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ averageRating: -1 });
    
    res.json({
      success: true,
      count: destinations.length,
      destinations
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch destinations',
      error: error.message
    });
  }
};

// Get single destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await Destination.findById(id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    res.json({
      success: true,
      destination
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch destination',
      error: error.message
    });
  }
};

// Seed destinations (for development/setup)
exports.seedDestinations = async (req, res) => {
  try {
    const destinations = [
      {
        name: 'Paris',
        country: 'France',
        description: 'City of Lights',
        longDescription: 'Paris, the capital of France, is one of the most iconic cities in the world. Known for its art, fashion, gastronomy, and culture, Paris offers unforgettable experiences from the Eiffel Tower to the Louvre Museum.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
        price: 2500,
        duration: 7
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        description: 'Land of the Rising Sun',
        longDescription: 'Tokyo is a bustling metropolis that seamlessly blends ancient traditions with modern technology. Experience incredible food, vibrant neighborhoods, and rich cultural heritage.',
        image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=800&h=500&fit=crop',
        price: 3200,
        duration: 10
      },
      {
        name: 'New York',
        country: 'USA',
        description: 'The Big Apple',
        longDescription: 'New York City is the city that never sleeps. From Times Square to Central Park, Broadway shows to world-class museums, NYC offers endless excitement and cultural diversity.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop',
        price: 2800,
        duration: 5
      },
      {
        name: 'London',
        country: 'UK',
        description: 'The Capital of England',
        longDescription: 'London combines centuries of history with cutting-edge innovation. Visit Buckingham Palace, explore world-renowned museums, and enjoy the vibrant theater scene.',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
        price: 2200,
        duration: 6
      },
      {
        name: 'Dubai',
        country: 'UAE',
        description: 'City of Gold',
        longDescription: 'Dubai is a futuristic city in the desert, known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Experience the Burj Khalifa and traditional souks.',
        image: 'https://images.unsplash.com/photo-1512453693020-ce7e46f9e4c9?w=800&h=500&fit=crop',
        price: 3500,
        duration: 8
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        description: 'City by the Sea',
        longDescription: 'Barcelona offers stunning architecture by Gaudí, beautiful beaches, delicious cuisine, and a vibrant cultural scene. The perfect blend of urban excitement and Mediterranean relaxation.',
        image: 'https://images.unsplash.com/photo-1562883676-8c6fbdf495c0?w=800&h=500&fit=crop',
        price: 1800,
        duration: 5
      }
    ];

    // Clear existing destinations
    await Destination.deleteMany({});
    
    // Insert new destinations
    const createdDestinations = await Destination.insertMany(destinations);

    res.json({
      success: true,
      message: 'Destinations seeded successfully',
      count: createdDestinations.length,
      destinations: createdDestinations
    });
  } catch (error) {
    console.error('Seed destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed destinations',
      error: error.message
    });
  }
};

module.exports = exports;
