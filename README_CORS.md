# Configuration CORS et Backend

## Problème actuel
L'application Lovable déployée ne peut pas accéder à votre backend Laravel local (`http://127.0.0.1:8000`) car il n'est pas accessible depuis internet.

## Solutions

### Option 1: Utiliser ngrok (Développement)
```bash
# 1. Installez ngrok: https://ngrok.com/
# 2. Exposez votre serveur Laravel
ngrok http 8000

# 3. Copiez l'URL publique (ex: https://abc123.ngrok.io)
# 4. Mettez à jour l'URL dans src/services/apiService.ts
const API_BASE_URL = 'https://abc123.ngrok.io/api';
```

### Option 2: Déployer le backend
Déployez votre backend Laravel sur:
- Heroku
- DigitalOcean
- AWS
- Ou tout autre hébergeur

### Option 3: Configuration locale (si vous développez localement)
Si vous développez en local:
```bash
# Clonez le projet localement
git clone [url-du-projet]
cd [nom-du-projet]
npm install
npm run dev

# L'application sera accessible sur http://localhost:3000
# et pourra communiquer avec votre backend local
```

## Configuration actuelle
- Frontend déployé: https://b3b36859-40bc-4d2e-9dda-fa8b3af543d8.lovableproject.com
- Backend configuré: http://127.0.0.1:8000/api (non accessible)
- CORS configuré pour accepter les domaines Lovable

## Prochaines étapes
1. Choisissez une des options ci-dessus
2. Mettez à jour l'URL dans `src/services/apiService.ts`
3. Testez la connexion