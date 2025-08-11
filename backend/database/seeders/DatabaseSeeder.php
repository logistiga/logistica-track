<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Armateur;
use App\Models\Vehicule;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Créer un utilisateur admin
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@logistica.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Créer des armateurs
        $armateurs = [
            [
                'code' => 'CMA20',
                'nom' => 'CMA-CGM',
                'type_conteneur' => "20' sec",
                'jours_gratuits' => 2,
                'prix_par_jour' => 10000,
                'contact_email' => 'contact@cma-cgm.com',
            ],
            [
                'code' => 'CMA40',
                'nom' => 'CMA-CGM',
                'type_conteneur' => "40' sec",
                'jours_gratuits' => 2,
                'prix_par_jour' => 20000,
                'contact_email' => 'contact@cma-cgm.com',
            ],
            [
                'code' => 'MSK20',
                'nom' => 'MAERSK',
                'type_conteneur' => "20' sec",
                'jours_gratuits' => 5,
                'prix_par_jour' => 11800,
                'contact_email' => 'contact@maersk.com',
            ],
        ];

        foreach ($armateurs as $armateur) {
            Armateur::create($armateur);
        }

        // Créer des véhicules
        $vehicules = [
            // Camions
            [
                'numero_parc' => 'TR 37',
                'immatriculation' => 'TR 37',
                'type' => 'camion',
                'statut' => 'disponible',
                'marque' => 'Mercedes',
                'modele' => 'Actros',
            ],
            [
                'numero_parc' => 'TR 41',
                'immatriculation' => 'TR 41',
                'type' => 'camion',
                'statut' => 'disponible',
                'marque' => 'Volvo',
                'modele' => 'FH',
            ],
            [
                'numero_parc' => 'tr 08',
                'immatriculation' => 'tr 08',
                'type' => 'camion',
                'statut' => 'en_mission',
                'marque' => 'Scania',
                'modele' => 'R500',
            ],
            
            // Remorques
            [
                'numero_parc' => 'R 01',
                'immatriculation' => 'R01',
                'type' => 'remorque',
                'statut' => 'disponible',
            ],
            [
                'numero_parc' => 'R 02',
                'immatriculation' => 'R02',
                'type' => 'remorque',
                'statut' => 'disponible',
            ],
            [
                'numero_parc' => 'R 03',
                'immatriculation' => 'R03',
                'type' => 'remorque',
                'statut' => 'en_mission',
            ],
        ];

        foreach ($vehicules as $vehicule) {
            Vehicule::create($vehicule);
        }
    }
}