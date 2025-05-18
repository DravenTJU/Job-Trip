import api from './api';
import { 
  JobStatus, 
  CreateUserJobData, 
  PaginatedResponse, 
  UserJob 
} from '@/types';

// 用户-职位关联服务
const userJobService = {
  // 获取用户关联的职位列表
  getUserJobs: async (params?: { 
    page?: number; 
    limit?: number;
    status?: JobStatus;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<UserJob>> => {
    try {
      return await api.get<PaginatedResponse<UserJob>>('/userjobs', params);
    } catch (error) {
      console.error('获取用户职位列表失败:', error);
      throw error;
    }
  },

  // 获取单个用户-职位关联
  getUserJob: async (id: string): Promise<UserJob> => {
    try {
      return await api.get<UserJob>(`/userjobs/${id}`);
    } catch (error) {
      console.error(`获取用户职位(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 创建用户-职位关联
  createUserJob: async (userJobData: CreateUserJobData): Promise<UserJob> => {
    try {
      return await api.post<UserJob>('/userjobs', userJobData);
    } catch (error) {
      console.error('创建用户职位关联失败:', error);
      throw error;
    }
  },

  // 更新用户-职位关联
  updateUserJob: async (id: string, userJobData: Partial<CreateUserJobData>): Promise<UserJob> => {
    try {
      return await api.put<UserJob>(`/userjobs/${id}`, userJobData);
    } catch (error) {
      console.error(`更新用户职位(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 删除用户-职位关联
  deleteUserJob: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/userjobs/${id}`);
    } catch (error) {
      console.error(`删除用户职位(ID: ${id})失败:`, error);
      throw error;
    }
  },
  
  // 获取状态统计
  getStatusStats: async (): Promise<Record<JobStatus, number>> => {
    try {
      return await api.get<Record<JobStatus, number>>('/userjobs/stats/status');
    } catch (error) {
      console.error('获取状态统计失败:', error);
      throw error;
    }
  }
};

export default userJobService; 