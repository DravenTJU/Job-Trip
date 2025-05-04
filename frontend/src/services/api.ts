import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    
    // 401错误 - 清除token，但不自动重定向（让ProtectedRoute组件处理重定向）
    if (response?.status === 401) {
      localStorage.removeItem('token');
      // 只有在非API调用（例如直接页面导航）时才重定向
      const isApiCall = response.config.url?.startsWith('/api');
      if (!isApiCall && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// 通用请求函数
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    console.log('发送请求:', {
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params
    });
    
    const response: AxiosResponse = await apiClient(config);
    console.log('收到响应:', response.data);
    
    // 检查是否是新的统一API响应格式
    if (response.data && ('code' in response.data) && ('data' in response.data)) {
      // 处理错误码
      if (response.data.code >= 400) {
        throw new Error(response.data.message || '请求出错');
      }
      // 返回data字段的内容
      return response.data.data as T;
    }
    
    // 向下兼容旧API格式
    return response.data as T;
  } catch (error) {
    console.error('API错误详情:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('服务器响应:', error.response.data);
      throw new Error(error.response.data.message || '服务器内部错误');
    }
    throw error;
  }
};

// API服务导出
export default {
  get: <T>(url: string, params?: any) => 
    request<T>({ method: 'GET', url, params }),
  
  post: <T>(url: string, data?: any) => 
    request<T>({ method: 'POST', url, data }),
  
  put: <T>(url: string, data?: any) => 
    request<T>({ method: 'PUT', url, data }),
  
  delete: <T>(url: string) => 
    request<T>({ method: 'DELETE', url }),
}; 