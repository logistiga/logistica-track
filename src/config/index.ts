// Point d'entrée centralisé pour toutes les configurations

export { environment } from './environment';
export { apiConfig, getApiBaseUrl } from './api';
export { corsConfig } from './cors';

import { environment } from './environment';
import { apiConfig } from './api';
import { corsConfig } from './cors';

// Validation globale de la configuration
export const validateConfig = () => {
  const envValid = environment.validate();
  
  if (!envValid) {
    console.error('Configuration invalide détectée');
    return false;
  }
  
  console.log('Configuration validée avec succès');
  console.log('API Base URL:', apiConfig.baseUrl);
  console.log('Environment:', environment.isDevelopment ? 'Development' : 'Production');
  
  return true;
};

// Export des configurations principales
export const config = {
  api: apiConfig,
  cors: corsConfig,
  env: environment,
} as const;