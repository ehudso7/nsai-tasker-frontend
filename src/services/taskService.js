import apiService from './apiService';

const BASE_URL = '/tasks';

const taskService = {
  // Get all tasks with optional filtering
  getTasks: async (params = {}) => {
    try {
      const response = await apiService.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching tasks' };
    }
  },

  // Get a specific task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await apiService.get(`${BASE_URL}/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching the task' };
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await apiService.post(BASE_URL, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while creating the task' };
    }
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await apiService.put(`${BASE_URL}/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating the task' };
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await apiService.delete(`${BASE_URL}/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while deleting the task' };
    }
  },

  // Submit a task for review
  submitForReview: async (taskId) => {
    try {
      const response = await apiService.post(`${BASE_URL}/${taskId}/submit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while submitting the task for review' };
    }
  }
};

export default taskService;
