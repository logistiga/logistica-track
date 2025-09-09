<?php

namespace App\Console\Commands;

use App\Models\SortieConteneur;
use App\Models\Detention;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CreateMissingDetentions extends Command
{
    protected $signature = 'detention:create-missing';
    protected $description = 'Créer les détentions manquantes pour les conteneurs retournés';

    public function handle()
    {
        $this->info('🔍 Recherche des conteneurs retournés sans détention...');

        // Récupérer tous les conteneurs retournés sans détention
        $sorties = SortieConteneur::with(['armateur', 'detention'])
            ->where('statut', 'retourne_port')
            ->whereDoesntHave('detention')
            ->whereNotNull('date_retour')
            ->get();

        $this->info("📦 Trouvé {$sorties->count()} conteneurs retournés sans détention");

        $created = 0;
        foreach ($sorties as $sortie) {
            try {
                $this->info("🔧 Traitement du conteneur {$sortie->numero_conteneur}...");
                
                // Calculer les jours de franchise autorisés
                $joursGratuits = $sortie->armateur->jours_gratuits ?? 0;
                
                // Calculer les jours réalisés
                $dateSortie = Carbon::parse($sortie->date_sortie);
                $dateRetour = Carbon::parse($sortie->date_retour);
                $joursRealises = $dateSortie->diffInDays($dateRetour);
                
                // Vérifier s'il y a dépassement
                $joursDepassement = $joursRealises - $joursGratuits;
                
                $this->info("📊 Jours gratuits: {$joursGratuits}, Jours réalisés: {$joursRealises}, Dépassement: {$joursDepassement}");
                
                if ($joursDepassement > 0) {
                    // Créer la détention
                    $detention = new Detention();
                    $detention->sortie_conteneur_id = $sortie->id;
                    $detention->date_debut_detention = $dateSortie->addDays($joursGratuits);
                    $detention->date_fin_detention = null;
                    $detention->jours_detention = $joursDepassement;
                    $detention->cout_par_jour = $sortie->armateur->prix_par_jour ?? config('detention.tarifs_par_jour.default', 15000);
                    $detention->cout_total = $joursDepassement * $detention->cout_par_jour;
                    $detention->responsabilite = null; // Laisser l'utilisateur choisir manuellement
                    $detention->motif_detention = 'Dépassement automatique calculé après retour';
                    $detention->statut = 'active';
                    $detention->save();

                    $this->info("✅ Détention créée pour {$sortie->numero_conteneur} (ID: {$detention->id})");
                    $created++;
                    
                    Log::info("Détention automatique créée via commande", [
                        'sortie_id' => $sortie->id,
                        'detention_id' => $detention->id,
                        'jours_depassement' => $joursDepassement,
                        'cout_total' => $detention->cout_total
                    ]);
                } else {
                    $this->info("ℹ️ Pas de dépassement pour {$sortie->numero_conteneur}");
                }
            } catch (\Exception $e) {
                $this->error("❌ Erreur pour {$sortie->numero_conteneur}: " . $e->getMessage());
                Log::error("Erreur création détention", [
                    'sortie_id' => $sortie->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("🎉 Terminé! {$created} détention(s) créée(s)");
        return 0;
    }
}