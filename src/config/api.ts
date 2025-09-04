// Configuration simplifiée de l'URL de l'API
export const getApiBaseUrl = () => {
  // En développement, utiliser l'URL locale avec 127.0.0.1
  const url = 'http://127.0.0.1:8000/api';
  console.log('🔗 API Base URL configured as:', url);
  return url;
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