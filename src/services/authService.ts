import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
    console.log('🔐 Tentative de connexion avec Supabase');
    console.log('📝 Email:', credentials.email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw new Error(error.message);
      }

      console.log('✅ Connexion réussie:', data);
      
      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata?.name || credentials.email.split('@')[0],
        email: data.user.email!,
        role: 'admin',
        role_label: 'Administrateur',
        telephone: data.user.user_metadata?.telephone,
        departement: data.user.user_metadata?.departement,
        actif: true,
        email_verified_at: data.user.email_confirmed_at,
        derniere_connexion: new Date().toISOString(),
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at,
      };

      return {
        success: true,
        message: 'Connexion réussie',
        data: {
          user,
          token: data.session.access_token,
        },
      };
    } catch (error) {
      console.error('🚨 Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            telephone: userData.telephone,
            departement: userData.departement,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const user: User = {
        id: data.user!.id,
        name: userData.name,
        email: userData.email,
        role: 'user',
        role_label: 'Utilisateur',
        telephone: userData.telephone,
        departement: userData.departement,
        actif: true,
        email_verified_at: data.user!.email_confirmed_at,
        derniere_connexion: new Date().toISOString(),
        created_at: data.user!.created_at,
        updated_at: data.user!.updated_at || data.user!.created_at,
      };

      return {
        success: true,
        message: 'Inscription réussie',
        data: {
          user,
          token: data.session?.access_token || '',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      console.log('💾 Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error('Utilisateur non connecté');
    }

    return {
      id: user.id,
      name: user.user_metadata?.name || user.email!.split('@')[0],
      email: user.email!,
      role: 'admin',
      role_label: 'Administrateur',
      telephone: user.user_metadata?.telephone,
      departement: user.user_metadata?.departement,
      actif: true,
      email_verified_at: user.email_confirmed_at,
      derniere_connexion: new Date().toISOString(),
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: userData.name,
        telephone: userData.telephone,
        departement: userData.departement,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.user.id,
      name: userData.name || data.user.user_metadata?.name,
      email: data.user.email!,
      role: 'admin',
      role_label: 'Administrateur',
      telephone: userData.telephone,
      departement: userData.departement,
      actif: true,
      email_verified_at: data.user.email_confirmed_at,
      derniere_connexion: new Date().toISOString(),
      created_at: data.user.created_at,
      updated_at: data.user.updated_at || data.user.created_at,
    };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  getStoredUser(): User | null {
    return null; // Supabase gère le stockage automatiquement
  }

  getStoredToken(): string | null {
    return null; // Supabase gère les tokens automatiquement
  }

  isAuthenticated(): boolean {
    return true; // Sera géré par le contexte
  }
}

export const authService = new AuthService();