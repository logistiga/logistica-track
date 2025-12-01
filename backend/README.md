# Backend Laravel 11 - Système de Gestion Logistique

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Modules](#modules)
- [📚 Documentation API](#-documentation-api)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)
- [Authentification](#authentification)
- [Déploiement](#déploiement)

---

## 🚀 Installation

### Prérequis

- PHP >= 8.2
- Composer
- MySQL/PostgreSQL
- Node.js (pour les assets)

### Étapes d'installation

```bash
# 1. Créer le projet Laravel 11
composer create-project laravel/laravel logistica-backend

cd logistica-backend

# 2. Installer les dépendances supplémentaires
composer require laravel/sanctum
composer require spatie/laravel-permission
composer require barryvdh/laravel-cors
composer require maatwebsite/excel

# 3. Configurer la base de données
cp .env.example .env
php artisan key:generate

# 4. Migrations et seeders
php artisan migrate
php artisan db:seed

# 5. Démarrer le serveur
php artisan serve
```

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
APP_NAME="Logistica Backend"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=logistica
DB_USERNAME=root
DB_PASSWORD=

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Configuration CORS (config/cors.php)

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 🏗️ Architecture

### Structure des dossiers

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── API/
│   │   │   ├── AuthController.php
│   │   │   ├── SortieConteneurController.php
│   │   │   ├── ArmateurController.php
│   │   │   ├── VehiculeController.php
│   │   │   ├── OperationController.php
│   │   │   └── UserController.php
│   │   └── Controller.php
│   ├── Middleware/
│   ├── Requests/
│   └── Resources/
├── Models/
│   ├── User.php
│   ├── SortieConteneur.php
│   ├── Armateur.php
│   ├── Vehicule.php
│   └── Operation.php
├── Services/
├── Observers/
└── Traits/

database/
├── migrations/
├── seeders/
└── factories/

routes/
├── api.php
├── web.php
└── auth.php
```

---

## 📦 Modules

### 1. Authentification et Utilisateurs
- Connexion/Déconnexion
- Gestion des rôles et permissions
- Profils utilisateurs

### 2. Sorties de Conteneurs
- CRUD des sorties
- Suivi des conteneurs
- Retours au port
- Export Excel/PDF

### 3. Armateurs
- Gestion des armateurs
- Tarification
- Types de conteneurs

### 4. Véhicules (Matériel)
- Gestion des camions
- Gestion des remorques
- Statuts de disponibilité

### 5. Opérations
- Planification des opérations
- Suivi des tâches
- Historique

### 6. Notifications
- Notifications en temps réel
- Emails automatiques
- Alertes système

---

## 📚 Documentation API

### 📖 Documentation Complète Disponible

La documentation API complète est disponible en **3 formats** :

1. **📝 Markdown** - Documentation complète détaillée
   - Fichier: `backend/API_DOCUMENTATION.md`
   - Guide d'utilisation: `backend/README_API.md`

2. **🌐 HTML** - Interface web interactive
   - URL: `http://localhost:8000/api-docs.html`
   - Navigation visuelle par modules
   - Codes couleur pour méthodes HTTP

3. **📮 Postman Collection** - Tests prêts à l'emploi
   - Fichier: `backend/postman_collection.json`
   - Importez dans Postman pour tester tous les endpoints

### 🚀 Démarrage Rapide

```bash
# Accéder à la documentation web
php artisan serve
# Ouvrir: http://localhost:8000/api-docs.html

# Ou lire la documentation Markdown
cat API_DOCUMENTATION.md
```

**Pour plus de détails, consultez:** `backend/README_API.md`

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000/api`

### Authentification

```http
POST   /auth/login
POST   /auth/logout
POST   /auth/register
GET    /auth/user
POST   /auth/refresh
```

### Sorties de Conteneurs

```http
GET    /sorties-conteneurs
POST   /sorties-conteneurs
GET    /sorties-conteneurs/{id}
PUT    /sorties-conteneurs/{id}
DELETE /sorties-conteneurs/{id}
POST   /sorties-conteneurs/{id}/retour
GET    /sorties-conteneurs/export
GET    /sorties-conteneurs/stats
```

### Armateurs

```http
GET    /armateurs
POST   /armateurs
GET    /armateurs/{id}
PUT    /armateurs/{id}
DELETE /armateurs/{id}
```

### Véhicules

```http
GET    /vehicules
POST   /vehicules
GET    /vehicules/{id}
PUT    /vehicules/{id}
DELETE /vehicules/{id}
GET    /vehicules/camions
GET    /vehicules/remorques
```

### Opérations

```http
GET    /operations
POST   /operations
GET    /operations/{id}
PUT    /operations/{id}
DELETE /operations/{id}
```

---

## 🗄️ Base de données

### Migrations principales

#### Utilisateurs (incluse dans Laravel)
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Armateurs
```sql
CREATE TABLE armateurs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    type_conteneur VARCHAR(100) NOT NULL,
    jours_gratuits INT DEFAULT 0,
    prix_par_jour DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Véhicules
```sql
CREATE TABLE vehicules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_parc VARCHAR(50) NOT NULL,
    immatriculation VARCHAR(50) NOT NULL,
    type ENUM('camion', 'remorque') NOT NULL,
    statut ENUM('disponible', 'en_mission', 'maintenance') DEFAULT 'disponible',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Sorties de Conteneurs
```sql
CREATE TABLE sortie_conteneurs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_conteneur VARCHAR(100) NOT NULL,
    numero_bl VARCHAR(100) NOT NULL,
    code_armateur VARCHAR(50) NOT NULL,
    camion_id BIGINT UNSIGNED NOT NULL,
    remorque_id BIGINT UNSIGNED NOT NULL,
    prime_chauffeur DECIMAL(10,2) DEFAULT 0,
    nom_client VARCHAR(255) NOT NULL,
    destination ENUM('base', 'client') NOT NULL,
    adresse_client TEXT NULL,
    type_destination ENUM('bad', 'detention') NOT NULL,
    jours_bad INT NULL,
    date_fin_franchise DATE NULL,
    nom_transitaire VARCHAR(255) NOT NULL,
    date_sortie DATE NOT NULL,
    date_retour DATE NULL,
    statut ENUM('en_cours', 'livre_client', 'a_la_base', 'retourne_port') DEFAULT 'en_cours',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (camion_id) REFERENCES vehicules(id),
    FOREIGN KEY (remorque_id) REFERENCES vehicules(id)
);
```

---

## 🔐 Authentification

### Configuration Sanctum

1. **Publier la configuration**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

2. **Middleware API (app/Http/Kernel.php)**
```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

3. **Modèle User**
```php
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles;
    
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];
    
    protected $hidden = [
        'password', 'remember_token',
    ];
}
```

---

## 🚢 Déploiement

### Production

1. **Serveur requis**
   - Ubuntu 20.04+ ou CentOS 8+
   - Nginx ou Apache
   - PHP 8.2+
   - MySQL 8.0+

2. **Configuration Nginx**
```nginx
server {
    listen 80;
    server_name api.logistica.com;
    root /var/www/logistica-backend/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

3. **Commandes de déploiement**
```bash
# Optimisations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

---

## 📚 Ressources supplémentaires

- [Documentation Laravel 11](https://laravel.com/docs/11.x)
- [Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
- [Spatie Permissions](https://spatie.be/docs/laravel-permission/v5/introduction)

---

*Cette documentation sera mise à jour au fur et à mesure du développement du projet.*