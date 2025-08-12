const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    const data = await response.json();
    return data.data;
  }

  async createUser(userData: CreateUserData) {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de l\'utilisateur');
    }

    const data = await response.json();
    return data.data;
  }

  async updateUser(userId: number, userData: UpdateUserData) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    }

    const data = await response.json();
    return data.data;
  }

  async deleteUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression de l\'utilisateur');
    }

    return true;
  }

  async toggleUserStatus(userId: number) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors du changement de statut');
    }

    const data = await response.json();
    return data.data;
  }

  async resetUserPassword(userId: number) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    }

    const data = await response.json();
    return data.data;
  }
}

export const userService = new UserService();