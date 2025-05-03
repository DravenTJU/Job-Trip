import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserJob, CreateUserJobData, ApplicationStatus } from '@/types';
import { userJobService } from '@/services/userJobService';

interface UserJobsState {
  userJobs: UserJob[];
  loading: boolean;
  error: string | null;
  currentUserJob: UserJob | null;
  total: number;
  page: number;
  size: number;
  totalPages: number;
  statusStats: Record<ApplicationStatus, number>;
}

const initialState: UserJobsState = {
  userJobs: [],
  loading: false,
  error: null,
  currentUserJob: null,
  total: 0,
  page: 1,
  size: 10,
  totalPages: 0,
  statusStats: {
    [ApplicationStatus.WISHLIST]: 0,
    [ApplicationStatus.APPLIED]: 0,
    [ApplicationStatus.INTERVIEW]: 0,
    [ApplicationStatus.OFFER]: 0,
    [ApplicationStatus.REJECTED]: 0,
    [ApplicationStatus.WITHDRAWN]: 0
  }
};

// 获取用户职位列表
export const fetchUserJobs = createAsyncThunk(
  'userJobs/fetchUserJobs',
  async (params?: {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    search?: string;
    sort?: string;
  }) => {
    const response = await userJobService.getUserJobs(params);
    return response;
  }
);

// 获取单个用户职位
export const fetchUserJob = createAsyncThunk(
  'userJobs/fetchUserJob',
  async (id: string) => {
    const response = await userJobService.getUserJob(id);
    return response;
  }
);

// 创建用户职位
export const createUserJob = createAsyncThunk(
  'userJobs/createUserJob',
  async (userJobData: CreateUserJobData) => {
    const response = await userJobService.createUserJob(userJobData);
    return response;
  }
);

// 更新用户职位
export const updateUserJob = createAsyncThunk(
  'userJobs/updateUserJob',
  async ({ id, userJobData }: { id: string; userJobData: Partial<CreateUserJobData> }) => {
    const response = await userJobService.updateUserJob(id, userJobData);
    return response;
  }
);

// 删除用户职位
export const deleteUserJob = createAsyncThunk(
  'userJobs/deleteUserJob',
  async (id: string) => {
    await userJobService.deleteUserJob(id);
    return id;
  }
);

// 获取状态统计
export const fetchStatusStats = createAsyncThunk(
  'userJobs/fetchStatusStats',
  async () => {
    const response = await userJobService.getStatusStats();
    return response;
  }
);

const userJobsSlice = createSlice({
  name: 'userJobs',
  initialState,
  reducers: {
    clearCurrentUserJob: (state) => {
      state.currentUserJob = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户职位列表
      .addCase(fetchUserJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.userJobs = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUserJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户职位列表失败';
      })
      // 获取单个用户职位
      .addCase(fetchUserJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserJob = action.payload;
      })
      .addCase(fetchUserJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户职位详情失败';
      })
      // 创建用户职位
      .addCase(createUserJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserJob.fulfilled, (state, action) => {
        state.loading = false;
        state.userJobs.unshift(action.payload);
      })
      .addCase(createUserJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建用户职位失败';
      })
      // 更新用户职位
      .addCase(updateUserJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userJobs.findIndex(userJob => userJob._id === action.payload._id);
        if (index !== -1) {
          state.userJobs[index] = action.payload;
        }
        if (state.currentUserJob?._id === action.payload._id) {
          state.currentUserJob = action.payload;
        }
      })
      .addCase(updateUserJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新用户职位失败';
      })
      // 删除用户职位
      .addCase(deleteUserJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserJob.fulfilled, (state, action) => {
        state.loading = false;
        state.userJobs = state.userJobs.filter(userJob => userJob._id !== action.payload);
        if (state.currentUserJob?._id === action.payload) {
          state.currentUserJob = null;
        }
      })
      .addCase(deleteUserJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除用户职位失败';
      })
      // 获取状态统计
      .addCase(fetchStatusStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statusStats = action.payload;
      })
      .addCase(fetchStatusStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取状态统计失败';
      });
  }
});

export const { clearCurrentUserJob, clearError } = userJobsSlice.actions;
export default userJobsSlice.reducer; 