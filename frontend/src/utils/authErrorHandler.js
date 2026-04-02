/**
 * Authentication Error Handler Utility
 * Provides consistent handling of authentication-related errors across the app
 */

import { apiClient, API_ERROR_CODES } from '../services/apiClient';

/**
 * Check if an error is a token expiration/authentication error
 */
export const isAuthenticationError = (error) => {
  return (
    error?.code === API_ERROR_CODES.TOKEN_EXPIRED ||
    error?.status === 401 ||
    error?.message?.toLowerCase().includes('token expired') ||
    error?.message?.toLowerCase().includes('unauthorized')
  );
};

/**
 * Handle authentication errors and prompt user to login again
 * This should be called when any API call returns a 401 error
 */
export const handleAuthenticationError = (logoutFunc) => {
  // Logout the user to clear invalid token
  logoutFunc();

  // Show confirmation dialog
  const confirmed = window.confirm(
    'Your session has expired.\n\nPlease login again to continue.'
  );

  // Redirect to login if user confirms
  if (confirmed) {
    window.location.href = '/login';
  }
};

/**
 * Wraps an async API call and handles authentication errors automatically
 * @param {Function} apiCall - The async API function to call
 * @param {Function} logoutFunc - The logout function from useAuth
 * @param {string} errorMessage - Custom error message to show
 * @returns {Promise} The result of the API call
 */
export const executeWithAuthCheck = async (
  apiCall,
  logoutFunc,
  errorMessage = null
) => {
  try {
    return await apiCall();
  } catch (error) {
    if (isAuthenticationError(error)) {
      handleAuthenticationError(logoutFunc);
      throw error;
    }
    
    // Re-throw with custom message if provided
    if (errorMessage) {
      error.message = errorMessage;
    }
    throw error;
  }
};

export default {
  isAuthenticationError,
  handleAuthenticationError,
  executeWithAuthCheck
};
