import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Map to store pending requests and their cancel controllers
 * Used to prevent duplicate requests
 */
const pendingMap = new Map<string, AbortController>();

/**
 * Generate unique request key
 * @param config - Request configuration
 * @returns String key to identify the request
 */
function generateRequestKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

/**
 * Remove pending request and create new abort controller
 * @param config - Request configuration
 */
function removePendingRequest(config: InternalAxiosRequestConfig) {
  const requestKey = generateRequestKey(config);
  if (pendingMap.has(requestKey)) {
    const controller = pendingMap.get(requestKey);
    controller?.abort();
    pendingMap.delete(requestKey);
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(requestKey, controller);
}

/**
 * Create axios instance with default configuration
 */
const instance: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',  // Disable browser caching
    'Pragma': 'no-cache'
  }
});

/**
 * Request interceptor
 * Handle request before it is sent
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp to prevent cache
    const timestamp = new Date().getTime();
    config.params = { 
      ...config.params,
      _t: timestamp 
    };
    // Cancel duplicate requests
    removePendingRequest(config);
    
    // Add authorization token if exists
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle response data and errors
 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Remove request from pending map
    const requestKey = generateRequestKey(response.config);
    pendingMap.delete(requestKey);
    
    return response.data;
  },
  (error) => {
    // Remove request from pending map on error
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      pendingMap.delete(requestKey);
    }
    
    // Handle unauthorized error
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;