export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  salary?: string;
  applicationUrl: string;
  platform: string;
  postedDate?: Date;
  notes?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export type JobStatus = Job['status'];

export interface JobFilters {
  status?: JobStatus;
  jobType?: string;
  platform?: string;
  location?: string;
  salaryRange?: string;
  dateRange?: string;
  search?: string;
} 