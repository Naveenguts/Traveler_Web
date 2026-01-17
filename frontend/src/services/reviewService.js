const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Review API functions
export const reviewAPI = {
  // Create a new review
  async createReview(destinationId, destinationName, rating, comment, token) {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ destinationId, destinationName, rating, comment })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create review');
    }
    
    return response.json();
  },

  // Get reviews for a destination
  async getDestinationReviews(destinationId, page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/reviews/destination/${destinationId}?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    return response.json();
  },

  // Update a review
  async updateReview(reviewId, rating, comment, token) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update review');
    }
    
    return response.json();
  },

  // Delete a review
  async deleteReview(reviewId, token) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete review');
    }
    
    return response.json();
  },

  // Mark review as helpful
  async markHelpful(reviewId, token) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark review');
    }
    
    return response.json();
  },

  // Get user's reviews
  async getUserReviews(token) {
    const response = await fetch(`${API_URL}/reviews/my-reviews`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }
    
    return response.json();
  }
};

// Destination API functions
export const destinationAPI = {
  // Get all destinations
  async getAllDestinations() {
    const response = await fetch(`${API_URL}/destinations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    
    return response.json();
  },

  // Get single destination
  async getDestination(id) {
    const response = await fetch(`${API_URL}/destinations/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }
    
    return response.json();
  },

  // Seed destinations (for development)
  async seedDestinations() {
    const response = await fetch(`${API_URL}/destinations/seed`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to seed destinations');
    }
    
    return response.json();
  }
};
