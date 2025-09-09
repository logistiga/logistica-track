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
    console.log('📦 Request headers:', JSON.stringify(this.getAuthHeaders(), null, 2));
    if (options.body) {
      console.log('📝 Request body:', JSON.stringify(JSON.parse(options.body as string), null, 2));
    }
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      
      // Si erreur 401, nettoyer l'authentification sans essayer de faire logout
      if (response.status === 401) {
        console.log('🔒 Token expired or invalid, cleaning local storage');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Rediriger vers login seulement si on n'y est pas déjà
        if (!window.location.pathname.includes('/login')) {
          console.log('🔄 Redirecting to login page');
          window.location.href = '/login';
        }
        throw new Error('Session expirée');
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

    const result = await response.json();
    console.log('✅ GET Response data:', JSON.stringify(result, null, 2));
    return result;
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