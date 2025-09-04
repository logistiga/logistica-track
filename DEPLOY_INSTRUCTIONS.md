# Instructions de déploiement - Résolution CORS

## Problème actuel
L'application Lovable déployée ne peut pas accéder au backend Laravel local (`127.0.0.1:8000`) à cause des restrictions CORS et réseau.

## Solutions disponibles

### Solution 1: Utiliser ngrok (Recommandée pour test rapide)

1. **Installer ngrok**
   ```bash
   npm install -g ngrok
   # ou télécharger depuis https://ngrok.com/
   ```

2. **Démarrer votre backend Laravel**
   ```bash
   cd backend
   php artisan serve
   ```

3. **Exposer le backend avec ngrok**
   ```bash
   ngrok http 8000
   ```

4. **Copier l'URL HTTPS générée**
   - Exemple: `https://abc123.ngrok.io`

5. **Mettre à jour .env.production**
   ```
   VITE_API_URL=https://abc123.ngrok.io/api
   VITE_API_URL_FALLBACK=https://abc123.ngrok.io/api
   ```

6. **Redéployer l'application Lovable**

### Solution 2: Déployer le backend Laravel

#### Avec Railway
1. Créer un compte sur [Railway](https://railway.app)
2. Connecter votre repository GitHub
3. Déployer le dossier `backend`
4. Configurer les variables d'environnement
5. Obtenir l'URL publique

#### Avec Heroku
1. Installer Heroku CLI
2. ```bash
   cd backend
   heroku create votre-app-name
   git subtree push --prefix backend heroku main
   ```

#### Avec DigitalOcean App Platform
1. Créer une nouvelle app depuis le dashboard
2. Connecter votre repository
3. Configurer le build path vers `/backend`
4. Déployer

### Solution 3: Développement local

1. **Télécharger le projet Lovable**
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Lancer en mode développement**
   ```bash
   npm run dev
   ```
4. **Votre app locale pourra accéder au backend local**

## Configuration CORS déjà mise à jour

Le fichier `backend/config/cors.php` a été mis à jour pour inclure:
- Votre domaine Lovable actuel
- Les patterns pour tous les domaines Lovable
- Support des credentials

## Variables d'environnement

### .env (développement local)
```
VITE_API_URL=http://127.0.0.1:8000/api
VITE_API_URL_FALLBACK=https://127.0.0.1:8000/api
```

### .env.production (production)
```
VITE_API_URL=https://votre-backend-deploye.com/api
VITE_API_URL_FALLBACK=https://votre-backend-deploye.com/api
```

## Test de connexion

Une fois configuré, testez la connexion en essayant de vous connecter depuis l'interface de login.