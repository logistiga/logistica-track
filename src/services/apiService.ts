import { apiConfig, corsConfig } from '../config';

class ApiService {
  private currentBaseUrl = apiConfig.baseUrl;
  
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      ...apiConfig.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit) {
    try {
      const response = await fetch(`${this.currentBaseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          ...corsConfig.corsHeaders,
        },
      });
      return response;
    } catch (error) {
      // En cas d'erreur, essayer avec l'URL de fallback
      if (apiConfig.fallbackUrl && apiConfig.fallbackUrl !== this.currentBaseUrl) {
        console.warn('Tentative avec URL de fallback:', apiConfig.fallbackUrl);
        this.currentBaseUrl = apiConfig.fallbackUrl;
        return await fetch(`${this.currentBaseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            ...corsConfig.corsHeaders,
          },
        });
      }
      throw error;
    }
  }

  async get(endpoint: string) {
    const response = await this.makeRequest(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la requête');
    }

    return await response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la requête');
    }

    return await response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await this.makeRequest(endpoint, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la requête');
    }

    return await response.json();
  }

  async delete(endpoint: string) {
    const response = await this.makeRequest(endpoint, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la requête');
    }

    return await response.json();
  }
}

export const apiService = new ApiService();