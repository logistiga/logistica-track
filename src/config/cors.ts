// Configuration CORS pour les requêtes API

export const corsConfig = {
  // Headers CORS à inclure dans les requêtes
  corsHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
  },
  
  // Domaines autorisés (pour validation côté client)
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://lovable.dev',
    'https://*.lovable.dev',
    'https://b3b36859-40bc-4d2e-9dda-fa8b3af543d8.sandbox.lovable.dev',
  ],
  
  // Méthodes HTTP autorisées
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Headers autorisés
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Origin',
    'Cache-Control',
    'Pragma',
  ],
  
  // Configuration des credentials
  credentials: true,
  
  // Preflight cache (en secondes)
  maxAge: 86400, // 24 heures
  
  // Vérifier si l'origine est autorisée
  isOriginAllowed(origin: string): boolean {
    if (!origin) return true; // Même origine
    
    return this.allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
  }
};