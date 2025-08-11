<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Canal pour les notifications utilisateur
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal pour les notifications globales (admin seulement)
Broadcast::channel('admin.notifications', function ($user) {
    return $user->role === 'admin';
});

// Canal pour les mises à jour des sorties de conteneurs
Broadcast::channel('sorties.updates', function ($user) {
    return in_array($user->role, ['admin', 'manager', 'operator']);
});

// Canal pour les alertes de véhicules
Broadcast::channel('vehicules.alerts', function ($user) {
    return in_array($user->role, ['admin', 'manager', 'operator']);
});

// Canal pour les mises à jour d'opérations
Broadcast::channel('operations.{operationId}', function ($user, $operationId) {
    return in_array($user->role, ['admin', 'manager', 'operator']);
});

// Canal pour les détentions critiques
Broadcast::channel('detentions.critical', function ($user) {
    return in_array($user->role, ['admin', 'manager']);
});