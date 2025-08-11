<?php

namespace Database\Seeders;

use App\Models\Armateur;
use Illuminate\Database\Seeder;

class ArmateurSeeder extends Seeder
{
    public function run(): void
    {
        $armateurs = [
            [
                'code' => 'CMA20',
                'nom' => 'CMA-CGM',
                'type_conteneur' => "20' sec",
                'jours_gratuits' => 2,
                'prix_par_jour' => 10000,
                'contact_nom' => 'Ahmed Diallo',
                'contact_email' => 'ahmed.diallo@cma-cgm.com',
                'contact_telephone' => '+221 33 123 45 67',
                'adresse' => 'Zone Portuaire, Dakar, Sénégal',
            ],
            [
                'code' => 'CMA40',
                'nom' => 'CMA-CGM',
                'type_conteneur' => "40' sec",
                'jours_gratuits' => 2,
                'prix_par_jour' => 20000,
                'contact_nom' => 'Ahmed Diallo',
                'contact_email' => 'ahmed.diallo@cma-cgm.com',
                'contact_telephone' => '+221 33 123 45 67',
                'adresse' => 'Zone Portuaire, Dakar, Sénégal',
            ],
            [
                'code' => 'MSK20',
                'nom' => 'MAERSK',
                'type_conteneur' => "20' sec",
                'jours_gratuits' => 5,
                'prix_par_jour' => 11800,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MSK40',
                'nom' => 'MAERSK',
                'type_conteneur' => "40' sec",
                'jours_gratuits' => 5,
                'prix_par_jour' => 23600,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MSC20',
                'nom' => 'MSC',
                'type_conteneur' => "20' sec",
                'jours_gratuits' => 3,
                'prix_par_jour' => 12000,
                'contact_nom' => 'Mamadou Ba',
                'contact_email' => 'mamadou.ba@msc.com',
                'contact_telephone' => '+221 33 456 78 90',
                'adresse' => 'Terminal MSC, Port de Dakar',
            ],
            [
                'code' => 'MSC40',
                'nom' => 'MSC',
                'type_conteneur' => "40' sec",
                'jours_gratuits' => 3,
                'prix_par_jour' => 24000,
                'contact_nom' => 'Mamadou Ba',
                'contact_email' => 'mamadou.ba@msc.com',
                'contact_telephone' => '+221 33 456 78 90',
                'adresse' => 'Terminal MSC, Port de Dakar',
            ],
        ];

        foreach ($armateurs as $armateur) {
            Armateur::create($armateur);
        }

        // Créer des armateurs supplémentaires avec la factory
        Armateur::factory(5)->create();
    }
}