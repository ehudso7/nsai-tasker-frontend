import apiService from './apiService';

const BASE_URL = '/reviews';

const reviewService = {
  // Get review queue
  getReviewQueue: async (params = {}) => {
    try {
      const response = await apiService.get(`${BASE_URL}/queue`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching the review queue' };
    }
  },

  // Get a specific review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await apiService.get(`${BASE_URL}/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching the review' };
    }
  },

  // Submit a review decision
  submitReview: async (taskId, reviewData) => {
    try {
      const response = await apiService.post(`${BASE_URL}/tasks/${taskId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while submitting the review' };
    }
  },

  // Get review metrics for the current reviewer
  getReviewerMetrics: async (timeframe = 'week') => {
    try {
      const response = await apiService.get(`${BASE_URL}/metrics`, { params: { timeframe } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching review metrics' };
    }
  },

  // Skip a review (move to the end of the queue)
  skipReview: async (taskId) => {
    try {
      const response = await apiService.post(`${BASE_URL}/tasks/${taskId}/skip`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while skipping the review' };
    }
  }
};

export default reviewService;
