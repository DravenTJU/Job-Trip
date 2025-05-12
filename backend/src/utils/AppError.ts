/**
 * 自定义应用错误类，扩展标准Error类
 * 用于统一处理HTTP错误响应
 */
export class AppError extends Error {
  /**
   * HTTP状态码
   */
  statusCode: number;
  
  /**
   * 是否为操作型错误（用于区分操作错误和程序错误）
   */
  isOperational: boolean;

  /**
   * 创建一个AppError实例
   * @param message - 错误消息
   * @param statusCode - HTTP状态码
   * @param isOperational - 是否为可预期的操作错误，默认为true
   */
  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
} 