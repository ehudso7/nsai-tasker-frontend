export const securityConfig = {
  // Configure security settings for the application
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes in milliseconds
  maxTokenAge: 60 * 60 * 1000, // 1 hour in milliseconds
};

// Function to check if token refresh is needed
export const shouldRefreshToken = (token) => {
  if (!token) return false;
  
  try {
    // Parse the JWT token (simplified for demonstration)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    // Return true if token is approaching expiration
    return expiryTime - currentTime < securityConfig.tokenRefreshThreshold;
  } catch (error) {
    console.error('Error checking token refresh:', error);
    return false;
  }
};
