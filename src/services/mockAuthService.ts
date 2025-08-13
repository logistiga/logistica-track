import type { LoginCredentials, RegisterData, User, AuthResponse } from './authService';

// Service d'authentification temporaire pour tester l'interface
class MockAuthService {
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'Omar Amraoui',
      email: 'omar@logistiga.com',
      role: 'admin',
      role_label: 'Administrateur',
      telephone: '+212 6 12 34 56 78',
      departement: 'Logistique',
      actif: true,
      email_verified_at: '2024-01-15T10:00:00.000Z',
      derniere_connexion: new Date().toISOString(),
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: new Date().toISOString(),
    }
  ];

  private mockPassword = 'A1mraoui@1';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== this.mockPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = 'mock_token_' + Date.now();
    
    // Stocker en localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      success: true,
      message: 'Connexion réussie (mode test)',
      data: {
        user,
        token,
      },
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: String(this.mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      role: 'user',
      role_label: 'Utilisateur',
      telephone: userData.telephone,
      departement: userData.departement,
      actif: true,
      email_verified_at: new Date().toISOString(),
      derniere_connexion: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.mockUsers.push(newUser);
    
    const token = 'mock_token_' + Date.now();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Inscription réussie (mode test)',
      data: {
        user: newUser,
        token,
      },
    };
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<User> {
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('Utilisateur non connecté');
    }
    return JSON.parse(userData);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentUser = await this.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData, updated_at: new Date().toISOString() };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentPassword !== this.mockPassword) {
      throw new Error('Mot de passe actuel incorrect');
    }
    
    this.mockPassword = newPassword;
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const mockAuthService = new MockAuthService();