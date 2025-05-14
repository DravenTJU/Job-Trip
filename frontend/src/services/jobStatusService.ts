import api from './api';
import { Job, UserJob } from '@/types';

/**
 * 职位状态服务
 * 直接与API交互，绕过Redux，用于UI快速更新场景
 */
const jobStatusService = {
  /**
   * 更新职位状态
   * @param jobId 职位ID
   * @param status 新状态
   * @returns 更新后的职位对象
   */
  updateJobStatus: async (jobId: string, status: string): Promise<Job> => {
    try {
      return await api.put<Job>(`/jobs/${jobId}/status`, { status });
    } catch (error) {
      console.error(`更新职位状态失败(ID: ${jobId}, 状态: ${status}):`, error);
      throw error;
    }
  },
  
  /**
   * 获取用户对特定职位的状态
   * @param jobId 职位ID
   * @returns 用户-职位关联对象
   */
  getUserJobStatus: async (jobId: string): Promise<UserJob | null> => {
    try {
      // 查询参数限定查询特定jobId
      const response = await api.get<{data: UserJob[]}>(`/userjobs`, { jobId });
      // 如果有结果，返回第一条
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error(`获取职位状态失败(ID: ${jobId}):`, error);
      return null;
    }
  }
};

export default jobStatusService; 