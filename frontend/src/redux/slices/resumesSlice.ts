import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreateResumeData, PaginatedResponse, Resume, UpdateResumeData } from '@/types';
import resumeService from '@/services/resumeService';
import aiService from '@/services/aiService';

// 异步Thunk actions
export const fetchResumes = createAsyncThunk(
  'resumes/fetchResumes',
  async (params: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await resumeService.getResumes(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchResume = createAsyncThunk(
  'resumes/fetchResume',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeService.getResume(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createResume = createAsyncThunk(
  'resumes/createResume',
  async (resumeData: CreateResumeData, { rejectWithValue }) => {
    try {
      const response = await resumeService.createResume(resumeData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resumes/updateResume',
  async ({ id, data }: { id: string, data: UpdateResumeData }, { rejectWithValue }) => {
    try {
      const response = await resumeService.updateResume(id, data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resumes/deleteResume',
  async (id: string, { rejectWithValue }) => {
    try {
      await resumeService.deleteResume(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const duplicateResume = createAsyncThunk(
  'resumes/duplicateResume',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeService.duplicateResume(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const generateTailoredResume = createAsyncThunk(
  'resumes/generateTailoredResume',
  async ({ baseContent, targetPosition, targetJob }: { baseContent: string, targetPosition: string, targetJob: string }, { rejectWithValue }) => {
    try {
      const tailoredContent = await aiService.generateTailoredResume(baseContent, targetPosition, targetJob);
      return tailoredContent;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 状态接口
interface ResumesState {
  resumes: Resume[];
  resume: Resume | null;
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
const initialState: ResumesState = {
  resumes: [],
  resume: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// 创建slice
const resumesSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearResume: (state) => {
      state.resume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取简历列表
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action: PayloadAction<PaginatedResponse<Resume>>) => {
        state.isLoading = false;
        state.resumes = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.size,
          pages: action.payload.totalPages,
        };
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取单个简历
      .addCase(fetchResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.isLoading = false;
        state.resume = action.payload;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 创建简历
      .addCase(createResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.isLoading = false;
        state.resumes.unshift(action.payload);
        state.resume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 更新简历
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.isLoading = false;
        state.resume = action.payload;
        const index = state.resumes.findIndex(resume => resume._id === action.payload._id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 删除简历
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.resumes = state.resumes.filter(resume => resume._id !== action.payload);
        if (state.resume && state.resume._id === action.payload) {
          state.resume = null;
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 复制简历
      .addCase(duplicateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(duplicateResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.isLoading = false;
        state.resumes.unshift(action.payload);
      })
      .addCase(duplicateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearResume } = resumesSlice.actions;
export default resumesSlice.reducer;