<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure will be bound as a command and may be accessed
| from the command line or through the Artisan interface.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Commande pour nettoyer les anciens logs
Artisan::command('cleanup:logs', function () {
    $this->info('Nettoyage des anciens logs...');
    // Logique de nettoyage des logs
    $this->info('Logs nettoyés avec succès.');
})->purpose('Nettoyer les anciens logs système');

// Commande pour générer les rapports quotidiens
Artisan::command('reports:daily', function () {
    $this->info('Génération des rapports quotidiens...');
    // Logique de génération des rapports
    $this->info('Rapports générés avec succès.');
})->purpose('Générer les rapports quotidiens');

// Commande pour vérifier les détentions en cours
Artisan::command('detentions:check', function () {
    $this->info('Vérification des détentions en cours...');
    // Logique de vérification des détentions
    $this->info('Vérification terminée.');
})->purpose('Vérifier les détentions en cours et envoyer des alertes');

// Commande pour synchroniser les données
Artisan::command('sync:data', function () {
    $this->info('Synchronisation des données...');
    // Logique de synchronisation
    $this->info('Synchronisation terminée.');
})->purpose('Synchroniser les données avec les systèmes externes');