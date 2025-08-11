<?php

/*
|--------------------------------------------------------------------------
| Application Constants
|--------------------------------------------------------------------------
|
| This file defines global constants used throughout the application.
| These constants provide a centralized way to manage application-wide
| configuration values and business rules.
|
*/

// Application Constants
define('APP_NAME', 'Logistica');
define('APP_VERSION', '1.0.0');
define('APP_TIMEZONE', 'Africa/Dakar');

// Business Constants
define('DEFAULT_CURRENCY', 'FCFA');
define('DEFAULT_LANGUAGE', 'fr');

// Container Types
define('CONTAINER_TYPES', [
    '20_sec' => "20' sec",
    '40_sec' => "40' sec", 
    '40_hc' => "40' HC",
    '45_hc' => "45' HC",
]);

// Vehicle Types
define('VEHICLE_TYPES', [
    'camion' => 'Camion',
    'remorque' => 'Remorque',
]);

// Vehicle Status
define('VEHICLE_STATUS', [
    'disponible' => 'Disponible',
    'en_mission' => 'En mission', 
    'maintenance' => 'Maintenance',
]);

// Container Exit Status
define('SORTIE_STATUS', [
    'en_cours' => 'En cours',
    'livre_client' => 'Livré client',
    'a_la_base' => 'À la base',
    'retourne_port' => 'Retourné port',
]);

// Operation Status
define('OPERATION_STATUS', [
    'planifiee' => 'Planifiée',
    'en_cours' => 'En cours',
    'terminee' => 'Terminée',
    'annulee' => 'Annulée',
]);

// Priority Levels
define('PRIORITY_LEVELS', [
    'basse' => 'Basse',
    'normale' => 'Normale',
    'haute' => 'Haute',
    'urgente' => 'Urgente',
    'critique' => 'Critique',
]);

// User Roles
define('USER_ROLES', [
    'admin' => 'Administrateur',
    'manager' => 'Manager',
    'operator' => 'Opérateur',
    'viewer' => 'Visiteur',
]);

// Detention Responsibilities
define('DETENTION_RESPONSIBILITIES', [
    'client' => 'Client',
    'transitaire' => 'Transitaire', 
    'transporteur' => 'Transporteur',
    'autre' => 'Autre',
]);

// Detention Status
define('DETENTION_STATUS', [
    'active' => 'Active',
    'resolue' => 'Résolue',
    'contestee' => 'Contestée',
]);

// Invoice Status
define('INVOICE_STATUS', [
    'brouillon' => 'Brouillon',
    'envoyee' => 'Envoyée',
    'payee' => 'Payée',
    'annulee' => 'Annulée',
]);

// Email Status
define('EMAIL_STATUS', [
    'en_attente' => 'En attente',
    'envoye' => 'Envoyé',
    'echec' => 'Échec',
    'annule' => 'Annulé',
]);

// Notification Status
define('NOTIFICATION_STATUS', [
    'non_lu' => 'Non lu',
    'lu' => 'Lu',
    'archive' => 'Archivé',
]);

// File Upload Limits
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_FILE_TYPES', [
    'jpg', 'jpeg', 'png', 'gif', 'bmp',
    'pdf', 'doc', 'docx', 'xls', 'xlsx',
    'txt', 'csv'
]);

// Pagination Limits
define('DEFAULT_PER_PAGE', 25);
define('MAX_PER_PAGE', 100);

// Cache Time Constants (in minutes)
define('CACHE_SHORT', 5);
define('CACHE_MEDIUM', 30);
define('CACHE_LONG', 60);
define('CACHE_DAY', 1440);

// Business Rules
define('MAX_DETENTION_DAYS', 365);
define('DEFAULT_FREE_DAYS', 2);
define('MAX_PRIME_CHAUFFEUR', 50000);
define('MIN_PRIME_CHAUFFEUR', 1000);

// Date Formats
define('DATE_FORMAT', 'd/m/Y');
define('DATETIME_FORMAT', 'd/m/Y H:i');
define('TIME_FORMAT', 'H:i');
define('SQL_DATE_FORMAT', 'Y-m-d');
define('SQL_DATETIME_FORMAT', 'Y-m-d H:i:s');

// Export Formats
define('EXPORT_FORMATS', [
    'excel' => 'Excel (.xlsx)',
    'csv' => 'CSV (.csv)',
    'pdf' => 'PDF (.pdf)',
]);

// Regex Patterns
define('REGEX_PHONE', '/^(\+221|221)?[0-9]{8,9}$/');
define('REGEX_EMAIL', '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/');
define('REGEX_CONTAINER', '/^[A-Z]{4}[0-9]{7}$/');
define('REGEX_VEHICLE_NUMBER', '/^[A-Z0-9\s\-]+$/');

// API Response Codes
define('API_SUCCESS', 200);
define('API_CREATED', 201);
define('API_BAD_REQUEST', 400);
define('API_UNAUTHORIZED', 401);
define('API_FORBIDDEN', 403);
define('API_NOT_FOUND', 404);
define('API_VALIDATION_ERROR', 422);
define('API_SERVER_ERROR', 500);

// Log Levels
define('LOG_EMERGENCY', 'emergency');
define('LOG_ALERT', 'alert');
define('LOG_CRITICAL', 'critical');
define('LOG_ERROR', 'error');
define('LOG_WARNING', 'warning');
define('LOG_NOTICE', 'notice');
define('LOG_INFO', 'info');
define('LOG_DEBUG', 'debug');