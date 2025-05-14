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

// 添加UserJob接口定义
export interface UserJob {
  _id: string;
  userId: string;
  jobId: string | Job;
  status: JobStatus;
  isFavorite: boolean;
  customTags?: string[];
  notes?: string;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 定义申请状态类型
export type JobStatus = 'new' | 'not_interested' | 'pending' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn' | 'closed';

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