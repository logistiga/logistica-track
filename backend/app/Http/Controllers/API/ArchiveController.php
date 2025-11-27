<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use App\Models\Stockage;
use App\Models\DoubleRelevage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        try {
            $archives = Archive::with('archivePar')
                ->where('type_archive', 'base_operation')
                ->orderBy('date_archivage', 'desc')
                ->get()
                ->map(function ($archive) {
                    $data = $archive->donnees_originales;
                    return [
                        'id' => $archive->id,
                        'typeOperation' => $data['type_operation'] ?? '',
                        'numeroConteneur' => $data['numero_conteneur'] ?? '',
                        'nomClient' => $data['nom_client'] ?? '',
                        'provenance' => $data['provenance'] ?? '',
                        'dateArriveeBase' => $data['date_arrivee_base'] ?? '',
                        'dateSortieBase' => $data['date_sortie_base'] ?? '',
                        'camionArrivee' => $data['camion_arrivee'] ?? '',
                        'remorqueArrivee' => $data['remorque_arrivee'] ?? '',
                        'camionSortie' => $data['camion_sortie'] ?? null,
                        'remorqueSortie' => $data['remorque_sortie'] ?? null,
                        'joursGratuits' => $data['jours_gratuits'] ?? 0,
                        'joursPayants' => $data['jours_payants'] ?? 0,
                        'montantTotalFacture' => $data['montant_total_facture'] ?? 0,
                        'dateFacturation' => $data['date_facturation'] ?? '',
                        'numeroFacture' => $data['numero_facture'] ?? '',
                        'statutPaiement' => 'paye',
                        'dateArchivage' => $archive->date_archivage->format('Y-m-d'),
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $archives,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des archives',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = Archive::with('archivePar')
                ->where('type_archive', 'base_operation');

            // Filtrer par dates
            if ($request->has('dateDebut')) {
                $query->where('date_archivage', '>=', $request->dateDebut);
            }

            if ($request->has('dateFin')) {
                $query->where('date_archivage', '<=', $request->dateFin);
            }

            // Filtrer par type d'opération
            if ($request->has('typeOperation') && $request->typeOperation !== '') {
                $query->whereJsonContains('donnees_originales->type_operation', $request->typeOperation);
            }

            // Filtrer par client
            if ($request->has('client') && $request->client !== '') {
                $query->whereRaw("JSON_EXTRACT(donnees_originales, '$.nom_client') LIKE ?", ['%' . $request->client . '%']);
            }

            // Filtrer par numéro de conteneur
            if ($request->has('numeroConteneur') && $request->numeroConteneur !== '') {
                $query->whereRaw("JSON_EXTRACT(donnees_originales, '$.numero_conteneur') LIKE ?", ['%' . $request->numeroConteneur . '%']);
            }

            $archives = $query->orderBy('date_archivage', 'desc')
                ->get()
                ->map(function ($archive) {
                    $data = $archive->donnees_originales;
                    return [
                        'id' => $archive->id,
                        'typeOperation' => $data['type_operation'] ?? '',
                        'numeroConteneur' => $data['numero_conteneur'] ?? '',
                        'nomClient' => $data['nom_client'] ?? '',
                        'provenance' => $data['provenance'] ?? '',
                        'dateArriveeBase' => $data['date_arrivee_base'] ?? '',
                        'dateSortieBase' => $data['date_sortie_base'] ?? '',
                        'camionArrivee' => $data['camion_arrivee'] ?? '',
                        'remorqueArrivee' => $data['remorque_arrivee'] ?? '',
                        'camionSortie' => $data['camion_sortie'] ?? null,
                        'remorqueSortie' => $data['remorque_sortie'] ?? null,
                        'joursGratuits' => $data['jours_gratuits'] ?? 0,
                        'joursPayants' => $data['jours_payants'] ?? 0,
                        'montantTotalFacture' => $data['montant_total_facture'] ?? 0,
                        'dateFacturation' => $data['date_facturation'] ?? '',
                        'numeroFacture' => $data['numero_facture'] ?? '',
                        'statutPaiement' => 'paye',
                        'dateArchivage' => $archive->date_archivage->format('Y-m-d'),
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $archives,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $archive = Archive::with('archivePar')->findOrFail($id);
            $data = $archive->donnees_originales;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'id' => $archive->id,
                    'typeOperation' => $data['type_operation'] ?? '',
                    'numeroConteneur' => $data['numero_conteneur'] ?? '',
                    'nomClient' => $data['nom_client'] ?? '',
                    'provenance' => $data['provenance'] ?? '',
                    'dateArriveeBase' => $data['date_arrivee_base'] ?? '',
                    'dateSortieBase' => $data['date_sortie_base'] ?? '',
                    'camionArrivee' => $data['camion_arrivee'] ?? '',
                    'remorqueArrivee' => $data['remorque_arrivee'] ?? '',
                    'camionSortie' => $data['camion_sortie'] ?? null,
                    'remorqueSortie' => $data['remorque_sortie'] ?? null,
                    'joursGratuits' => $data['jours_gratuits'] ?? 0,
                    'joursPayants' => $data['jours_payants'] ?? 0,
                    'montantTotalFacture' => $data['montant_total_facture'] ?? 0,
                    'dateFacturation' => $data['date_facturation'] ?? '',
                    'numeroFacture' => $data['numero_facture'] ?? '',
                    'statutPaiement' => 'paye',
                    'dateArchivage' => $archive->date_archivage->format('Y-m-d'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Archive non trouvée',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $archive = Archive::create([
                'type_archive' => 'base_operation',
                'reference_originale' => $request->reference_originale,
                'donnees_originales' => $request->donnees_originales,
                'date_archivage' => now(),
                'motif_archivage' => $request->motif_archivage ?? 'Archivage manuel',
                'archive_par' => auth()->id(),
                'commentaires' => $request->commentaires,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Archive créée avec succès',
                'data' => $archive,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création de l\'archive',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function restore($id)
    {
        try {
            $archive = Archive::findOrFail($id);
            $data = $archive->donnees_originales;

            // Restaurer selon le type d'opération
            if ($data['type_operation'] === 'stockage') {
                $stockage = Stockage::create($data['original_data'] ?? []);
            } elseif ($data['type_operation'] === 'double-relevage') {
                $doubleRelevage = DoubleRelevage::create($data['original_data'] ?? []);
            }

            // Supprimer l'archive après restauration
            $archive->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Archive restaurée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la restauration',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $archive = Archive::findOrFail($id);
            $archive->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Archive supprimée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function export(Request $request)
    {
        try {
            $format = $request->input('format', 'excel');
            
            // TODO: Implémenter l'export selon le format demandé
            // Pour l'instant, retourner les données JSON
            
            $archives = $this->search($request)->getData()->data;

            return response()->json([
                'status' => 'success',
                'message' => 'Export en cours de développement',
                'data' => $archives,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'export',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
