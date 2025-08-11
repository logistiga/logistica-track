const API_BASE_URL = 'http://localhost:8000/api';

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
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      // Fallback vers des données mockées
      console.warn('API non disponible, utilisation des données mockées');
      return [
        {
          id: 1,
          name: 'Admin Principal',
          email: 'admin@logistica.com',
          role: 'admin',
          role_label: 'Administrateur',
          telephone: '+221 77 123 45 67',
          departement: 'Administration',
          actif: true,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-08-11T22:30:00Z',
        },
        {
          id: 2,
          name: 'Omar Amraoui',
          email: 'omar@logistica.com',
          role: 'admin',
          role_label: 'Super Administrateur',
          telephone: '+221 77 123 45 68',
          departement: 'Direction',
          actif: true,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-08-11T22:25:00Z',
        },
        {
          id: 3,
          name: 'Manager Transport',
          email: 'manager@logistica.com',
          role: 'manager',
          role_label: 'Manager',
          telephone: '+221 77 123 45 69',
          departement: 'Transport',
          actif: true,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-08-11T20:15:00Z',
        }
      ];
    }
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