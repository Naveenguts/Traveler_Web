/**
 * Utility for making authenticated API calls with automatic token expiration handling
 */

export class TokenExpiredError extends Error {
  constructor(message = 'Token expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Make an authenticated fetch request with automatic token expiration handling
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {string} token - Authentication token
 * @returns {Promise<Response>} - Fetch response
 * @throws {TokenExpiredError} - When token is expired or invalid
 */
export const authenticatedFetch = async (url, options = {}, token) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle token expiration
  if (response.status === 401) {
    const data = await response.json();
    if (data?.message?.toLowerCase().includes('token expired') || 
        data?.message?.toLowerCase().includes('token invalid')) {
      throw new TokenExpiredError(data.message || 'Session expired');
    }
  }

  return response;
};

/**
 * Higher-order function that wraps API calls with token expiration handling
 * @param {Function} logout - Logout function from AuthContext
 * @param {Function} navigate - Navigate function from react-router
 * @returns {Function} - Wrapped fetch function
 */
export const createAuthenticatedFetch = (logout, navigate) => {
  return async (url, options = {}, token) => {
    try {
      return await authenticatedFetch(url, options, token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Auto-logout and redirect on token expiration
        logout();
        navigate('/login', { 
          state: { message: 'Session expired. Please log in again.' } 
        });
        throw error; // Re-throw so calling code can handle it
      }
      throw error;
    }
  };
};
