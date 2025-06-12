/**
 * API Configuration for Frontend
 * Handles environment-specific API URLs and authentication
 */

// Get API URL from environment variables or use default
const getApiUrl = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Use AWS Elastic Beanstalk URL for production
  if (process.env.NODE_ENV === 'production') {
    return 'http://user-analytics-backend-env.eba-kc7wz3xt.eu-north-1.elasticbeanstalk.com';
  }

  // Use AWS backend for now (fallback)
  return 'http://user-analytics-backend-env.eba-kc7wz3xt.eu-north-1.elasticbeanstalk.com';
};

// Export the base API URL
export const API_BASE_URL = getApiUrl();

// API endpoints configuration
export const API_ENDPOINTS = {
  // Developer authentication
  DEVELOPER_LOGIN: '/developers/login',
  DEVELOPER_REGISTER: '/developers/register',
  
  // Application management
  APPS_MY_APPS: '/apps/my-apps',
  APPS_CREATE: '/apps/create',
  
  // Analytics tracking
  TRACK: '/track',
  TRACK_STATS_COUNT: '/track/stats/count',
  TRACK_STATS_ALL_USERS: '/track/stats/all-users',
  TRACK_STATS_BY_USER_BY_DATE: '/track/stats/by-user/by-date',
  TRACK_STATS_BY_DATE: '/track/stats/by-date',
  TRACK_STATS_BY_CATEGORY: '/track/stats/by-category',
  
  // Screen time
  SCREEN_TIME: '/screen-time',
  
  // Health check
  HEALTH: '/health'
};

// Helper function to build full URL
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }
  
  return url;
};

// Helper function to get JWT token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('developerToken');
};

// Helper function to create authenticated headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function for authenticated API calls
export const authenticatedFetch = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  
  const config = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };
  
  console.log('🔐 Making authenticated request to:', url);
  console.log('🔑 With headers:', authHeaders);
  
  return fetch(url, config);
};

// HTTP client configuration
export const HTTP_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
};

// Environment info
export const ENV_INFO = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: API_BASE_URL,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development'
};

console.log('🔧 API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: ENV_INFO.environment,
  isDevelopment: ENV_INFO.isDevelopment
});
