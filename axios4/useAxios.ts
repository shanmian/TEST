import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface UseAxiosState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

interface UseAxiosResponse<T> extends UseAxiosState<T> {
  refetch: (config?: AxiosRequestConfig) => Promise<void>;
  cancel: () => void;
}

const useAxios = <T = any>(
  config: AxiosRequestConfig,
  immediate = true
): UseAxiosResponse<T> => {
  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  // 创建取消控制器
  const controller = new AbortController();

  const fetchData = useCallback(async (currentConfig: AxiosRequestConfig) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // 添加取消控制器到请求配置
      const finalConfig = {
        ...currentConfig,
        signal: controller.signal
      };

      const response: AxiosResponse<T> = await axiosInstance(finalConfig);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      // 如果不是取消请求导致的错误，则更新错误状态
      if (!(error instanceof Error && error.name === 'CanceledError')) {
        setState({
          data: null,
          loading: false,
          error: error as AxiosError,
        });
      }
    }
  }, []);

  // 提供取消请求的方法
  const cancel = useCallback(() => {
    controller.abort();
  }, [controller]);

  // 提供重新请求的方法
  const refetch = useCallback((newConfig?: AxiosRequestConfig) => {
    return fetchData(newConfig || config);
  }, [config, fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData(config);
    }

    // 组件卸载时取消请求
    return () => {
      cancel();
    };
  }, [immediate, config.url]);

  return {
    ...state,
    refetch,
    cancel
  };
};

// 导出类型
export type { UseAxiosState, UseAxiosResponse };
export default useAxios;