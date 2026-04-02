import { apiClient, API_ERROR_CODES } from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Review API functions
export const reviewAPI = {
  // Create a new review
  async createReview(destinationId, destinationName, rating, comment, token) {
    try {
      console.log('Creating review with:', {
        destinationId,
        destinationName,
        rating,
        comment,
        tokenExists: !!token
      });
      
      return await apiClient.post(
        '/reviews',
        { destinationId, destinationName, rating, comment },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Review creation error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        fullError: error.fullError
      });
      
      // Re-throw with proper error code for token expiration
      if (error.code === API_ERROR_CODES.TOKEN_EXPIRED) {
        error.message = 'Your session has expired. Please login again to submit a review.';
      }
      throw error;
    }
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
    try {
      return await apiClient.put(
        `/reviews/${reviewId}`,
        { rating, comment },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      if (error.code === API_ERROR_CODES.TOKEN_EXPIRED) {
        error.message = 'Your session has expired. Please login again to update a review.';
      }
      throw error;
    }
  },

  // Delete a review
  async deleteReview(reviewId, token) {
    try {
      return await apiClient.delete(
        `/reviews/${reviewId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      if (error.code === API_ERROR_CODES.TOKEN_EXPIRED) {
        error.message = 'Your session has expired. Please login again to delete a review.';
      }
      throw error;
    }
  },

  // Mark review as helpful
  async markHelpful(reviewId, token) {
    try {
      return await apiClient.post(
        `/reviews/${reviewId}/helpful`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      if (error.code === API_ERROR_CODES.TOKEN_EXPIRED) {
        error.message = 'Your session has expired. Please login again.';
      }
      throw error;
    }
  },

  // Get user's reviews
  async getUserReviews(token) {
    try {
      return await apiClient.get(
        '/reviews/my-reviews',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      if (error.code === API_ERROR_CODES.TOKEN_EXPIRED) {
        error.message = 'Your session has expired. Please login again to fetch your reviews.';
      }
      throw error;
    }
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
