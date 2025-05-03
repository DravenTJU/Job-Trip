import { ApiResponse, UserJob, CreateUserJobData, PaginatedResponse, ApplicationStatus } from '@/types';
import api from './api';

class UserJobService {
  async getUserJobs(params?: {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<UserJob>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<UserJob>>>('/userjobs', {
        params
      });
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取用户职位列表失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取用户职位列表失败');
    }
  }

  async getUserJob(id: string): Promise<UserJob> {
    try {
      const response = await api.get<ApiResponse<UserJob>>(`/userjobs/${id}`);
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取用户职位详情失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取用户职位详情失败');
    }
  }

  async createUserJob(userJobData: CreateUserJobData): Promise<UserJob> {
    try {
      const response = await api.post<ApiResponse<UserJob>>('/userjobs', userJobData);
      if (!response || !response.data || !response.data.data) {
        throw new Error('创建用户职位失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '创建用户职位失败');
    }
  }

  async updateUserJob(id: string, userJobData: Partial<CreateUserJobData>): Promise<UserJob> {
    try {
      const response = await api.put<ApiResponse<UserJob>>(`/userjobs/${id}`, userJobData);
      if (!response || !response.data || !response.data.data) {
        throw new Error('更新用户职位失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '更新用户职位失败');
    }
  }

  async deleteUserJob(id: string): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(`/userjobs/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '删除用户职位失败');
    }
  }

  async getStatusStats(): Promise<Record<ApplicationStatus, number>> {
    try {
      const response = await api.get<ApiResponse<Record<ApplicationStatus, number>>>('/userjobs/stats');
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取状态统计失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取状态统计失败');
    }
  }
}

export const userJobService = new UserJobService(); 