import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await axios.put(`${API_BASE_URL}/users/me`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await axios.put(`${API_BASE_URL}/users/me/password`, data, {
      withCredentials: true,
    });
  },
}; 