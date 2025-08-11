<?php

namespace Database\Seeders;

use App\Models\Vehicule;
use Illuminate\Database\Seeder;

class VehiculeSeeder extends Seeder
{
    public function run(): void
    {
        $vehicules = [
            // Camions
            [
                'numero_parc' => 'TR 37',
                'immatriculation' => 'DK 1234 AB',
                'type' => 'camion',
                'statut' => 'disponible',
                'marque' => 'Mercedes',
                'modele' => 'Actros',
                'annee' => 2020,
                'capacite' => 30.00,
                'derniere_revision' => '2024-01-15',
                'prochaine_revision' => '2024-07-15',
            ],
            [
                'numero_parc' => 'TR 41',
                'immatriculation' => 'DK 5678 CD',
                'type' => 'camion',
                'statut' => 'disponible',
                'marque' => 'Volvo',
                'modele' => 'FH',
                'annee' => 2019,
                'capacite' => 32.00,
                'derniere_revision' => '2023-12-20',
                'prochaine_revision' => '2024-06-20',
            ],
            [
                'numero_parc' => 'TR 08',
                'immatriculation' => 'DK 9012 EF',
                'type' => 'camion',
                'statut' => 'en_mission',
                'marque' => 'Scania',
                'modele' => 'R500',
                'annee' => 2021,
                'capacite' => 35.00,
                'derniere_revision' => '2024-02-10',
                'prochaine_revision' => '2024-08-10',
            ],
            [
                'numero_parc' => 'TR 15',
                'immatriculation' => 'DK 3456 GH',
                'type' => 'camion',
                'statut' => 'disponible',
                'marque' => 'MAN',
                'modele' => 'TGX',
                'annee' => 2022,
                'capacite' => 33.00,
                'derniere_revision' => '2024-01-05',
                'prochaine_revision' => '2024-07-05',
            ],
            
            // Remorques
            [
                'numero_parc' => 'R 01',
                'immatriculation' => 'DK 7890 IJ',
                'type' => 'remorque',
                'statut' => 'disponible',
                'annee' => 2020,
                'derniere_revision' => '2024-01-20',
                'prochaine_revision' => '2024-07-20',
            ],
            [
                'numero_parc' => 'R 02',
                'immatriculation' => 'DK 1357 KL',
                'type' => 'remorque',
                'statut' => 'disponible',
                'annee' => 2019,
                'derniere_revision' => '2023-11-15',
                'prochaine_revision' => '2024-05-15',
            ],
            [
                'numero_parc' => 'R 03',
                'immatriculation' => 'DK 2468 MN',
                'type' => 'remorque',
                'statut' => 'en_mission',
                'annee' => 2021,
                'derniere_revision' => '2024-02-01',
                'prochaine_revision' => '2024-08-01',
            ],
            [
                'numero_parc' => 'R 04',
                'immatriculation' => 'DK 9753 OP',
                'type' => 'remorque',
                'statut' => 'maintenance',
                'annee' => 2018,
                'derniere_revision' => '2023-10-12',
                'prochaine_revision' => '2024-04-12',
                'notes' => 'Freins à réviser',
            ],
        ];

        foreach ($vehicules as $vehicule) {
            Vehicule::create($vehicule);
        }

        // Créer des véhicules supplémentaires avec la factory
        Vehicule::factory(15)->camion()->create();
        Vehicule::factory(20)->remorque()->create();
    }
}