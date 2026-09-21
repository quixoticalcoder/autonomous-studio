// utils/auth.js
// Authentication utility functions for frontend

/**
 * Store authentication token
 */
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Store user data
 */
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get user data
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getUser();
  return !!(token && user);
};

/**
 * Logout user
 */
export const logout = () => {
  removeAuthToken();
  window.location.href = '/auth';
};

/**
 * Get authorization headers for API requests
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Make authenticated API request
 */
export const apiRequest = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    // Handle 401 - Unauthorized
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/auth';
      throw new Error('Session expired. Please login again.');
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if token is expired (basic check)
 */
export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;

  try {
    // Decode JWT token (simple base64 decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
  } catch (error) {
    return true;
  }
};

/**
 * Refresh token if needed
 */
export const refreshTokenIfNeeded = async () => {
  if (isTokenExpired()) {
    try {
      const response = await apiRequest('http://localhost:5000/api/users/refresh', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.token) {
        setAuthToken(data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      logout();
      return false;
    }
  }
  return true;
};