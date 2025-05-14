import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreateJobData, Job, PaginatedResponse } from '@/types';
import jobService from '@/services/jobService';

// 异步Thunk actions
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserRelatedJobs = createAsyncThunk(
  'jobs/fetchUserRelatedJobs',
  async (params: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
    status?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getUserRelatedJobs(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobService.getJob(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: CreateJobData, { rejectWithValue }) => {
    try {
      const response = await jobService.createJob(jobData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }: { id: string, data: Partial<CreateJobData> }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJob(id, data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 状态接口
interface JobsState {
  jobs: Job[];
  job: Job | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: JobsState = {
  jobs: [],
  job: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// 创建slice
const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearJob: (state) => {
      state.job = null;
    },
    setJobStatus: (state, action: PayloadAction<{ jobId: string; newStatus: string }>) => {
      const { jobId, newStatus } = action.payload;
      state.jobs = state.jobs.map(job =>
        job._id === jobId ? { ...job, status: newStatus } : job
      );
      if (state.job && state.job._id === jobId) {
        state.job.status = newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取职位列表
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.size,
          pages: action.payload.totalPages
        };
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取用户关联职位列表
      .addCase(fetchUserRelatedJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRelatedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.size,
          pages: action.payload.totalPages
        };
        state.error = null;
      })
      .addCase(fetchUserRelatedJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取单个职位
      .addCase(fetchJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.job = action.payload;
        state.error = null;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 创建职位
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.push(action.payload);
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 更新职位
      .addCase(updateJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = state.jobs.map(job => 
          job._id === action.payload._id ? action.payload : job
        );
        if (state.job && state.job._id === action.payload._id) {
          state.job = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 删除职位
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        if (state.job && state.job._id === action.payload) {
          state.job = null;
        }
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearJob, setJobStatus } = jobsSlice.actions;
export default jobsSlice.reducer; 