import { apiConfig } from '../config';

class ApiService {
  private currentBaseUrl = apiConfig.baseUrl;
  
  constructor() {
    console.log('🔧 ApiService initialized with baseUrl:', this.currentBaseUrl);
  }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      ...apiConfig.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit) {
    const fullUrl = `${this.currentBaseUrl}${endpoint}`;
    console.log('🌐 Making request to:', fullUrl);
    console.log('📤 Request method:', options.method);
    console.log('📦 Request headers:', this.getAuthHeaders());
    console.log('📝 Request body:', options.body);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      
      // Si erreur 401, nettoyer l'authentification
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Rediriger vers login seulement si on n'y est pas déjà
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return;
      }
      
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.message || 'Erreur lors de la requête');
      } catch {
        throw new Error(errorText || 'Erreur lors de la requête');
      }
    }

    return response;
  }

  async get(endpoint: string) {
    const response = await this.makeRequest(endpoint, {
      method: 'GET',
    });

    return await response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async delete(endpoint: string) {
    const response = await this.makeRequest(endpoint, {
      method: 'DELETE',
    });

    return await response.json();
  }
}

export const apiService = new ApiService();