import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 定义响应数据接口
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取 token
    const token = localStorage.getItem('token');
    
    // 如果有 token 就添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加时间戳防止缓存
    if (config.method?.toUpperCase() === 'GET') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data;

    // 处理业务状态码
    switch (code) {
      case 200:
        return data;
      case 401:
        // 未登录或 token 过期
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('登录已过期，请重新登录'));
      case 403:
        return Promise.reject(new Error('没有权限访问'));
      case 500:
        return Promise.reject(new Error(message || '服务器错误'));
      default:
        return Promise.reject(new Error(message || '请求失败'));
    }
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('没有权限访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('未知错误');
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，请检查网络连接');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 导出实例和类型
export type { AxiosResponse, InternalAxiosRequestConfig };
export default instance;