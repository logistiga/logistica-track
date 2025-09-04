import { apiService } from './apiService';
import { mockAuthService } from './mockAuthService';

// Utiliser le service mock en attendant la configuration du backend
const USE_MOCK = false;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  telephone?: string;
  departement?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  role_label: string;
  telephone?: string;
  departement?: string;
  actif: boolean;
  email_verified_at?: string;
  derniere_connexion?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      return mockAuthService.login(credentials);
    }
    
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      // Stocker le token
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK) {
      return mockAuthService.register(userData);
    }
    
    try {
      const response = await apiService.post('/auth/register', userData);
      
      // Stocker le token si fourni
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (USE_MOCK) {
      return mockAuthService.logout();
    }
    
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      return mockAuthService.getCurrentUser();
    }
    
    try {
      const response = await apiService.get('/auth/user');
      return response.data.user;
    } catch (error) {
      throw new Error('Utilisateur non connecté');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      return mockAuthService.updateProfile(userData);
    }
    
    try {
      const response = await apiService.put('/auth/user', userData);
      
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      return mockAuthService.changePassword(currentPassword, newPassword);
    }
    
    try {
      await apiService.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  getStoredUser(): User | null {
    return USE_MOCK ? mockAuthService.getStoredUser() : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);
  }

  getStoredToken(): string | null {
    return USE_MOCK ? mockAuthService.getStoredToken() : localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return USE_MOCK ? mockAuthService.isAuthenticated() : !!this.getStoredToken();
  }
}

export const authService = new AuthService();