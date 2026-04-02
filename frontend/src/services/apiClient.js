/**
 * API Client for handling common API operations and error handling
 * Handles authentication errors, token expiration, and provides consistent responses
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Error codes for different scenarios
export const API_ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

class APIClient {
  constructor() {
    this.authErrorCallback = null;
  }

  /**
   * Set callback to handle authentication errors
   * This is called when token is expired or invalid
   */
  setAuthErrorHandler(callback) {
    this.authErrorCallback = callback;
  }

  /**
   * Make an API request with error handling
   */
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      // Handle 401 - Unauthorized/Token Expired
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Token expired. Please login again.');
        error.code = API_ERROR_CODES.TOKEN_EXPIRED;
        error.status = 401;
        error.fullError = errorData;

        // Call auth error handler if set
        if (this.authErrorCallback) {
          this.authErrorCallback(error);
        }

        throw error;
      }

      // Handle other error responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText || 'Unknown error' };
        }
        
        // Extract the message from different possible response formats
        const errorMessage = 
          errorData.message || 
          errorData.error || 
          errorData.msg ||
          `API Error: ${response.status}`;

        const error = new Error(errorMessage);
        error.status = response.status;
        error.code =
          response.status === 404
            ? API_ERROR_CODES.NOT_FOUND
            : response.status >= 500
            ? API_ERROR_CODES.SERVER_ERROR
            : 'API_ERROR';
        error.fullError = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError) {
        const networkError = new Error(
          'Network error. Please check your connection.'
        );
        networkError.code = API_ERROR_CODES.NETWORK_ERROR;
        networkError.originalError = error;
        throw networkError;
      }

      // Re-throw known errors
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create and export singleton instance
export const apiClient = new APIClient();

export default apiClient;
