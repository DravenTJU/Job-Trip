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
export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

export interface Company {
  _id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: CompanySize;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  website?: string;
  industry?: string;
  size?: CompanySize;
  location?: string;
  description?: string;
}

// 薪资接口
export interface Salary {
  min?: number;
  max?: number;
  currency?: string;
}

// 职位状态枚举
export enum JobStatus {
  NEW = 'new',
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  CLOSED = 'closed',
}

// 工作类型枚举
export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

// 数据来源枚举
export enum JobSource {
  LINKEDIN = 'linkedin',
  SEEK = 'seek',
  INDEED = 'indeed',
  MANUAL = 'manual',
  OTHER = 'other'
}

// 职位相关接口
export interface Job {
  _id: string;
  platform: string;
  title: string;
  company: string | Company;
  location: string;
  description?: string;
  jobType?: string;
  salary?: string;
  link?: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  requirements: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 创建职位的数据接口
export interface CreateJobData {
  platform: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  jobType?: string;
  salary?: string;
  link?: string;
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