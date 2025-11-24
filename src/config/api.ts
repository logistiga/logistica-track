// Configuration de l'URL de l'API - TEMPORAIREMENT EN LOCAL
export const getApiBaseUrl = () => {
  // TEMPORAIRE: Force l'utilisation du backend local (php artisan serve)
  const url = 'http://127.0.0.1:8000/api';
  
  console.log('🔗 API Base URL configured as:', url);
  console.log('🌍 Environment: local development (forced)');
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
    sortieConteneur: '/sorties',
    operations: '/operations',
    dashboard: '/dashboard',
    notifications: '/notifications',
    stockages: '/stockages',
    doubleRelevages: '/double-relevages',
    depotages: '/depotages',
  }
};