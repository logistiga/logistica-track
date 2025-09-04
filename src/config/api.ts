import { environment } from './environment';

// Configuration intelligente de l'URL de l'API
export const getApiBaseUrl = () => {
  // Détection automatique du protocole
  const isHttps = window.location.protocol === 'https:';
  
  // URLs depuis les variables d'environnement
  const primaryUrl = environment.apiUrl;
  const fallbackUrl = environment.apiFallbackUrl;
  
  // En développement local, utiliser HTTP par défaut
  if (environment.isDevelopment) {
    return primaryUrl || environment.defaultApiUrl;
  }
  
  // En production, adapter selon le protocole du frontend
  if (isHttps) {
    return primaryUrl?.replace('http://', 'https://') || 'https://127.0.0.1:8000/api';
  } else {
    return primaryUrl?.replace('https://', 'http://') || environment.defaultApiUrl;
  }
};

// Configuration API
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  fallbackUrl: environment.apiFallbackUrl,
  timeout: environment.defaultTimeout,
  
  // Headers par défaut
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuration des retry
  retry: {
    attempts: 2,
    delay: 1000,
  },
  
  // Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      me: '/auth/me',
    },
    armateurs: '/armateurs',
    vehicules: '/vehicules',
    sortieConteneur: '/sortie-conteneur',
    operations: '/operations',
    dashboard: '/dashboard',
    notifications: '/notifications',
  }
};