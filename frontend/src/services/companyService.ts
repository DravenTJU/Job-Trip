import { ApiResponse, Company, CreateCompanyData, PaginatedResponse } from '@/types';
import api from './api';

// 公司服务
class CompanyService {
  // 获取公司列表
  async getCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Company>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Company>>>('/companies', {
        params
      });
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取公司列表失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取公司列表失败');
    }
  }

  // 获取公司详情
  async getCompany(id: string): Promise<Company> {
    try {
      const response = await api.get<ApiResponse<Company>>(`/companies/${id}`);
      if (!response || !response.data || !response.data.data) {
        throw new Error('获取公司详情失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取公司详情失败');
    }
  }

  // 创建公司
  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    try {
      const response = await api.post<ApiResponse<Company>>('/companies', companyData);
      if (!response || !response.data || !response.data.data) {
        throw new Error('创建公司失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '创建公司失败');
    }
  }

  // 更新公司
  async updateCompany(id: string, companyData: Partial<CreateCompanyData>): Promise<Company> {
    try {
      const response = await api.put<ApiResponse<Company>>(`/companies/${id}`, companyData);
      if (!response || !response.data || !response.data.data) {
        throw new Error('更新公司失败：无效的响应数据');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '更新公司失败');
    }
  }

  // 删除公司
  async deleteCompany(id: string): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(`/companies/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '删除公司失败');
    }
  }
}

export const companyService = new CompanyService(); 