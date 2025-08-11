# Guide d'installation Laravel 11

## 🚀 Installation rapide

### 1. Créer le projet

```bash
composer create-project laravel/laravel logistica-backend
cd logistica-backend
```

### 2. Installer les packages requis

```bash
# Authentification API
composer require laravel/sanctum

# Gestion des rôles
composer require spatie/laravel-permission

# CORS pour le frontend
composer require barryvdh/laravel-cors

# Export Excel
composer require maatwebsite/excel

# Validation et utilitaires
composer require intervention/image
```

### 3. Configuration initiale

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Publier les configurations
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### 4. Configuration de la base de données

Modifiez le fichier `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=logistica
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

### 5. Migrations et seeders

```bash
# Exécuter les migrations
php artisan migrate

# Exécuter les seeders (à créer)
php artisan db:seed
```

### 6. Démarrer le serveur

```bash
php artisan serve
```

Votre API sera accessible sur `http://localhost:8000`

## 📁 Structure recommandée

```
logistica-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── API/
│   │   │       ├── AuthController.php
│   │   │       ├── SortieConteneurController.php
│   │   │       ├── ArmateurController.php
│   │   │       └── VehiculeController.php
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   │   ├── SortieConteneur.php
│   │   ├── Armateur.php
│   │   └── Vehicule.php
│   └── Services/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```

## ⚡ Commandes utiles

```bash
# Créer un contrôleur API
php artisan make:controller API/SortieConteneurController --api

# Créer un modèle avec migration
php artisan make:model SortieConteneur -m

# Créer une requête de validation
php artisan make:request StoreSortieConteneurRequest

# Créer une ressource API
php artisan make:resource SortieConteneurResource

# Créer un seeder
php artisan make:seeder ArmateurSeeder

# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```