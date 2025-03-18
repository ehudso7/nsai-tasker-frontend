import axios from 'axios';
import authService from './authService';
import { shouldRefreshToken } from '../utils/security';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiService.interceptors.request.use(
  async (config) => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      // Check if token needs refresh
      if (shouldRefreshToken(user.token)) {
        try {
          // Attempt to refresh the token
          const refreshedUser = await authService.refreshToken(user.refreshToken);
          if (refreshedUser && refreshedUser.token) {
            config.headers.Authorization = `Bearer ${refreshedUser.token}`;
          } else {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          // Use existing token if refresh fails
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const user = authService.getCurrentUser();
      if (user && user.refreshToken) {
        try {
          // Attempt to refresh the token
          const refreshedUser = await authService.refreshToken(user.refreshToken);
          if (refreshedUser && refreshedUser.token) {
            // Update the authorization header with new token
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshedUser.token}`;
            originalRequest.headers.Authorization = `Bearer ${refreshedUser.token}`;
            
            // Retry the original request
            return apiService(originalRequest);
          }
        } catch (refreshError) {
          // Logout user if token refresh fails
          authService.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Logout user if no refresh token is available
        authService.logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiService;
