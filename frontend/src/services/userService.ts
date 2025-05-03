import axios from 'axios';
import { API_BASE_URL } from '../config';

const userService = {
  // 更新用户信息
  updateUser: async (data: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    preferences?: {
      theme?: string;
      notifications?: boolean;
      language?: string;
    };
  }) => {
    const response = await axios.put(`${API_BASE_URL}/users/me`, data);
    return response.data;
  },

  // 更新密码
  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await axios.put(`${API_BASE_URL}/users/password`, data);
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/me`);
    return response.data;
  },
};

export default userService; 