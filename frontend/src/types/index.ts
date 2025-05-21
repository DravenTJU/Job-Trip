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
  identifier: string;
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
  NOT_INTERESTED = 'not_interested',
  PENDING = 'pending',
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
  N_A = 'n-a',
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

export interface UserJob {
  _id: string;
  userId: string;
  jobId: Job; // 统一使用jobId属性名
  status: JobStatus;   // 使用JobStatus枚举
  isFavorite: boolean;
  customTags?: string[];
  notes?: string;
  nextSteps?: string[];
  interviewDates?: string[];
  reminderDate?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserJobData {
  jobId: string;         // 更改为jobId
  status: JobStatus;     // 使用JobStatus枚举
  notes?: string;
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