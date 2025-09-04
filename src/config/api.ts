// Configuration simplifiée de l'URL de l'API
export const getApiBaseUrl = () => {
  // En développement, utiliser l'URL locale
  return 'http://127.0.0.1:8000/api';
};

// Configuration API
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  timeout: 30000,
  
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