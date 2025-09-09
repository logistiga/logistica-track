<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SortieConteneur;
use App\Models\Detention;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DetentionFixController extends Controller
{
    /**
     * Créer les détentions manquantes pour les conteneurs retournés
     */
    public function createMissingDetentions(): JsonResponse
    {
        try {
            Log::info('🔍 API: Recherche des conteneurs retournés sans détention...');

            // Récupérer tous les conteneurs retournés sans détention
            $sorties = SortieConteneur::with(['armateur', 'detention'])
                ->where('statut', 'retourne_port')
                ->whereDoesntHave('detention')
                ->whereNotNull('date_retour')
                ->get();

            Log::info("📦 API: Trouvé {$sorties->count()} conteneurs retournés sans détention");

            $created = [];
            $skipped = [];

            foreach ($sorties as $sortie) {
                try {
                    Log::info("🔧 API: Traitement du conteneur {$sortie->numero_conteneur}...");
                    
                    // Calculer les jours de franchise autorisés
                    $joursGratuits = $sortie->armateur->jours_gratuits ?? 0;
                    
                    // Calculer les jours réalisés
                    $dateSortie = Carbon::parse($sortie->date_sortie);
                    $dateRetour = Carbon::parse($sortie->date_retour);
                    $joursRealises = $dateSortie->diffInDays($dateRetour);
                    
                    // Vérifier s'il y a dépassement
                    $joursDepassement = $joursRealises - $joursGratuits;
                    
                    Log::info("📊 API: Conteneur {$sortie->numero_conteneur} - Jours gratuits: {$joursGratuits}, Jours réalisés: {$joursRealises}, Dépassement: {$joursDepassement}");
                    
                    if ($joursDepassement > 0) {
                        // Créer la détention
                        $detention = new Detention();
                        $detention->sortie_conteneur_id = $sortie->id;
                        $detention->date_debut_detention = $dateSortie->copy()->addDays($joursGratuits);
                        $detention->date_fin_detention = null;
                        $detention->jours_detention = $joursDepassement;
                        $detention->cout_par_jour = $sortie->armateur->prix_par_jour ?? config('detention.tarifs_par_jour.default', 15000);
                        $detention->cout_total = $joursDepassement * $detention->cout_par_jour;
                        $detention->responsabilite = null; // Laisser l'utilisateur choisir manuellement
                        $detention->motif_detention = 'Dépassement automatique calculé après retour (API Fix)';
                        $detention->statut = 'active';
                        $detention->save();

                        $created[] = [
                            'sortie_id' => $sortie->id,
                            'numero_conteneur' => $sortie->numero_conteneur,
                            'detention_id' => $detention->id,
                            'jours_depassement' => $joursDepassement,
                            'cout_total' => $detention->cout_total
                        ];
                        
                        Log::info("✅ API: Détention créée pour {$sortie->numero_conteneur} (ID: {$detention->id})");
                    } else {
                        $skipped[] = [
                            'sortie_id' => $sortie->id,
                            'numero_conteneur' => $sortie->numero_conteneur,
                            'raison' => 'Pas de dépassement de franchise'
                        ];
                        Log::info("ℹ️ API: Pas de dépassement pour {$sortie->numero_conteneur}");
                    }
                } catch (\Exception $e) {
                    Log::error("❌ API: Erreur pour {$sortie->numero_conteneur}: " . $e->getMessage());
                    $skipped[] = [
                        'sortie_id' => $sortie->id,
                        'numero_conteneur' => $sortie->numero_conteneur,
                        'raison' => 'Erreur: ' . $e->getMessage()
                    ];
                }
            }

            Log::info("🎉 API: Terminé! " . count($created) . " détention(s) créée(s)");

            return response()->json([
                'success' => true,
                'message' => count($created) . ' détention(s) créée(s) avec succès',
                'data' => [
                    'created' => $created,
                    'skipped' => $skipped,
                    'total_processed' => $sorties->count(),
                    'total_created' => count($created),
                    'total_skipped' => count($skipped)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('❌ API: Erreur générale lors de la création des détentions manquantes: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création des détentions: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}