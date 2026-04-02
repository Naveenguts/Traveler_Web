import apiClient from './apiClient';

const API_BASE = '/activities';

const activityService = {
  // Get all activities for a specific destination
  getActivitiesByDestination: async (destination, options = {}) => {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        sort = 'rating',
        page = 1,
        limit = 10
      } = options;

      let query = `${API_BASE}/destination/${destination}?page=${page}&limit=${limit}&sort=${sort}`;

      if (category) query += `&category=${category}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;

      const response = await apiClient.get(query);
      return response;
    } catch (error) {
      console.error('Error fetching activities by destination:', error);
      throw error;
    }
  },

  // Get single activity detail
  getActivityDetail: async (activityId) => {
    try {
      const response = await apiClient.get(`${API_BASE}/${activityId}`);
      return response;
    } catch (error) {
      console.error('Error fetching activity detail:', error);
      throw error;
    }
  },

  // Get activities by category
  getActivitiesByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(
        `${API_BASE}/category/${category}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching activities by category:', error);
      throw error;
    }
  },

  // Search activities
  searchActivities: async (query, filters = {}) => {
    try {
      const { category, minPrice, maxPrice } = filters;

      let url = `${API_BASE}/search?query=${query}`;
      if (category) url += `&category=${category}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error searching activities:', error);
      throw error;
    }
  },

  // Create activity (admin only)
  createActivity: async (activityData) => {
    try {
      const response = await apiClient.post(`${API_BASE}`, activityData);
      return response;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  // Update activity
  updateActivity: async (activityId, activityData) => {
    try {
      const response = await apiClient.put(`${API_BASE}/${activityId}`, activityData);
      return response;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  // Delete activity
  deleteActivity: async (activityId) => {
    try {
      const response = await apiClient.delete(`${API_BASE}/${activityId}`);
      return response;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }
};

export default activityService;
