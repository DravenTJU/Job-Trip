import api, { ApiResponse } from './api';
import { IProfile, IEducation, IWorkExperience, ISkill } from '@/types/profile';

export const profileService = {
  // 获取用户档案
  getProfile: async (): Promise<IProfile> => {
    try {
      const response = await api.get<ApiResponse<IProfile>>('/profiles');
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '获取档案失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('获取档案失败:', error);
      throw error;
    }
  },

  // 更新用户档案
  updateProfile: async (data: Partial<IProfile>): Promise<IProfile> => {
    try {
      const response = await api.put<ApiResponse<IProfile>>('/profiles', data);
      const responseData = response.data;
      if (!responseData || !responseData.success || !responseData.data) {
        throw new Error(responseData?.message || '更新档案失败：响应数据为空');
      }
      return responseData.data;
    } catch (error) {
      console.error('更新档案失败:', error);
      throw error;
    }
  },

  // 添加教育经历
  addEducation: async (education: Omit<IEducation, '_id'>): Promise<IEducation> => {
    try {
      const response = await api.post<ApiResponse<IEducation>>('/profiles/educations', education);
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '添加教育经历失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('添加教育经历失败:', error);
      throw error;
    }
  },

  // 更新教育经历
  updateEducation: async (id: string, education: Partial<IEducation>): Promise<IEducation> => {
    try {
      const response = await api.put<ApiResponse<IEducation>>(`/profiles/educations/${id}`, education);
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '更新教育经历失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('更新教育经历失败:', error);
      throw error;
    }
  },

  // 删除教育经历
  deleteEducation: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<ApiResponse>(`/profiles/educations/${id}`);
      const data = response.data;
      if (!data || !data.success) {
        throw new Error(data?.message || '删除教育经历失败');
      }
    } catch (error) {
      console.error('删除教育经历失败:', error);
      throw error;
    }
  },

  // 添加工作经历
  addWorkExperience: async (workExperience: Omit<IWorkExperience, '_id'>): Promise<IWorkExperience> => {
    try {
      const response = await api.post<ApiResponse<IWorkExperience>>('/profiles/work-experiences', workExperience);
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '添加工作经历失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('添加工作经历失败:', error);
      throw error;
    }
  },

  // 更新工作经历
  updateWorkExperience: async (id: string, workExperience: Partial<IWorkExperience>): Promise<IWorkExperience> => {
    try {
      const response = await api.put<ApiResponse<IWorkExperience>>(`/profiles/work-experiences/${id}`, workExperience);
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '更新工作经历失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('更新工作经历失败:', error);
      throw error;
    }
  },

  // 删除工作经历
  deleteWorkExperience: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<ApiResponse>(`/profiles/work-experiences/${id}`);
      const data = response.data;
      if (!data || !data.success) {
        throw new Error(data?.message || '删除工作经历失败');
      }
    } catch (error) {
      console.error('删除工作经历失败:', error);
      throw error;
    }
  },

  // 添加技能
  addSkill: async (skill: Omit<ISkill, '_id'>): Promise<ISkill> => {
    try {
      const response = await api.post<ApiResponse<ISkill>>('/profiles/skills', skill);
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '添加技能失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('添加技能失败:', error);
      throw error;
    }
  },

  // 更新技能
  updateSkill: async (id: string, skill: Partial<ISkill>): Promise<ISkill> => {
    try {
      const response = await api.put<ApiResponse<ISkill>>(`/profiles/skills/${id}`, skill);
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '更新技能失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('更新技能失败:', error);
      throw error;
    }
  },

  // 删除技能
  deleteSkill: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<ApiResponse>(`/profiles/skills/${id}`);
      const data = response.data;
      if (!data || !data.success) {
        throw new Error(data?.message || '删除技能失败');
      }
    } catch (error) {
      console.error('删除技能失败:', error);
      throw error;
    }
  },

  // 生成简历
  generateResume: async (): Promise<string> => {
    try {
      const response = await api.post<ApiResponse<string>>('/profiles/generate-resume');
      const data = response.data;
      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || '生成简历失败：响应数据为空');
      }
      return data.data;
    } catch (error) {
      console.error('生成简历失败:', error);
      throw error;
    }
  }
}; 