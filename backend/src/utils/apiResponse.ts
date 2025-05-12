/**
 * 统一API响应格式接口
 * @template T - 响应数据的类型
 */
interface ApiResponse<T = any> {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data?: T;
  /** 响应时间戳 */
  timestamp?: number;
  /** 请求追踪ID */
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
export const createApiResponse = <T = any>(
  code: number,
  message: string,
  data?: T,
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