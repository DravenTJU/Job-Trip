import api from './api';
import { 
  User, 
  UserLoginData, 
  UserRegisterData, 
  UserLoginResponse, 
  UpdatePasswordData
} from '@/types';

// 用户认证服务
const authService = {
  // 用户登录
  login: async (loginData: UserLoginData): Promise<UserLoginResponse> => {
    try {
      // 调用后端API登录，新的API格式会在api.ts的request函数中处理
      // data中包含token和user信息
      const data = await api.post<{
        token: string,
        user: {
          id: string,
          username: string,
          email: string,
          firstName?: string,
          lastName?: string,
          preferences?: any,
          status?: string
        }
      }>('/users/login', loginData);
      
      // 存储token到本地存储
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // 转换后端用户ID字段(id)为前端格式(_id)
      const userData: User = {
        _id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        preferences: data.user.preferences,
        status: data.user.status,
        createdAt: new Date().toISOString(), // 后端没有返回这些字段，使用当前时间
        updatedAt: new Date().toISOString()
      };
      
      return {
        token: data.token,
        user: userData
      };
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户注册
  register: async (registerData: UserRegisterData): Promise<User> => {
    try {
      // 调用后端API注册
      const data = await api.post<{
        token: string,
        user: {
          id: string,
          username: string,
          email: string,
          firstName?: string,
          lastName?: string,
          preferences?: any,
          status?: string
        }
      }>('/users/register', registerData);
      
      // 存储token到本地存储（注册成功后也会返回token）
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // 转换后端用户ID字段(id)为前端格式(_id)
      return {
        _id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        preferences: data.user.preferences,
        status: data.user.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    try {
      // 从API获取用户信息
      const userData = await api.get<{
        id: string,
        username: string,
        email: string,
        firstName?: string,
        lastName?: string,
        preferences?: any,
        status?: string,
        createdAt?: string,
        updatedAt?: string
      }>('/users/me');
      
      // 确保userData存在
      if (!userData) {
        throw new Error('获取用户信息失败，返回数据格式不正确');
      }
      
      // 转换后端用户ID字段(id)为前端格式(_id)
      return {
        _id: userData.id || '',
        username: userData.username || '',
        email: userData.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        preferences: userData.preferences,
        status: userData.status,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      localStorage.removeItem('token'); // 如果获取用户信息失败，清除token
      throw error;
    }
  },

  // 更新用户信息
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      // 转换前端_id为后端id格式
      const backendUserData: Record<string, any> = { ...userData };
      if ('_id' in backendUserData) {
        backendUserData.id = backendUserData._id;
        delete backendUserData._id;
      }
      
      // 调用API更新用户信息
      const updatedUser = await api.put<{
        id: string,
        username: string,
        email: string,
        firstName?: string,
        lastName?: string,
        preferences?: any,
        status?: string,
        createdAt?: string,
        updatedAt?: string
      }>('/users/me', backendUserData);
      
      // 转换后端返回数据为前端格式
      return {
        _id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        preferences: updatedUser.preferences,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt || new Date().toISOString(),
        updatedAt: updatedUser.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },

  // 更新密码
  updatePassword: async (passwordData: UpdatePasswordData): Promise<void> => {
    try {
      await api.put<{ token?: string }>('/users/password', passwordData);
    } catch (error) {
      console.error('更新密码失败:', error);
      throw error;
    }
  },

  // 登出
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 