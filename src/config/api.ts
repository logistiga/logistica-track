// Configuration de l'URL de l'API avec détection d'environnement
export const getApiBaseUrl = () => {
  // Si vous développez localement, utiliser l'URL locale
  // Si vous déployez, utiliser l'URL publique du backend (ngrok ou serveur déployé)
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Backend déployé sur suivitc.logistiga.com
  // Essayer d'abord l'URL sans /backend/public (si document root = public)
  const deployedBackendUrl = 'https://suivitc.logistiga.com/api';
  
  const url = isLocal ? 'http://127.0.0.1:8000/api' : deployedBackendUrl;
  console.log('🔗 API Base URL configured as:', url);
  console.log('🌍 Environment:', isLocal ? 'local' : 'deployed');
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