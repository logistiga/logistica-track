<?php

namespace Database\Seeders;

use App\Models\Detention;
use App\Models\SortieConteneur;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DetentionSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer quelques sorties existantes pour créer des détentions
        $sorties = SortieConteneur::take(5)->get();

        if ($sorties->isEmpty()) {
            $this->command->warn('Aucune sortie de conteneur trouvée. Veuillez d\'abord exécuter SortieConteneurSeeder.');
            return;
        }

        $detentions = [
            [
                'sortie_conteneur_id' => $sorties[0]->id,
                'date_debut_detention' => Carbon::now()->subDays(10),
                'date_fin_detention' => null,
                'jours_detention' => 10,
                'cout_par_jour' => 25000.00,
                'cout_total' => 250000.00,
                'responsabilite' => 'client',
                'motif_detention' => 'Retard dans la collecte du conteneur par le client',
                'statut' => 'active',
                'observations' => 'Client contacté plusieurs fois sans réponse',
            ],
            [
                'sortie_conteneur_id' => $sorties[1]->id,
                'date_debut_detention' => Carbon::now()->subDays(15),
                'date_fin_detention' => Carbon::now()->subDays(2),
                'jours_detention' => 13,
                'cout_par_jour' => 30000.00,
                'cout_total' => 390000.00,
                'responsabilite' => 'transitaire',
                'motif_detention' => 'Problème de documentation douanière',
                'statut' => 'resolue',
                'observations' => 'Documentation corrigée, conteneur libéré',
            ],
            [
                'sortie_conteneur_id' => $sorties[2]->id,
                'date_debut_detention' => Carbon::now()->subDays(8),
                'date_fin_detention' => null,
                'jours_detention' => 8,
                'cout_par_jour' => 22000.00,
                'cout_total' => 176000.00,
                'responsabilite' => 'transporteur',
                'motif_detention' => 'Véhicule en panne lors du transport',
                'statut' => 'contestee',
                'observations' => 'Transporteur conteste la responsabilité',
            ],
            [
                'sortie_conteneur_id' => $sorties[3]->id,
                'date_debut_detention' => Carbon::now()->subDays(5),
                'date_fin_detention' => null,
                'jours_detention' => 5,
                'cout_par_jour' => 28000.00,
                'cout_total' => 140000.00,
                'responsabilite' => 'client',
                'motif_detention' => 'Retard de paiement des frais portuaires',
                'statut' => 'active',
                'observations' => 'En attente de régularisation des paiements',
            ],
        ];

        foreach ($detentions as $detentionData) {
            // Vérifier si une détention existe déjà pour cette sortie
            $existingDetention = Detention::where('sortie_conteneur_id', $detentionData['sortie_conteneur_id'])->first();
            
            if (!$existingDetention) {
                Detention::create($detentionData);
                $this->command->info("Détention créée pour la sortie {$detentionData['sortie_conteneur_id']}");
            }
        }

        $this->command->info('✅ Détentions créées avec succès');
    }
}