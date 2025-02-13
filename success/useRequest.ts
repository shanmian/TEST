import { useState, useCallback } from 'react';
import type { AxiosRequestConfig } from 'axios';
import axiosInstance from '../utils/axios';

/**
 * Request options interface
 * @template T - Response data type
 */
interface RequestOptions<T> {
  manual?: boolean;      // Whether to trigger request manually
  onSuccess?: (data: T) => void;    // Success callback
  onError?: (error: Error) => void;  // Error callback
  initialData?: T | null;    // Initial data
}

/**
 * Request result interface
 * @template T - Response data type
 */
interface RequestResult<T> {
  data: T | null;        // Response data
  loading: boolean;      // Loading state
  error: Error | null;   // Error information
  run: (config?: AxiosRequestConfig) => Promise<void>;  // Execute request method
  reset: () => void;     // Reset state method
}

/**
 * Custom request hook
 * @param config - Axios request configuration
 * @param options - Request options
 * @returns Request result object
 */
function useRequest<T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions<T> = {}
): RequestResult<T> {
  // Destructure options with default values
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

  /**
   * Execute request method
   * @param runConfig - Optional runtime configuration, will be merged with initial config
   */
  const run = useCallback(async (runConfig?: AxiosRequestConfig) => {
    const finalConfig = { ...config, ...runConfig };
    setLoading(true);
    setError(null);
    
    try {
      const res = await axiosInstance.request<T>(finalConfig);
      setData(res as T);
      onSuccess?.(res as T);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Request failed');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [config, onSuccess, onError]);

  /**
   * Reset all states to initial values
   */
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, loading, error, run, reset };
}

export default useRequest;