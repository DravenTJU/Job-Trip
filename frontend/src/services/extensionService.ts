import { request } from './api';
import { Job } from '../types/job';

export interface JobFromExtension {
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
}

export interface ExtensionJobResponse {
  job: Job;
  userJob: {
    _id: string;
    userId: string;
    jobId: string;
    status: string;
    notes: string;
  };
}

const extensionService = {
  /**
   * Create a new job from extension data
   * @param jobData Job data collected from the browser extension
   * @returns Created job and user-job association
   */
  createJobFromExtension: async (jobData: JobFromExtension): Promise<ExtensionJobResponse> => {
    const response = await request<{ data: ExtensionJobResponse }>({
      url: '/jobs/extension',
      method: 'POST',
      data: jobData,
    });
    return response.data;
  },
};

export default extensionService; 