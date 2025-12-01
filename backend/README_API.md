# 🚀 Guide d'Utilisation de la Documentation API

## 📚 Formats Disponibles

La documentation API Logistiga est disponible en **3 formats différents** pour répondre à tous vos besoins :

### 1. **Documentation Markdown** 📝
Fichier complet avec tous les détails des endpoints.

**Emplacement:** `backend/API_DOCUMENTATION.md`

**Utilisation:**
- Consultez directement le fichier dans votre éditeur
- Compatible avec GitHub, GitLab, etc.
- Facile à rechercher avec Ctrl+F

### 2. **Documentation Web HTML** 🌐
Interface web moderne et interactive.

**Accès:** 
```
http://localhost:8000/api-docs.html
```

**Fonctionnalités:**
- Interface visuelle moderne
- Navigation par modules
- Codes couleur pour les méthodes HTTP
- Responsive (mobile-friendly)

**Emplacement:** `backend/public/api-docs.html`

### 3. **Collection Postman** 📮
Collection prête à l'emploi pour tester tous les endpoints.

**Emplacement:** `backend/postman_collection.json`

**Import dans Postman:**
1. Ouvrez Postman
2. Cliquez sur "Import"
3. Sélectionnez le fichier `postman_collection.json`
4. Configurez la variable `base_url` avec votre URL d'API
5. Après login, copiez le token dans la variable `auth_token`

---

## 🔧 Configuration

### Variables d'Environnement

Pour utiliser la documentation et tester l'API, configurez ces variables :

**Dans Postman:**
```
base_url: https://your-domain.com/api
auth_token: (sera rempli après login)
```

**Dans votre application:**
```env
APP_URL=https://your-domain.com
API_URL=${APP_URL}/api
```

---

## 🎯 Démarrage Rapide

### 1. Accéder à la Documentation Web

```bash
# Démarrez le serveur Laravel
cd backend
php artisan serve

# Accédez à la documentation
# Ouvrez votre navigateur: http://localhost:8000/api-docs.html
```

### 2. Tester avec Postman

```bash
# 1. Importez la collection Postman
# 2. Configurez base_url = http://localhost:8000/api
# 3. Testez l'endpoint /auth/login
# 4. Copiez le token retourné dans auth_token
# 5. Testez les autres endpoints protégés
```

### 3. Intégration dans votre Code

```javascript
// Exemple JavaScript/React
const API_URL = 'http://localhost:8000/api';
const token = localStorage.getItem('auth_token');

const response = await fetch(`${API_URL}/dashboard`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

```php
// Exemple PHP/Laravel
use Illuminate\Support\Facades\Http;

$response = Http::withToken($token)
    ->get('http://localhost:8000/api/dashboard');

$data = $response->json();
```

---

## 📖 Structure de la Documentation

### Sections Principales

1. **🔐 Authentification**
   - Login, Register, Logout
   - Gestion des tokens

2. **📊 Dashboard**
   - Statistiques globales
   - Activités récentes
   - Alertes système

3. **🏢 Armateurs**
   - CRUD complet
   - Statistiques

4. **🚛 Véhicules**
   - Gestion camions/remorques
   - Suivi statut et maintenance

5. **📦 Sorties Conteneur**
   - Création sorties
   - Retours
   - Export Excel/PDF

6. **🔧 Opérations**
   - Location et transport
   - Suivi workflow
   - Calculs automatiques

7. **⏱️ Détentions**
   - Calcul coûts
   - Responsabilités
   - PDFs

8. **💰 Facturations**
   - Génération automatique
   - Envoi par email
   - Suivi paiements

9. **🏭 Base**
   - Stockage
   - Double relevage
   - Dépotage

10. **💸 Primes Chauffeur**
    - Gestion hebdomadaire
    - Paiement en lot
    - Archives

11. **📁 Archives**
    - Historique complet
    - Recherche avancée
    - Exports

12. **🔔 Notifications**
    - Alertes temps réel
    - Gestion lecture

---

## 🔑 Authentification

### Obtenir un Token

**1. Via l'API:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@logistiga.com",
    "password": "password123"
  }'
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "token": "1|abcdef123456...",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@logistiga.com"
    }
  }
}
```

**2. Utiliser le Token:**
```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer 1|abcdef123456..." \
  -H "Content-Type: application/json"
```

---

## 📊 Exemples d'Usage

### Créer une Sortie Conteneur

```bash
curl -X POST http://localhost:8000/api/sorties \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "numero_tc": "ABCD1234567",
    "armateur_id": 1,
    "date_sortie": "2024-12-01",
    "camion_id": 5,
    "remorque_id": 12,
    "chauffeur": "Jean Dupont",
    "destination": "Yamoussoukro",
    "client": "ABC Trading"
  }'
```

### Payer des Primes en Lot

```bash
curl -X POST http://localhost:8000/api/primes/payer-en-lot \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sortie_ids": [1, 2, 3, 4, 5],
    "date_paiement": "2024-12-15",
    "observations": "Paiement semaine 48"
  }'
```

### Rechercher dans les Archives

```bash
curl -X GET "http://localhost:8000/api/archives/sorties/search?query=ABCD&date_debut=2024-01-01" \
  -H "Authorization: Bearer {token}"
```

---

## ❗ Résolution de Problèmes

### Erreur 401 - Non Authentifié
```
Solution: Vérifiez que le token est valide et présent dans le header Authorization
```

### Erreur 403 - Non Autorisé
```
Solution: Vérifiez que votre rôle utilisateur a les permissions nécessaires
```

### Erreur 422 - Validation
```
Solution: Consultez le champ "errors" dans la réponse pour voir les champs invalides
```

### Erreur 500 - Serveur
```
Solution: Consultez les logs Laravel: backend/storage/logs/laravel.log
```

### CORS Error
```
Solution: 
1. Vérifiez que CorsMiddleware est actif
2. Redémarrez le serveur Laravel
3. Vérifiez la configuration dans backend/config/cors.php
```

---

## 🛠️ Outils Recommandés

### Pour Tester l'API
- **Postman** - Interface graphique complète
- **Insomnia** - Alternative légère à Postman
- **curl** - Ligne de commande
- **HTTPie** - curl moderne et coloré

### Pour Lire la Documentation
- **VS Code** - Markdown Preview
- **Typora** - Éditeur Markdown élégant
- **Navigateur Web** - Pour la version HTML

---

## 📝 Notes Importantes

### Format des Dates
```
YYYY-MM-DD (ex: 2024-12-01)
YYYY-MM-DDTHH:mm:ssZ (ex: 2024-12-01T10:00:00Z)
```

### Devise
```
Tous les montants sont en FCFA (entiers)
Exemple: 70000 = 70 000 FCFA
```

### Pagination
```
Par défaut: 15 éléments par page
Maximum: 100 éléments par page
Paramètres: ?page=1&per_page=20
```

### Rate Limiting
```
60 requêtes/minute par IP
1000 requêtes/heure par utilisateur authentifié
```

---

## 📞 Support

### Logs et Débogage
```bash
# Logs Laravel
tail -f backend/storage/logs/laravel.log

# Logs serveur
php artisan serve --verbose

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan optimize:clear
```

### Contacts
- **Documentation complète:** `backend/API_DOCUMENTATION.md`
- **Documentation web:** `http://localhost:8000/api-docs.html`
- **Health Check:** `http://localhost:8000/api/health`

---

## 🎓 Ressources Additionnelles

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JSON API Specification](https://jsonapi.org/)

---

**Version:** 1.0  
**Dernière mise à jour:** 2024-12-01  
**Mainteneur:** Équipe Logistiga
