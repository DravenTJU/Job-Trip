// 添加自定义API错误类型
export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    
    // 确保instanceof正常工作
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// 判断错误是否为ApiError的类型保护函数
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
} 