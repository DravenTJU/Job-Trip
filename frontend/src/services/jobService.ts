import { ApiResponse, Job, CreateJobData, PaginatedResponse } from '@/types';
import api from './api';

// 职位服务
class JobService {
  // 获取职位列表
  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Job>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobs', {
        params
      });
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取职位列表失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取职位列表失败');
    }
  }

  // 获取职位详情
  async getJob(id: string): Promise<Job> {
    try {
      const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取职位详情失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取职位详情失败');
    }
  }

  // 创建职位
  async createJob(jobData: CreateJobData): Promise<Job> {
    try {
      const response = await api.post<ApiResponse<Job>>('/jobs', jobData);
      if (!response || !response.data || !response.data.data) {
        throw new Error('创建职位失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '创建职位失败');
    }
  }

  // 更新职位
  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    try {
      const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, jobData);
      if (!response || !response.data || !response.data.data) {
        throw new Error('更新职位失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '更新职位失败');
    }
  }

  // 删除职位
  async deleteJob(id: string): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(`/jobs/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '删除职位失败');
    }
  }
}

export const jobService = new JobService(); 