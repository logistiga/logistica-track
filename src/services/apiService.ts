// Configuration intelligente de l'URL de l'API
const getApiBaseUrl = () => {
  // Détection automatique du protocole
  const isHttps = window.location.protocol === 'https:';
  const isDevelopment = import.meta.env.DEV;
  
  // URLs depuis les variables d'environnement
  const primaryUrl = import.meta.env.VITE_API_URL;
  const fallbackUrl = import.meta.env.VITE_API_URL_FALLBACK;
  
  // En développement local, utiliser HTTP par défaut
  if (isDevelopment) {
    return primaryUrl || 'http://127.0.0.1:8000/api';
  }
  
  // En production, adapter selon le protocole du frontend
  if (isHttps) {
    return primaryUrl?.replace('http://', 'https://') || 'https://127.0.0.1:8000/api';
  } else {
    return primaryUrl?.replace('https://', 'http://') || 'http://127.0.0.1:8000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private currentBaseUrl = API_BASE_URL;
  
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit) {
    try {
      const response = await fetch(`${this.currentBaseUrl}${endpoint}`, options);
      return response;
    } catch (error) {
      // En cas d'erreur, essayer avec l'URL de fallback
      const fallbackUrl = import.meta.env.VITE_API_URL_FALLBACK;
      if (fallbackUrl && fallbackUrl !== this.currentBaseUrl) {
        console.warn('Tentative avec URL de fallback:', fallbackUrl);
        this.currentBaseUrl = fallbackUrl;
        return await fetch(`${this.currentBaseUrl}${endpoint}`, options);
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