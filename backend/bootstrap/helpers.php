<?php

/*
|--------------------------------------------------------------------------
| Bootstrap Helper Functions
|--------------------------------------------------------------------------
|
| This file contains helper functions that are loaded during the bootstrap
| process of the Laravel application. These functions provide utilities
| that can be used throughout the application.
|
*/

if (!function_exists('formatCurrency')) {
    /**
     * Format a number as currency in FCFA
     */
    function formatCurrency($amount, $decimals = 0): string
    {
        return number_format($amount, $decimals, ',', ' ') . ' FCFA';
    }
}

if (!function_exists('formatDate')) {
    /**
     * Format a date for display
     */
    function formatDate($date, $format = 'd/m/Y'): string
    {
        if (!$date) {
            return '';
        }
        
        if (is_string($date)) {
            $date = \Carbon\Carbon::parse($date);
        }
        
        return $date->format($format);
    }
}

if (!function_exists('formatDateTime')) {
    /**
     * Format a datetime for display
     */
    function formatDateTime($datetime, $format = 'd/m/Y H:i'): string
    {
        if (!$datetime) {
            return '';
        }
        
        if (is_string($datetime)) {
            $datetime = \Carbon\Carbon::parse($datetime);
        }
        
        return $datetime->format($format);
    }
}

if (!function_exists('getStatutColor')) {
    /**
     * Get color class for status
     */
    function getStatutColor($statut): string
    {
        return match($statut) {
            'en_cours', 'planifiee', 'active', 'disponible' => 'text-blue-600',
            'livre_client', 'terminee', 'payee', 'envoye' => 'text-green-600',
            'a_la_base', 'en_attente', 'brouillon' => 'text-yellow-600',
            'retourne_port', 'resolue', 'lu' => 'text-gray-600',
            'annulee', 'echec', 'maintenance' => 'text-red-600',
            'urgente', 'critique' => 'text-red-700',
            'haute' => 'text-orange-600',
            'normale' => 'text-blue-500',
            'basse' => 'text-green-500',
            default => 'text-gray-500'
        };
    }
}

if (!function_exists('getPrioriteColor')) {
    /**
     * Get color class for priority
     */
    function getPrioriteColor($priorite): string
    {
        return match($priorite) {
            'critique' => 'text-red-700 bg-red-100',
            'urgente' => 'text-red-600 bg-red-50',
            'haute' => 'text-orange-600 bg-orange-50',
            'normale' => 'text-blue-600 bg-blue-50',
            'basse' => 'text-green-600 bg-green-50',
            default => 'text-gray-600 bg-gray-50'
        };
    }
}

if (!function_exists('calculateDetentionCost')) {
    /**
     * Calculate detention cost
     */
    function calculateDetentionCost($dateDebut, $dateFin, $coutParJour): float
    {
        if (!$dateDebut || !$coutParJour) {
            return 0;
        }
        
        $debut = is_string($dateDebut) ? \Carbon\Carbon::parse($dateDebut) : $dateDebut;
        $fin = $dateFin ? (is_string($dateFin) ? \Carbon\Carbon::parse($dateFin) : $dateFin) : now();
        
        $jours = $debut->diffInDays($fin);
        
        return $jours * $coutParJour;
    }
}

if (!function_exists('generateReference')) {
    /**
     * Generate a unique reference number
     */
    function generateReference($prefix = '', $length = 8): string
    {
        $number = str_pad(random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
        return $prefix ? $prefix . $number : $number;
    }
}

if (!function_exists('isWorkingDay')) {
    /**
     * Check if a date is a working day (Monday to Friday)
     */
    function isWorkingDay($date): bool
    {
        if (is_string($date)) {
            $date = \Carbon\Carbon::parse($date);
        }
        
        return $date->isWeekday();
    }
}

if (!function_exists('addWorkingDays')) {
    /**
     * Add working days to a date
     */
    function addWorkingDays($date, $days): \Carbon\Carbon
    {
        if (is_string($date)) {
            $date = \Carbon\Carbon::parse($date);
        }
        
        return $date->addWeekdays($days);
    }
}

if (!function_exists('getVehiculeStatus')) {
    /**
     * Get vehicle status with color
     */
    function getVehiculeStatus($statut): array
    {
        return match($statut) {
            'disponible' => ['label' => 'Disponible', 'color' => 'green'],
            'en_mission' => ['label' => 'En mission', 'color' => 'blue'],
            'maintenance' => ['label' => 'Maintenance', 'color' => 'red'],
            default => ['label' => ucfirst($statut), 'color' => 'gray']
        };
    }
}

if (!function_exists('logActivity')) {
    /**
     * Log user activity
     */
    function logActivity($action, $model = null, $description = null): void
    {
        try {
            // Vérifier si l'authentification est disponible
            if (!auth()->check()) {
                return;
            }
            
            \Illuminate\Support\Facades\Log::info('User Activity', [
                'user_id' => auth()->id(),
                'action' => $action,
                'model' => $model ? get_class($model) : null,
                'model_id' => $model?->id,
                'description' => $description,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            // Silently fail to avoid breaking the application
        }
    }
}

if (!function_exists('sendNotification')) {
    /**
     * Send notification helper
     */
    function sendNotification($userId, $type, $title, $message, $metadata = []): void
    {
        try {
            // Vérifier si l'authentification est disponible et si userId est fourni
            if (!$userId || (!auth()->check() && !is_numeric($userId))) {
                return;
            }
            
            \App\Models\Notification::create([
                'user_id' => $userId,
                'type' => $type,
                'titre' => $title,
                'message' => $message,
                'priorite' => $metadata['priorite'] ?? 'normale',
                'metadata' => $metadata,
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Notification sending failed', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'type' => $type,
            ]);
        }
    }
}