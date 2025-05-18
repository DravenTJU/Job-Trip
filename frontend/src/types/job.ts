import { JobStatus } from './index';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  salary?: string;
  sourceUrl: string;
  source?: string;
  sourceId?: string;
  platform: string;
  postedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  userJobId?: string;
  isFavorite?: boolean;
}

// 职位筛选接口
export interface JobFilters {
  jobType?: string;
  platform?: string;
  location?: string;
  salaryRange?: string;
  dateRange?: string;
  search?: string;
}

// 用户职位筛选接口
export interface UserJobFilters extends JobFilters {
  status?: JobStatus;
  isFavorite?: boolean;
} 