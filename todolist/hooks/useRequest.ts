import { useState, useCallback, useRef, useEffect } from 'react';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import axiosInstance from '../utils/axios';

/**
 * Interface for request options
 * @template T - Response data type
 */
interface RequestOptions<T> {
  manual?: boolean;      // Whether to trigger request manually
  onSuccess?: (data: T) => void;    // Success callback
  onError?: (error: Error) => void;  // Error callback
  initialData?: T | null;    // Initial data
}

/**
 * Interface for request result
 * @template T - Response data type
 */
interface RequestResult<T> {
  data: T | null;        // Response data
  loading: boolean;      // Loading state
  error: Error | null;   // Error state
  run: (config?: AxiosRequestConfig) => Promise<T>;  // Execute request method
  reset: () => void;     // Reset state method
  refresh: () => Promise<T>;  // Refresh data method
}

/**
 * Custom hook for making HTTP requests
 * @template T - Response data type
 * @param config - Axios request configuration
 * @param options - Request options
 * @returns Request result object
 */
function useRequest<T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions<T> = {}
): RequestResult<T> {
  // Extract options with default values
  const { 
    manual = false,      // Manual trigger flag
    onSuccess,           // Success callback
    onError,            // Error callback
    initialData = null  // Initial data
  } = options;

  // State management
  const [loading, setLoading] = useState(!manual);  // Loading state
  const [data, setData] = useState<T | null>(initialData);  // Data state
  const [error, setError] = useState<Error | null>(null);   // Error state

  // Request controller reference
  const abortControllerRef = useRef<AbortController>();

  /**
   * Execute request with configuration
   * @param runConfig - Optional runtime configuration
   * @returns Promise with response data
   */
  const run = useCallback(async (runConfig?: AxiosRequestConfig): Promise<T> => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller
    abortControllerRef.current = new AbortController();
    
    // Merge configurations
    const finalConfig = { 
      ...config, 
      ...runConfig,
      signal: abortControllerRef.current.signal 
    };

    setLoading(true);
    setError(null);
    
    try {
      const res = await axiosInstance.request<T>(finalConfig);
      const data = res as T;
      setData(data);
      onSuccess?.(data);
      return data;
    } catch (err) {
      if (axios.isCancel(err)) {
        return Promise.reject(err);
      }
      const error = err instanceof Error ? err : new Error('Request failed');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [config, onSuccess, onError]);

  /**
   * Cleanup on component unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Reset all states to initial values
   */
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  /**
   * Refresh data using current configuration
   */
  const refresh = useCallback((): Promise<T> => {
    return run();
  }, [run]);

  return { data, loading, error, run, reset, refresh };
}

export default useRequest;