import api from './api';
import { CreateJobData, Job, PaginatedResponse } from '@/types';

// 职位服务
const jobService = {
  // 获取职位列表
  getJobs: async (params?: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Job>> => {
    try {
      // 调用API获取职位列表，response.data.data已经在api.ts中提取
      return await api.get<PaginatedResponse<Job>>('/jobs', params);
    } catch (error) {
      console.error('获取职位列表失败:', error);
      throw error;
    }
  },

  // 获取用户关联的职位列表
  getUserRelatedJobs: async (params?: { 
    page?: number; 
    limit?: number;
    status?: string;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Job>> => {
    try {
      return await api.get<PaginatedResponse<Job>>('/jobs/user', params);
    } catch (error) {
      console.error('获取用户关联职位列表失败:', error);
      throw error;
    }
  },

  // 获取单个职位
  getJob: async (id: string): Promise<Job> => {
    try {
      return await api.get<Job>(`/jobs/${id}`);
    } catch (error) {
      console.error(`获取职位(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 创建职位
  createJob: async (jobData: CreateJobData): Promise<Job> => {
    try {
      return await api.post<Job>('/jobs', jobData);
    } catch (error) {
      console.error('创建职位失败:', error);
      throw error;
    }
  },

  // 更新职位
  updateJob: async (id: string, jobData: Partial<CreateJobData>): Promise<Job> => {
    try {
      return await api.put<Job>(`/jobs/${id}`, jobData);
    } catch (error) {
      console.error(`更新职位(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 删除职位
  deleteJob: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/jobs/${id}`);
    } catch (error) {
      console.error(`删除职位(ID: ${id})失败:`, error);
      throw error;
    }
  }
};

export default jobService; 