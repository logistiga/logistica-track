<?php

/*
|--------------------------------------------------------------------------
| Application Autoloader
|--------------------------------------------------------------------------
|
| This file is responsible for autoloading classes and files that are
| needed during the bootstrap process of the Laravel application.
|
*/

// Load Composer autoloader
$composerAutoloader = require __DIR__ . '/../vendor/autoload.php';

// Load application constants
require_once __DIR__ . '/constants.php';

// Load helper functions
require_once __DIR__ . '/helpers.php';

// Set default timezone
date_default_timezone_set(APP_TIMEZONE);

// Set locale for Carbon
\Carbon\Carbon::setLocale('fr');

// Configure error reporting based on environment
if (env('APP_DEBUG', false)) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Set memory limit for large operations
ini_set('memory_limit', '512M');

// Set execution time limit
ini_set('max_execution_time', 300);

// Configure session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', env('SESSION_SECURE_COOKIE', false));

return $composerAutoloader;