import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserLoginData, UserRegisterData, UpdatePasswordData } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// 登录
export const login = createAsyncThunk(
  'auth/login',
  async (loginData: UserLoginData) => {
    const response = await authService.login(loginData);
    authService.setToken(response.token);
    return response.user;
  }
);

// 注册
export const register = createAsyncThunk(
  'auth/register',
  async (registerData: UserRegisterData) => {
    const response = await authService.register(registerData);
    authService.setToken(response.token);
    return response.user;
  }
);

// 获取当前用户
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await authService.getCurrentUser();
    return response;
  }
);

// 更新用户信息
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>) => {
    const response = await authService.updateProfile(userData);
    return response;
  }
);

// 更新密码
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData: UpdatePasswordData) => {
    await authService.updatePassword(passwordData);
  }
);

// 退出登录
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '登录失败';
      })
      // 注册
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '注册失败';
      })
      // 获取当前用户
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户信息失败';
      })
      // 更新用户信息
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新用户信息失败';
      })
      // 更新密码
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新密码失败';
      })
      // 退出登录
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '退出登录失败';
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 