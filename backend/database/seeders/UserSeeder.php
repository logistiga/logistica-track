<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les utilisateurs par défaut
        $defaultUsers = [
            [
                'name' => 'Super Administrateur',
                'email' => 'admin@logistica.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'departement' => 'Administration',
                'telephone' => '+221 77 123 45 67',
            ],
            [
                'name' => 'Manager Transport',
                'email' => 'manager@logistica.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'departement' => 'Transport',
                'telephone' => '+221 77 123 45 68',
            ],
            [
                'name' => 'Opérateur Logistique',
                'email' => 'operator@logistica.com',
                'password' => Hash::make('operator123'),
                'role' => 'operator',
                'departement' => 'Logistique',
                'telephone' => '+221 77 123 45 69',
            ],
            [
                'name' => 'Visiteur Consultation',
                'email' => 'viewer@logistica.com',
                'password' => Hash::make('viewer123'),
                'role' => 'viewer',
                'departement' => 'Commercial',
                'telephone' => '+221 77 123 45 70',
            ],
        ];

        foreach ($defaultUsers as $userData) {
            User::create($userData);
        }

        // Créer des utilisateurs supplémentaires avec la factory
        User::factory(10)->create();
    }
}