import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JobStatus, CreateUserJobData, UserJob } from '@/types';
import userJobService from '@/services/userJobService';
import { isApiError } from '../../types/api';

// 异步Thunk actions
export const fetchUserJobs = createAsyncThunk(
  'userJobs/fetchUserJobs',
  async (params: { 
    page?: number; 
    limit?: number;
    status?: JobStatus;
    search?: string;
    sort?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await userJobService.getUserJobs(params);
      return response;
    } catch (error: any) {
      // 优先使用ApiError的状态码和消息
      if (isApiError(error)) {
        return rejectWithValue(error.message);
      }
      // 降级到旧的错误处理
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserJob = createAsyncThunk(
  'userJobs/fetchUserJob',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userJobService.getUserJob(id);
      return response;
    } catch (error: any) {
      // 优先使用ApiError的状态码和消息
      if (isApiError(error)) {
        return rejectWithValue(error.message);
      }
      // 降级到旧的错误处理
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createUserJob = createAsyncThunk(
  'userJobs/createUserJob',
  async (userJobData: CreateUserJobData, { rejectWithValue }) => {
    try {
      const response = await userJobService.createUserJob(userJobData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserJob = createAsyncThunk<
  UserJob,
  { id: string; data: Partial<CreateUserJobData> },
  { rejectValue: string }
>(
  'userJobs/updateUserJob',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Assert to unknown first, then to the expected runtime structure
      const response = await userJobService.updateUserJob(id, data) as unknown as 
        { success: boolean; data: UserJob; message?: string };
      
      console.log('[userJobsSlice/updateUserJob thunk] 服务响应 (运行时结构):', JSON.stringify(response, null, 2));
      
      if (response && response.success && response.data && response.data._id) {
        return response.data;
      } else {
        const errorMessage = response?.message || '更新用户职位失败：类型断言后，服务器指示失败或响应结构异常。';
        console.error('[userJobsSlice/updateUserJob thunk] 错误:', errorMessage, '完整响应:', response);
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.error('[userJobsSlice/updateUserJob thunk] 服务调用期间发生异常:', error);
      if (isApiError(error)) {
        return rejectWithValue(error.message || '更新过程中发生API错误。');
      }
      return rejectWithValue((error as Error).message || '更新过程中发生未知错误。');
    }
  }
);

export const deleteUserJob = createAsyncThunk(
  'userJobs/deleteUserJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await userJobService.deleteUserJob(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchStatusStats = createAsyncThunk(
  'userJobs/fetchStatusStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userJobService.getStatusStats();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 状态接口
interface UserJobsState {
  userJobs: UserJob[];
  userJob: UserJob | null;
  stats: Record<JobStatus, number> | null;
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
const initialState: UserJobsState = {
  userJobs: [],
  userJob: null,
  stats: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// 创建slice
const userJobsSlice = createSlice({
  name: 'userJobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserJob: (state) => {
      state.userJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户职位列表
      .addCase(fetchUserJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userJobs = action.payload.data;
        
        // 从PaginatedResponse中正确提取分页信息
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page, 
          limit: action.payload.size,
          pages: action.payload.totalPages
        };
        
        state.error = null;
      })
      .addCase(fetchUserJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取单个用户职位
      .addCase(fetchUserJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userJob = action.payload;
        state.error = null;
      })
      .addCase(fetchUserJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 创建用户职位关联
      .addCase(createUserJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userJobs.push(action.payload);
        state.error = null;
      })
      .addCase(createUserJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 更新用户职位关联
      .addCase(updateUserJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserJob.fulfilled, (state, action: PayloadAction<UserJob>) => {
        state.isLoading = false;
        
        const updatedJobFromApi = action.payload;
        const targetId = updatedJobFromApi?._id;
        
        console.log('[userJobsSlice/updateUserJob.fulfilled] 收到 action.payload (来自API的UserJob):', JSON.stringify(updatedJobFromApi, null, 2));
        console.log('[userJobsSlice/updateUserJob.fulfilled] 用于匹配的载荷ID:', targetId);

        if (targetId) {
          const jobIndex = state.userJobs.findIndex(job => job._id === targetId);
          if (jobIndex !== -1) {
            const existingUserJob = state.userJobs[jobIndex];
            
            const newStoredUserJob = {
              ...existingUserJob,      // 从现有职位开始，以保留已填充的字段
              ...updatedJobFromApi,    // 使用API的更改覆盖 (状态, updatedAt等)
            };

            // 如果API的jobId是字符串且现有的是对象，则保留现有的已填充对象。
            if (typeof updatedJobFromApi.jobId === 'string' && 
                typeof existingUserJob.jobId === 'object' && 
                existingUserJob.jobId !== null) {
              newStoredUserJob.jobId = existingUserJob.jobId;
            } else {
              // 否则，采用API响应中的jobId
              // (如果API更改，它可能是一个已填充的对象，或者为null，或者已经是字符串)
              newStoredUserJob.jobId = updatedJobFromApi.jobId;
            }
            
            state.userJobs[jobIndex] = newStoredUserJob;
            console.log('[userJobsSlice/updateUserJob.fulfilled] 更新了列表中的userJob:', targetId, JSON.stringify(newStoredUserJob, null, 2));
          } else {
            console.warn('[userJobsSlice/updateUserJob.fulfilled] 未在 state.userJobs 中找到ID为', targetId, '的职位进行更新。');
            // 后备: 如果在列表中未找到 (如果列表是全面的，则不应发生)，则添加它或作为错误处理
            // 目前，如果它不存在，我们可以考虑添加它，尽管通常更新意味着存在。
            // state.userJobs.push(updatedJobFromApi); // 或其他一些逻辑
          }
          
          // 如果已加载且ID匹配，则同时更新单个 userJob
          if (state.userJob && state.userJob._id === targetId) {
            const existingSingleUserJob = state.userJob;
            const newSingleStoredUserJob = {
              ...existingSingleUserJob,
              ...updatedJobFromApi,
            };

            if (typeof updatedJobFromApi.jobId === 'string' && 
                typeof existingSingleUserJob.jobId === 'object' && 
                existingSingleUserJob.jobId !== null) {
              newSingleStoredUserJob.jobId = existingSingleUserJob.jobId;
            } else {
              newSingleStoredUserJob.jobId = updatedJobFromApi.jobId;
            }
            state.userJob = newSingleStoredUserJob;
            console.log('[userJobsSlice/updateUserJob.fulfilled] 更新了 state.userJob:', targetId, JSON.stringify(newSingleStoredUserJob, null, 2));
          }
        } else {
          console.error('[userJobsSlice/updateUserJob.fulfilled] 错误: action.payload 中缺少 _id。状态未更新。', updatedJobFromApi);
        }
        
        state.error = null;
      })
      .addCase(updateUserJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 删除用户职位关联
      .addCase(deleteUserJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userJobs = state.userJobs.filter(userJob => userJob._id !== action.payload);
        if (state.userJob && state.userJob._id === action.payload) {
          state.userJob = null;
        }
        state.error = null;
      })
      .addCase(deleteUserJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取状态统计
      .addCase(fetchStatusStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatusStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchStatusStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearUserJob } = userJobsSlice.actions;
export default userJobsSlice.reducer; 