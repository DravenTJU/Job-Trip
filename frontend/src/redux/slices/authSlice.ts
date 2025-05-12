import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserLoginData, UserRegisterData, UpdatePasswordData } from '@/types';
import authService from '@/services/authService';
import { ApiError, isApiError } from '../../types/api';

// 异步Thunk actions
export const login = createAsyncThunk(
  'auth/login',
  async (loginData: UserLoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (registerData: UserRegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registerData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
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

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(userData);
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

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData: UpdatePasswordData, { rejectWithValue }) => {
    try {
      await authService.updatePassword(passwordData);
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout();
    return;
  }
);

// 状态接口
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // 注册
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取当前用户
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      
      // 更新用户资料
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 退出登录
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 