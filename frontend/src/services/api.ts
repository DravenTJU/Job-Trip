import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '../types/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 30000, // 增加默认超时时间到30秒
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
    
    // 为AI相关请求设置更长的超时时间
    if (config.url?.includes('/ai/')) {
      config.timeout = 60000; // 对AI请求设置60秒超时
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
    
    console.log('拦截器捕获错误:', {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data
    });

    // 401错误 - 清除token，但不自动重定向（让ProtectedRoute组件处理重定向）
    if (response?.status === 401) {
      localStorage.removeItem('token');
      // 只有在非API调用（例如直接页面导航）时才重定向
      const isApiCall = response.config.url?.startsWith('/api');
      if (!isApiCall && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    // 特别记录404错误 - 与用户档案不存在相关
    if (response?.status === 404) {
      console.log('检测到404错误 - 可能是用户档案不存在:', {
        url: response.config.url,
        responseData: response.data
      });
    }
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('请求超时，请稍后重试');
      return Promise.reject(new ApiError('请求超时，请稍后重试', 504));
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
        console.log('API响应包含错误码:', response.data.code, response.data.message);
        throw new ApiError(
          response.data.message || '请求出错',
          response.data.code,
          response.data
        );
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
      console.error('错误状态码:', error.response.status);
      
      // 检查404错误 - 用户档案不存在
      if (error.response.status === 404 && error.response.config.url?.includes('/user-profiles/me')) {
        console.log('用户档案不存在 - 应触发向导流程');
      }
      
      // 创建ApiError而非普通Error
      throw new ApiError(
        error.response.data.message || '服务器内部错误',
        error.response.status,
        error.response.data
      );
    }
    // 非AxiosError直接抛出
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