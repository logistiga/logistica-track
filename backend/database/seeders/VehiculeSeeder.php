<?php

namespace Database\Seeders;

use App\Models\Vehicule;
use Illuminate\Database\Seeder;

class VehiculeSeeder extends Seeder
{
    public function run(): void
    {
        // Camions avec données réelles
        $camions = [
            ['numero' => 'TR 37', 'matricule' => 'TR 37'],
            ['numero' => 'tr 07', 'matricule' => 'tr 07'],
            ['numero' => 'tr 08', 'matricule' => 'tr 08'],
            ['numero' => 'TR 41', 'matricule' => 'TR 41'],
            ['numero' => 'TR 40', 'matricule' => 'LC-362-AA'],
            ['numero' => 'TR 38', 'matricule' => 'LC-361-AA'],
            ['numero' => 'TR 39', 'matricule' => 'LC-363-AA'],
            ['numero' => 'TR 35', 'matricule' => 'IF-365-AA'],
            ['numero' => 'TR 33', 'matricule' => 'KY-380-AA'],
            ['numero' => 'TR 14', 'matricule' => 'DM-580-AA'],
            ['numero' => 'TR 16', 'matricule' => 'AP-904-AA'],
            ['numero' => 'TR 17', 'matricule' => 'HU-564-AA'],
            ['numero' => 'TR 10', 'matricule' => 'FE-877-AA'],
            ['numero' => 'TR 32', 'matricule' => 'TR 32'],
            ['numero' => 'TR 31', 'matricule' => 'tr31'],
            ['numero' => 'TR 24', 'matricule' => 'TR 24'],
            ['numero' => 'TR 30', 'matricule' => 'KT-965-AA'],
            ['numero' => 'TR 19', 'matricule' => 'AF-535-AA'],
            ['numero' => 'TR 15', 'matricule' => 'FX-717-AA'],
            ['numero' => 'TR 06', 'matricule' => 'DY-413-AA'],
            ['numero' => 'TR 09', 'matricule' => 'AL-704-AA'],
            ['numero' => 'TR 05', 'matricule' => 'AL-701-AA'],
            ['numero' => 'TR 03', 'matricule' => 'AL-702-AA'],
            ['numero' => 'TR 02', 'matricule' => 'EQ-853-AA'],
            ['numero' => 'TR 26', 'matricule' => 'JZ-175-AA'],
            ['numero' => 'TR 21', 'matricule' => 'LC-360-AA'],
            ['numero' => 'TR 20', 'matricule' => 'JL-282-AA'],
            ['numero' => 'TR 23', 'matricule' => 'FA-406-AA'],
            ['numero' => 'TR 18', 'matricule' => 'AK-841-AA'],
            ['numero' => 'TR 28', 'matricule' => 'KE-582-AA'],
            ['numero' => 'TR 25', 'matricule' => 'JZ-176-AA'],
            ['numero' => 'TR 22', 'matricule' => 'FL-616-AA'],
            ['numero' => 'TR 27', 'matricule' => 'AH-372-AA'],
            ['numero' => 'TR 01', 'matricule' => 'TBN 1'],
            ['numero' => 'TR 11', 'matricule' => 'TR 11'],
            ['numero' => 'TR 12', 'matricule' => 'TR 12'],
            ['numero' => 'TR 13', 'matricule' => 'TR 13'],
            ['numero' => 'TR 04', 'matricule' => 'TR 04'],
            ['numero' => 'TR 29', 'matricule' => 'TR 29'],
            ['numero' => 'TR 34', 'matricule' => 'TR 34'],
            ['numero' => 'TR 36', 'matricule' => 'TR 36'],
            ['numero' => 'TR 42', 'matricule' => 'TR 42']
        ];

        // Créer les camions
        foreach ($camions as $camion) {
            Vehicule::create([
                'numero_parc' => $camion['numero'],
                'immatriculation' => $camion['matricule'],
                'type' => 'camion',
                'statut' => 'disponible',
                'marque' => 'Mercedes',
                'modele' => 'Actros',
                'annee' => 2020,
                'capacite' => 30.00,
                'derniere_revision' => '2024-01-15',
                'prochaine_revision' => '2024-07-15',
            ]);
        }

        // Créer les remorques de R01 à R100
        for ($i = 1; $i <= 100; $i++) {
            $numero = sprintf('R %02d', $i);
            $plaque = sprintf('R%02d', $i);
            
            Vehicule::create([
                'numero_parc' => $numero,
                'immatriculation' => $plaque,
                'type' => 'remorque',
                'statut' => 'disponible',
                'annee' => 2020,
                'derniere_revision' => '2024-01-15',
                'prochaine_revision' => '2024-07-15',
            ]);
        }
    }
}