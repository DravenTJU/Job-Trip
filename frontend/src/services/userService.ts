import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  username: string;
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/users/me');
  },

  async updateUser(data: UpdateUserData): Promise<User> {
    return api.put<User>('/users/me', data);
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    return api.put<void>('/users/me/password', data);
  }
}; 