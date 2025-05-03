import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CreateJobData, Job } from '@/types';
import { jobService } from '@/services/jobService';

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  currentJob: Job | null;
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  currentJob: null,
  total: 0,
  page: 1,
  size: 10,
  totalPages: 0
};

// 获取职位列表
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params?: { page?: number; limit?: number; search?: string; sort?: string }) => {
    const response = await jobService.getJobs(params);
    return response;
  }
);

// 获取单个职位
export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (id: string) => {
    const response = await jobService.getJob(id);
    return response;
  }
);

// 创建职位
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: CreateJobData) => {
    const response = await jobService.createJob(jobData);
    return response;
  }
);

// 更新职位
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }: { id: string; jobData: Partial<CreateJobData> }) => {
    const response = await jobService.updateJob(id, jobData);
    return response;
  }
);

// 删除职位
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string) => {
    await jobService.deleteJob(id);
    return id;
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取职位列表
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取职位列表失败';
      })
      // 获取单个职位
      .addCase(fetchJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取职位详情失败';
      })
      // 创建职位
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建职位失败';
      })
      // 更新职位
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新职位失败';
      })
      // 删除职位
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        if (state.currentJob?._id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除职位失败';
      });
  }
});

export const { clearCurrentJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer; 