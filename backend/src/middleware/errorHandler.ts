import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

/**
 * 统一API响应格式接口
 * @template T - 响应数据的类型
 */
export interface ApiResponse<T> {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T | null;
  /** 响应时间戳 */
  timestamp: number;
  /** 请求追踪ID，可选 */
  traceId?: string;
}

/**
 * 创建统一格式的API响应对象
 * @template T - 响应数据的类型
 * @param code - 响应状态码
 * @param message - 响应消息
 * @param data - 响应数据，默认为null
 * @param traceId - 请求追踪ID，可选
 * @returns 格式化的API响应对象
 */
export const createApiResponse = <T>(
  code: number, 
  message: string, 
  data: T | null = null,
  traceId?: string
): ApiResponse<T> => {
  return {
    code,
    message,
    data,
    timestamp: Date.now(),
    ...(traceId && { traceId })
  };
};

/**
 * 全局错误处理中间件
 * 处理应用程序中的所有错误，将其转换为统一的API响应格式
 * 
 * @param err - 捕获的错误对象
 * @param req - Express请求对象
 * @param res - Express响应对象
 * @param next - Express下一个中间件函数
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // 默认错误状态码和消息
  let statusCode = 500;
  let message = '服务器内部错误';
  let isOperational = false;
  let code = 500;

  // 如果是自定义的AppError，使用其状态码和消息
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    code = statusCode;
  } else if (err.name === 'ValidationError') {
    // Mongoose验证错误
    statusCode = 400;
    code = 400;
    message = err.message;
    isOperational = true;
  } else if (err.name === 'CastError') {
    // Mongoose类型转换错误
    statusCode = 400;
    code = 400;
    message = '无效的数据ID';
    isOperational = true;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT错误
    statusCode = 401;
    code = 401;
    message = '无效的令牌，请重新登录';
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    // JWT过期
    statusCode = 401;
    code = 401;
    message = '令牌已过期，请重新登录';
    isOperational = true;
  }

  // 生成请求的追踪ID
  const traceId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 记录错误日志
  if (isOperational) {
    logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - traceId: ${traceId}`);
  } else {
    logger.error(
      `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - traceId: ${traceId}`,
      { stack: err.stack }
    );
  }

  // 发送错误响应
  res.status(statusCode).json(createApiResponse(
    code,
    message,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
    traceId as string
  ));
}; 