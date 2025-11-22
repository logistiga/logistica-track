<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Skipping notification seeding.');
            return;
        }

        $notifications = [
            [
                'type' => 'retard',
                'titre' => 'Retard de retour conteneur',
                'message' => 'Le conteneur MSKU1234567 est en retard de 3 jours pour son retour en base',
                'priorite' => 'haute',
                'statut' => 'non_lu',
                'metadata' => json_encode([
                    'conteneur_id' => 1,
                    'jours_retard' => 3,
                ]),
            ],
            [
                'type' => 'alerte',
                'titre' => 'Véhicule nécessite maintenance',
                'message' => 'Le véhicule VEH-001 a atteint le seuil de maintenance',
                'priorite' => 'normale',
                'statut' => 'non_lu',
                'metadata' => json_encode([
                    'vehicule_id' => 1,
                    'type_maintenance' => 'preventive',
                ]),
            ],
            [
                'type' => 'rentree',
                'titre' => 'Conteneur retourné à la base',
                'message' => 'Le conteneur TCLU9876543 est retourné à la base',
                'priorite' => 'normale',
                'statut' => 'lu',
                'metadata' => json_encode([
                    'conteneur_id' => 2,
                ]),
                'lu_le' => now()->subHours(2),
            ],
            [
                'type' => 'alerte',
                'titre' => 'Detention critique',
                'message' => 'Detention supérieure à 10 jours détectée pour le conteneur CSQU4567890',
                'priorite' => 'critique',
                'statut' => 'non_lu',
                'metadata' => json_encode([
                    'conteneur_id' => 3,
                    'jours_detention' => 12,
                ]),
            ],
        ];

        foreach ($users as $user) {
            foreach ($notifications as $notificationData) {
                Notification::create(array_merge($notificationData, [
                    'user_id' => $user->id,
                ]));
            }
        }

        $this->command->info('Notifications seeded successfully.');
    }
}
