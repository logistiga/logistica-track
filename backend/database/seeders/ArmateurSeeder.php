<?php

namespace Database\Seeders;

use App\Models\Armateur;
use Illuminate\Database\Seeder;

class ArmateurSeeder extends Seeder
{
    public function run(): void
    {
        $armateurs = [
            // MSC Armateur
            [
                'code' => 'MSC20',
                'nom' => 'MSC',
                'type_conteneur' => '20\' sec',
                'jours_gratuits' => 3,
                'prix_par_jour' => 8600.00,
                'contact_nom' => 'Mamadou Ba',
                'contact_email' => 'mamadou.ba@msc.com',
                'contact_telephone' => '+221 33 456 78 90',
                'adresse' => 'Terminal MSC, Port de Dakar',
            ],
            [
                'code' => 'MSC40',
                'nom' => 'MSC',
                'type_conteneur' => '40\' sec',
                'jours_gratuits' => 3,
                'prix_par_jour' => 17200.00,
                'contact_nom' => 'Mamadou Ba',
                'contact_email' => 'mamadou.ba@msc.com',
                'contact_telephone' => '+221 33 456 78 90',
                'adresse' => 'Terminal MSC, Port de Dakar',
            ],
            [
                'code' => 'MSC20FRGO',
                'nom' => 'MSC',
                'type_conteneur' => '20\' frigo',
                'jours_gratuits' => 3,
                'prix_par_jour' => 44500.00,
                'contact_nom' => 'Mamadou Ba',
                'contact_email' => 'mamadou.ba@msc.com',
                'contact_telephone' => '+221 33 456 78 90',
                'adresse' => 'Terminal MSC, Port de Dakar',
            ],
            [
                'code' => 'MSC40FRIGO',
                'nom' => 'MSC',
                'type_conteneur' => '40\' frigo',
                'jours_gratuits' => 3,
                'prix_par_jour' => 89000.00,
                'contact_nom' => 'Mamadou Ba',
                'contact_email' => 'mamadou.ba@msc.com',
                'contact_telephone' => '+221 33 456 78 90',
                'adresse' => 'Terminal MSC, Port de Dakar',
            ],
            
            // CMA-CGM Armateur
            [
                'code' => 'CMA20',
                'nom' => 'CMA-CGM',
                'type_conteneur' => '20\' sec',
                'jours_gratuits' => 2,
                'prix_par_jour' => 10000.00,
                'contact_nom' => 'Ahmed Diallo',
                'contact_email' => 'ahmed.diallo@cma-cgm.com',
                'contact_telephone' => '+221 33 123 45 67',
                'adresse' => 'Zone Portuaire, Dakar, Sénégal',
            ],
            [
                'code' => 'CMA40',
                'nom' => 'CMA-CGM',
                'type_conteneur' => '40\' sec',
                'jours_gratuits' => 2,
                'prix_par_jour' => 20000.00,
                'contact_nom' => 'Ahmed Diallo',
                'contact_email' => 'ahmed.diallo@cma-cgm.com',
                'contact_telephone' => '+221 33 123 45 67',
                'adresse' => 'Zone Portuaire, Dakar, Sénégal',
            ],
            [
                'code' => 'CMA20FRGO',
                'nom' => 'CMA-CGM',
                'type_conteneur' => '20\' frigo',
                'jours_gratuits' => 2,
                'prix_par_jour' => 100000.00,
                'contact_nom' => 'Ahmed Diallo',
                'contact_email' => 'ahmed.diallo@cma-cgm.com',
                'contact_telephone' => '+221 33 123 45 67',
                'adresse' => 'Zone Portuaire, Dakar, Sénégal',
            ],
            [
                'code' => 'CMA40FRGO',
                'nom' => 'CMA-CGM',
                'type_conteneur' => '40\' frigo',
                'jours_gratuits' => 2,
                'prix_par_jour' => 200000.00,
                'contact_nom' => 'Ahmed Diallo',
                'contact_email' => 'ahmed.diallo@cma-cgm.com',
                'contact_telephone' => '+221 33 123 45 67',
                'adresse' => 'Zone Portuaire, Dakar, Sénégal',
            ],
            
            // MAERSK Armateur
            [
                'code' => 'MRK20',
                'nom' => 'MAERSK',
                'type_conteneur' => '20\' sec',
                'jours_gratuits' => 5,
                'prix_par_jour' => 11800.00,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MRK40',
                'nom' => 'MAERSK',
                'type_conteneur' => '40\' sec',
                'jours_gratuits' => 5,
                'prix_par_jour' => 23600.00,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MRK20FRGO',
                'nom' => 'MAERSK',
                'type_conteneur' => '20\' frigo',
                'jours_gratuits' => 5,
                'prix_par_jour' => 59000.00,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MRK40FRGP',
                'nom' => 'MAERSK',
                'type_conteneur' => '40\' frigo',
                'jours_gratuits' => 5,
                'prix_par_jour' => 118000.00,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MRK20F/O',
                'nom' => 'MAERSK',
                'type_conteneur' => 'flat/open top 20\'',
                'jours_gratuits' => 5,
                'prix_par_jour' => 236000.00,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ],
            [
                'code' => 'MRK40F/O',
                'nom' => 'MAERSK',
                'type_conteneur' => 'flat/open top 40\'',
                'jours_gratuits' => 5,
                'prix_par_jour' => 47200.00,
                'contact_nom' => 'Fatou Sarr',
                'contact_email' => 'fatou.sarr@maersk.com',
                'contact_telephone' => '+221 33 987 65 43',
                'adresse' => 'Port Autonome, Dakar, Sénégal',
            ]
        ];

        foreach ($armateurs as $armateur) {
            Armateur::create($armateur);
        }
    }
}