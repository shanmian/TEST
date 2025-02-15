import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * API Response Interface
 * @template T - Response data type
 */
export interface ApiResponse<T = any> {
  code: number;      // Response status code
  data: T;          // Response data
  message: string;   // Response message
}

/**
 * Create axios instance
 * Configure base URL, timeout and headers
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor
 * Handle requests before they are sent
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // Add token to request headers if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle response data and errors uniformly
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data;
    // Throw error if status code is not 200
    if (code !== 200) {
      return Promise.reject(new Error(message || 'Request failed'));
    }
    return data;
  },
  (error) => {
    // Handle 401 unauthorized error
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;