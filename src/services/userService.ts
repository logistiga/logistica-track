import { apiService } from './apiService';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  telephone?: string;
  departement?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  telephone?: string;
  departement?: string;
  actif?: boolean;
}

class UserService {
  async getUsers() {
    const response = await apiService.get('/admin/users');
    return response.data;
  }

  async createUser(userData: CreateUserData) {
    const response = await apiService.post('/admin/users', userData);
    return response.data;
  }

  async updateUser(userId: number, userData: UpdateUserData) {
    const response = await apiService.put(`/admin/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: number) {
    await apiService.delete(`/admin/users/${userId}`);
    return true;
  }

  async toggleUserStatus(userId: number) {
    const response = await apiService.post(`/admin/users/${userId}/toggle-status`, {});
    return response.data;
  }

  async resetUserPassword(userId: number) {
    const response = await apiService.post(`/admin/users/${userId}/reset-password`, {});
    return response.data;
  }
}

export const userService = new UserService();
