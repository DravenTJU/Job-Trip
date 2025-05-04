interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export const createApiResponse = <T = any>(
  code: number,
  message: string,
  data?: T
): ApiResponse<T> => {
  return {
    code,
    message,
    data
  };
}; 