<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SortieConteneur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrimeController extends Controller
{
    /**
     * Récupérer toutes les primes (sorties avec prime_chauffeur)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = SortieConteneur::with(['armateur', 'camion', 'remorque', 'createdBy'])
                ->whereNotNull('prime_chauffeur')
                ->where('prime_chauffeur', '>', 0);

            // Filtres
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_conteneur', 'like', "%{$search}%")
                      ->orWhere('chauffeur_nom', 'like', "%{$search}%")
                      ->orWhere('nom_client', 'like', "%{$search}%");
                });
            }

            if ($request->filled('statut')) {
                if ($request->statut === 'en_cours') {
                    $query->whereNull('date_retour');
                } elseif ($request->statut === 'retourne') {
                    $query->whereNotNull('date_retour');
                } elseif ($request->statut === 'paye') {
                    $query->where('statut_prime', 'paye');
                }
            }

            if ($request->filled('date_debut')) {
                $query->where('date_sortie', '>=', $request->date_debut);
            }

            if ($request->filled('date_fin')) {
                $query->where('date_sortie', '<=', $request->date_fin);
            }

            $sorties = $query->orderBy('date_sortie', 'desc')->get();

            // Mapper les données pour le format attendu par le frontend
            $primes = $sorties->map(function ($sortie) {
                return [
                    'id' => $sortie->id,
                    'sortie_id' => $sortie->id,
                    'numero_conteneur' => $sortie->numero_conteneur,
                    'camion' => $sortie->camion?->libelle_complet ?? $sortie->camion_id ?? 'N/A',
                    'chauffeur' => $sortie->chauffeur_nom ?? '',
                    'date_sortie' => $sortie->date_sortie,
                    'date_retour' => $sortie->date_retour,
                    'montant_prime' => (float) $sortie->prime_chauffeur,
                    'montant_prime_formatte' => number_format($sortie->prime_chauffeur, 0, ',', ' ') . ' FCFA',
                    'statut' => $sortie->date_retour ? 'retourne' : 'en_cours',
                    'statut_label' => $sortie->date_retour ? 'Retourné' : 'En cours',
                    'statut_prime' => $sortie->statut_prime ?? 'en_attente',
                    'nom_client' => $sortie->nom_client,
                    'destination' => $sortie->destination,
                    'observations' => $sortie->observations,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $primes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des primes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques des primes
     */
    public function stats(): JsonResponse
    {
        try {
            $sorties = SortieConteneur::whereNotNull('prime_chauffeur')
                ->where('prime_chauffeur', '>', 0)
                ->get();

            $total = $sorties->count();
            $montantTotal = $sorties->sum('prime_chauffeur');
            
            $primesEnCours = $sorties->whereNull('date_retour');
            $primesPaye = $sorties->where('statut_prime', 'paye');
            
            $montantEnCours = $primesEnCours->sum('prime_chauffeur');
            $montantPaye = $primesPaye->sum('prime_chauffeur');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_primes' => $total,
                    'montant_total' => number_format($montantTotal, 0, ',', ' ') . ' FCFA',
                    'montant_en_cours' => number_format($montantEnCours, 0, ',', ' ') . ' FCFA',
                    'montant_paye' => number_format($montantPaye, 0, ',', ' ') . ' FCFA',
                    'nombre_en_cours' => $primesEnCours->count(),
                    'nombre_paye' => $primesPaye->count(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mettre à jour une prime
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $sortie = SortieConteneur::findOrFail($id);

            $validated = $request->validate([
                'prime_chauffeur' => 'sometimes|numeric|min:0',
                'observations' => 'sometimes|string|nullable',
                'statut_prime' => 'sometimes|in:en_attente,paye',
            ]);

            if (isset($validated['prime_chauffeur'])) {
                $sortie->prime_chauffeur = $validated['prime_chauffeur'];
            }

            if (isset($validated['observations'])) {
                $sortie->observations = $validated['observations'];
            }

            if (isset($validated['statut_prime'])) {
                $sortie->statut_prime = $validated['statut_prime'];
            }

            $sortie->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Prime mise à jour avec succès',
                'data' => [
                    'id' => $sortie->id,
                    'prime_chauffeur' => $sortie->prime_chauffeur,
                    'observations' => $sortie->observations,
                    'statut_prime' => $sortie->statut_prime,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour de la prime',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marquer une prime comme payée
     */
    public function marquerCommePaye(int $id): JsonResponse
    {
        try {
            $sortie = SortieConteneur::findOrFail($id);
            $sortie->statut_prime = 'paye';
            $sortie->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Prime marquée comme payée',
                'data' => [
                    'id' => $sortie->id,
                    'statut_prime' => $sortie->statut_prime,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors du marquage de la prime',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
