import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Store request identifiers and cancel functions
const pendingMap = new Map<string, AbortController>();

// Generate unique request identifier
function generateRequestKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

// Cancel duplicate requests
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

// Create axios instance with default config
const instance: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',  // Disable browser caching
    'Pragma': 'no-cache'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    config.params = { 
      ...config.params,
      _t: timestamp 
    };
    
    // Handle duplicate requests
    removePendingRequest(config);
    
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Remove request from pending map after completion
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