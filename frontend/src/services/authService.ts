import api from './api';
import { ApiResponse, User, UserLoginData, UserRegisterData, UpdatePasswordData } from '@/types';

class AuthService {
  // 登录
  async login(loginData: UserLoginData) {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', loginData);
    return response.data.data;
  }

  // 注册
  async register(registerData: UserRegisterData) {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', registerData);
    return response.data.data;
  }

  // 获取当前用户
  async getCurrentUser() {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  // 更新用户信息
  async updateProfile(userData: Partial<User>) {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data.data;
  }

  // 更新密码
  async updatePassword(passwordData: UpdatePasswordData) {
    await api.put<ApiResponse<void>>('/auth/password', passwordData);
  }

  // 设置token
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // 获取token
  getToken() {
    return localStorage.getItem('token');
  }

  // 清除token
  logout() {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService(); 