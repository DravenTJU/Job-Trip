// 导出简历类型
export * from './resumeTypes';

// 用户相关接口
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  user: User;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// 公司相关接口
export interface Company {
  _id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  description?: string;
}

// 职位相关接口
export interface Job {
  _id: string;
  title: string;
  company: string | Company;
  description?: string;
  jobType?: string;
  location?: string;
  salary?: string;
  link?: string;
  platform: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  requirements: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  description?: string;
  jobType?: string;
  location?: string;
  salary?: string;
  link?: string;
  platform: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  requirements: string[];
  status: string;
}

// 用户-职位关联接口
export enum ApplicationStatus {
  WISHLIST = '想要申请',
  APPLIED = '已申请',
  INTERVIEW = '面试中',
  OFFER = '已录用',
  REJECTED = '已拒绝',
  WITHDRAWN = '已撤回'
}

export interface UserJob {
  _id: string;
  user: string | User;
  job: string | Job;
  status: ApplicationStatus;
  notes?: string;
  appliedDate?: string;
  nextSteps?: string[];
  interviewDates?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserJobData {
  job: string;
  status: ApplicationStatus;
  notes?: string;
  appliedDate?: string;
  nextSteps?: string[];
  interviewDates?: string[];
}

// 分页响应接口
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  size: number;
  data: T[];
  totalPages: number;
}

// 通用API响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
  traceId?: string;
}