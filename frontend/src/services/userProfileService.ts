import api from './api';
import { UserProfile, Education, WorkExperience, Skill, Project, Language, Certification } from '@/types';

export interface UserProfile {
  id: string;
  userId: string;
  introduction: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export const userProfileService = {
  // 获取用户档案
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfile>('/user-profiles/me');
      return response;
    } catch (error) {
      console.error('获取用户档案失败:', error);
      throw error;
    }
  },

  // 更新用户档案
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put<UserProfile>('/user-profiles/me', data);
      return response;
    } catch (error) {
      console.error('更新用户档案失败:', error);
      throw error;
    }
  },

  // 添加教育经历
  addEducation: async (data: Omit<Education, 'id'>): Promise<Education> => {
    try {
      const response = await api.post<Education>('/user-profiles/me/education', data);
      return response;
    } catch (error) {
      console.error('添加教育经历失败:', error);
      throw error;
    }
  },

  // 更新教育经历
  updateEducation: async (id: string, data: Partial<Education>): Promise<Education> => {
    try {
      const response = await api.put<Education>(`/user-profiles/me/education/${id}`, data);
      return response;
    } catch (error) {
      console.error('更新教育经历失败:', error);
      throw error;
    }
  },

  // 删除教育经历
  deleteEducation: async (id: string): Promise<void> => {
    try {
      await api.delete(`/user-profiles/me/education/${id}`);
    } catch (error) {
      console.error('删除教育经历失败:', error);
      throw error;
    }
  },

  addWorkExperience: async (data: any) => {
    try {
      const response = await api.post('/user-profiles/me/work-experience', data);
      return response.data;
    } catch (error) {
      console.error('添加工作经验失败:', error);
      throw error;
    }
  },

  updateWorkExperience: async (id: string, data: any) => {
    try {
      const response = await api.put(`/user-profiles/me/work-experience/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('更新工作经验失败:', error);
      throw error;
    }
  },

  deleteWorkExperience: async (id: string) => {
    try {
      const response = await api.delete(`/user-profiles/me/work-experience/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除工作经验失败:', error);
      throw error;
    }
  },

  async createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
    return api.post<Skill>('/user-profiles/me/skills', data);
  },

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    return api.put<Skill>(`/user-profiles/me/skills/${id}`, data);
  },

  async deleteSkill(id: string): Promise<void> {
    return api.delete(`/user-profiles/me/skills/${id}`);
  },

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    return api.post<Project>('/user-profiles/me/projects', data);
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return api.put<Project>(`/user-profiles/me/projects/${id}`, data);
  },

  async deleteProject(id: string): Promise<void> {
    return api.delete(`/user-profiles/me/projects/${id}`);
  },

  /**
   * 添加语言能力
   * @param data 语言能力数据
   */
  addLanguage: async (data: {
    name: string;
    level: 'basic' | 'intermediate' | 'advanced' | 'native';
  }) => {
    try {
      const response = await api.post('/user-profiles/me/languages', data);
      return response.data;
    } catch (error) {
      console.error('添加语言能力失败:', error);
      throw error;
    }
  },

  /**
   * 更新语言能力
   * @param id 语言能力ID
   * @param data 语言能力数据
   */
  updateLanguage: async (
    id: string,
    data: {
      name: string;
      level: 'basic' | 'intermediate' | 'advanced' | 'native';
    }
  ) => {
    try {
      const response = await api.put(`/user-profiles/me/languages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('更新语言能力失败:', error);
      throw error;
    }
  },

  /**
   * 删除语言能力
   * @param id 语言能力ID
   */
  deleteLanguage: async (id: string) => {
    try {
      const response = await api.delete(`/user-profiles/me/languages/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除项目经验失败:', error);
      throw error;
    }
  },

  /**
   * 添加证书
   * @param data 证书数据
   */
  addCertification: async (data: {
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }) => {
    try {
      const response = await api.post('/user-profiles/me/certifications', data);
      return response.data;
    } catch (error) {
      console.error('添加证书失败:', error);
      throw error;
    }
  },

  /**
   * 更新证书
   * @param id 证书ID
   * @param data 证书数据
   */
  updateCertification: async (
    id: string,
    data: {
      title: string;
      issuer: string;
      issueDate: string;
      expiryDate?: string;
      credentialId?: string;
      credentialUrl?: string;
    }
  ) => {
    try {
      const response = await api.put(`/user-profiles/me/certifications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('更新证书失败:', error);
      throw error;
    }
  },

  /**
   * 删除证书
   * @param id 证书ID
   */
  deleteCertification: async (id: string) => {
    try {
      const response = await api.delete(`/user-profiles/me/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除证书失败:', error);
      throw error;
    }
  }
}; 