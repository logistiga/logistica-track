import { apiConfig } from '../config';

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
    const response = await fetch(`${this.currentBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la requête');
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