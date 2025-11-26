// Configuration de l'URL de l'API - Backend exposé via ngrok
export const getApiBaseUrl = () => {
  // URL ngrok pour accéder au backend local depuis lovableproject.com
  const url = 'https://unextradited-monocotyledonous-sena.ngrok-free.dev/api';
  
  console.log('🔗 API Base URL configured as:', url);
  console.log('🌍 Environment: ngrok tunnel');
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
    facturations: '/facturations',
  }
};