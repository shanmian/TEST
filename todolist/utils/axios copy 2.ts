import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 存储请求标识和取消函数的 Map
const pendingMap = new Map<string, AbortController>();

// 生成请求标识
function generateRequestKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

// 取消重复请求
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

const instance: AxiosInstance = axios.create({
   baseURL: 'https://jsonplaceholder.typicode.com',
//  baseURL: 'http://localhost:5173/static',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',  // 添加禁用缓存的头
    'Pragma': 'no-cache'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
     // 添加时间戳参数，防止缓存
     const timestamp = new Date().getTime();
     config.params = { 
       ...config.params,
       _t: timestamp 
     };
    // 取消重复请求
    removePendingRequest(config);
    
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成后，从 pendingMap 中移除
    const requestKey = generateRequestKey(response.config);
    pendingMap.delete(requestKey);
    //
    //
     // 添加响应数据的状态码判断
     console.log('响应数据',response)
    //  const { code, message } = response.data;
    
    //  if (code !== 200 || response.status !== 200) {
    //    return Promise.reject(new Error(message || '请求失败'));
    //  }
     return response.data;
  },
  (error) => {
    // 请求错误时，从 pendingMap 中移除
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      pendingMap.delete(requestKey);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;