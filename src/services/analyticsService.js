import apiService from './apiService';

const BASE_URL = '/analytics';

const analyticsService = {
  // Get system overview metrics
  getSystemOverview: async (timeframe = 'week') => {
    try {
      const response = await apiService.get(`${BASE_URL}/overview`, { params: { timeframe } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching system overview' };
    }
  },

  // Get task metrics
  getTaskMetrics: async (params = {}) => {
    try {
      const response = await apiService.get(`${BASE_URL}/tasks`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching task metrics' };
    }
  },

  // Get review performance metrics
  getReviewMetrics: async (params = {}) => {
    try {
      const response = await apiService.get(`${BASE_URL}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching review metrics' };
    }
  },

  // Get AI operation metrics
  getAIMetrics: async (params = {}) => {
    try {
      const response = await apiService.get(`${BASE_URL}/ai-operations`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching AI metrics' };
    }
  },

  // Get cost analysis data
  getCostAnalysis: async (timeframe = 'month') => {
    try {
      const response = await apiService.get(`${BASE_URL}/costs`, { params: { timeframe } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching cost analysis data' };
    }
  }
};

export default analyticsService;
