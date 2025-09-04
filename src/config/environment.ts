// Gestion des variables d'environnement et configuration par défaut
export const environment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // URLs d'API
  apiUrl: import.meta.env.VITE_API_URL,
  apiFallbackUrl: import.meta.env.VITE_API_URL_FALLBACK,
  
  // Configuration par défaut
  defaultApiUrl: 'http://127.0.0.1:8000/api',
  defaultTimeout: 30000,
  
  // Validation des variables requises
  validate() {
    const required = ['VITE_API_URL'];
    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.warn('Variables d\'environnement manquantes:', missing);
    }
    
    return missing.length === 0;
  }
};