import api from './api';
import { CreateResumeData, PaginatedResponse, Resume, UpdateResumeData } from '@/types';

// 简历服务
const resumeService = {
  // 获取简历列表
  getResumes: async (params?: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Resume>> => {
    try {
      return await api.get<PaginatedResponse<Resume>>('/resumes', params);
    } catch (error) {
      console.error('获取简历列表失败:', error);
      throw error;
    }
  },

  // 获取单个简历
  getResume: async (id: string): Promise<Resume> => {
    try {
      return await api.get<Resume>(`/resumes/${id}`);
    } catch (error) {
      console.error(`获取简历(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 创建简历
  createResume: async (resumeData: CreateResumeData): Promise<Resume> => {
    try {
      return await api.post<Resume>('/resumes', resumeData);
    } catch (error) {
      console.error('创建简历失败:', error);
      throw error;
    }
  },

  // 更新简历
  updateResume: async (id: string, resumeData: UpdateResumeData): Promise<Resume> => {
    try {
      return await api.put<Resume>(`/resumes/${id}`, resumeData);
    } catch (error) {
      console.error(`更新简历(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 删除简历
  deleteResume: async (id: string): Promise<void> => {
    try {
      await api.delete(`/resumes/${id}`);
    } catch (error) {
      console.error(`删除简历(ID: ${id})失败:`, error);
      throw error;
    }
  },

  // 复制简历
  duplicateResume: async (id: string): Promise<Resume> => {
    try {
      return await api.post<Resume>(`/resumes/${id}/duplicate`);
    } catch (error) {
      console.error(`复制简历(ID: ${id})失败:`, error);
      throw error;
    }
  },
};

export default resumeService;