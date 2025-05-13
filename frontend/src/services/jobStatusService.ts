import api from './api';
import { Job } from '@/types';

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
  }
};

export default jobStatusService; 