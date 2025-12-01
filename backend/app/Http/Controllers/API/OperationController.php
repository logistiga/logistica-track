<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\Operation;
use App\Http\Requests\StoreOperationRequest;
use App\Http\Requests\UpdateOperationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OperationController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of operations
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Operation::query()->orderBy('created_at', 'desc');

            // Filtres
            if ($request->filled('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->filled('type_operation')) {
                $query->where('type_operation', $request->type_operation);
            }

            if ($request->filled('date_debut')) {
                $query->whereDate('date_debut', '>=', $request->date_debut);
            }

            if ($request->filled('date_fin')) {
                $query->whereDate('date_debut', '<=', $request->date_fin);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_operation', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhereJsonContains('vehicules_assignes', $search);
                });
            }

            $operations = $query->get()->map(function ($operation) {
                return [
                    'id' => (string) $operation->id,
                    'typeOperation' => $operation->type_operation,
                    'dateDebut' => $operation->date_debut ? $operation->date_debut->format('Y-m-d') : null,
                    'dateFin' => $operation->date_fin ? $operation->date_fin->format('Y-m-d') : null,
                    'duree' => $operation->duree,
                    'camion' => $operation->vehicules_assignes['camion'] ?? '',
                    'remorque' => $operation->vehicules_assignes['remorque'] ?? '',
                    'client' => $operation->vehicules_assignes['client'] ?? '',
                    'tarifJournalier' => $operation->tarif_journalier,
                    'montant' => (int) ($operation->cout_estime ?? $operation->cout_reel ?? 0),
                    'lieuDepart' => $operation->lieu_depart,
                    'destination' => $operation->destination,
                    'instructions' => $operation->notes ?? $operation->description,
                    'statut' => $operation->statut,
                    'dateCreation' => $operation->created_at->format('Y-m-d H:i:s')
                ];
            });

            return $this->successResponse($operations);
        } catch (\Exception $e) {
            \Log::error('Erreur index operations: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la récupération des opérations', 500);
        }
    }

    /**
     * Store a newly created operation
     */
    public function store(StoreOperationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Générer un numéro d'opération unique
            $numeroOperation = 'OP-' . strtoupper(substr($validated['type_operation'], 0, 3)) . '-' . date('YmdHis');

            // Calculer la durée si c'est une location
            $duree = null;
            if ($validated['type_operation'] === 'location' && isset($validated['date_fin'])) {
                $debut = Carbon::parse($validated['date_debut']);
                $fin = Carbon::parse($validated['date_fin']);
                $duree = $debut->diffInDays($fin);
            }

            // Calculer le montant pour les locations
            $montant = $validated['montant'] ?? null;
            if ($validated['type_operation'] === 'location' && $duree && isset($validated['tarif_journalier'])) {
                $montant = $duree * $validated['tarif_journalier'];
            }

            $operation = Operation::create([
                'numero_operation' => $numeroOperation,
                'type_operation' => $validated['type_operation'],
                'description' => $validated['instructions'] ?? '',
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'] ?? null,
                'duree' => $duree,
                'tarif_journalier' => $validated['tarif_journalier'] ?? null,
                'cout_estime' => $montant,
                'lieu_depart' => $validated['lieu_depart'] ?? null,
                'destination' => $validated['destination'] ?? null,
                'vehicules_assignes' => [
                    'camion' => $validated['camion'],
                    'remorque' => $validated['remorque'],
                    'client' => $validated['client']
                ],
                'notes' => $validated['instructions'] ?? '',
                'statut' => 'en-attente',
                'priorite' => 'normale'
            ]);

            return $this->successResponse([
                'id' => (string) $operation->id,
                'typeOperation' => $operation->type_operation,
                'dateDebut' => $operation->date_debut->format('Y-m-d'),
                'dateFin' => $operation->date_fin ? $operation->date_fin->format('Y-m-d') : null,
                'duree' => $operation->duree,
                'camion' => $validated['camion'],
                'remorque' => $validated['remorque'],
                'client' => $validated['client'],
                'tarifJournalier' => $operation->tarif_journalier,
                'montant' => (int) $operation->cout_estime,
                'lieuDepart' => $operation->lieu_depart,
                'destination' => $operation->destination,
                'instructions' => $operation->notes,
                'statut' => $operation->statut,
                'dateCreation' => $operation->created_at->format('Y-m-d H:i:s')
            ], 'Opération créée avec succès', 201);
        } catch (\Exception $e) {
            \Log::error('Erreur store operation: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la création de l\'opération: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified operation
     */
    public function show(int $operation): JsonResponse
    {
        try {
            $operationData = Operation::find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            return $this->successResponse([
                'id' => (string) $operationData->id,
                'typeOperation' => $operationData->type_operation,
                'dateDebut' => $operationData->date_debut->format('Y-m-d'),
                'dateFin' => $operationData->date_fin ? $operationData->date_fin->format('Y-m-d') : null,
                'duree' => $operationData->duree,
                'camion' => $operationData->vehicules_assignes['camion'] ?? '',
                'remorque' => $operationData->vehicules_assignes['remorque'] ?? '',
                'client' => $operationData->vehicules_assignes['client'] ?? '',
                'tarifJournalier' => $operationData->tarif_journalier,
                'montant' => (int) ($operationData->cout_estime ?? $operationData->cout_reel ?? 0),
                'lieuDepart' => $operationData->lieu_depart,
                'destination' => $operationData->destination,
                'instructions' => $operationData->notes,
                'statut' => $operationData->statut,
                'dateCreation' => $operationData->created_at->format('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur show operation: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la récupération de l\'opération', 500);
        }
    }

    /**
     * Update the specified operation
     */
    public function update(UpdateOperationRequest $request, int $operation): JsonResponse
    {
        try {
            $operationData = Operation::find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            $validated = $request->validated();

            // Mettre à jour les champs simples
            if (isset($validated['date_debut'])) $operationData->date_debut = $validated['date_debut'];
            if (isset($validated['date_fin'])) $operationData->date_fin = $validated['date_fin'];
            if (isset($validated['tarif_journalier'])) $operationData->tarif_journalier = $validated['tarif_journalier'];
            if (isset($validated['lieu_depart'])) $operationData->lieu_depart = $validated['lieu_depart'];
            if (isset($validated['destination'])) $operationData->destination = $validated['destination'];
            if (isset($validated['instructions'])) $operationData->notes = $validated['instructions'];
            if (isset($validated['statut'])) $operationData->statut = $validated['statut'];

            // Mettre à jour vehicules_assignes si nécessaire
            if (isset($validated['camion']) || isset($validated['remorque']) || isset($validated['client'])) {
                $vehicules = $operationData->vehicules_assignes ?? [];
                if (isset($validated['camion'])) $vehicules['camion'] = $validated['camion'];
                if (isset($validated['remorque'])) $vehicules['remorque'] = $validated['remorque'];
                if (isset($validated['client'])) $vehicules['client'] = $validated['client'];
                $operationData->vehicules_assignes = $vehicules;
            }

            // Recalculer durée et montant pour les locations
            $operationData->save();

            return $this->successResponse([
                'id' => (string) $operationData->id,
                'typeOperation' => $operationData->type_operation,
                'dateDebut' => $operationData->date_debut->format('Y-m-d'),
                'dateFin' => $operationData->date_fin ? $operationData->date_fin->format('Y-m-d') : null,
                'duree' => $operationData->duree,
                'camion' => $operationData->vehicules_assignes['camion'] ?? '',
                'remorque' => $operationData->vehicules_assignes['remorque'] ?? '',
                'client' => $operationData->vehicules_assignes['client'] ?? '',
                'tarifJournalier' => $operationData->tarif_journalier,
                'montant' => (int) ($operationData->cout_estime ?? $operationData->cout_reel ?? 0),
                'lieuDepart' => $operationData->lieu_depart,
                'destination' => $operationData->destination,
                'instructions' => $operationData->notes,
                'statut' => $operationData->statut,
                'dateCreation' => $operationData->created_at->format('Y-m-d H:i:s')
            ], 'Opération mise à jour avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur update operation: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la mise à jour de l\'opération', 500);
        }
    }

    /**
     * Update operation status
     */
    public function updateStatut(Request $request, int $operation): JsonResponse
    {
        try {
            $operationData = Operation::find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            $validated = $request->validate([
                'statut' => 'required|in:planifiee,en-attente,en-cours,terminee,confirmee,annulee'
            ]);

            $operationData->statut = $validated['statut'];
            $operationData->save();

            return $this->successResponse([
                'id' => (string) $operationData->id,
                'typeOperation' => $operationData->type_operation,
                'dateDebut' => $operationData->date_debut->format('Y-m-d'),
                'dateFin' => $operationData->date_fin ? $operationData->date_fin->format('Y-m-d') : null,
                'duree' => $operationData->duree,
                'camion' => $operationData->vehicules_assignes['camion'] ?? '',
                'remorque' => $operationData->vehicules_assignes['remorque'] ?? '',
                'client' => $operationData->vehicules_assignes['client'] ?? '',
                'tarifJournalier' => $operationData->tarif_journalier,
                'montant' => (int) ($operationData->cout_estime ?? $operationData->cout_reel ?? 0),
                'lieuDepart' => $operationData->lieu_depart,
                'destination' => $operationData->destination,
                'instructions' => $operationData->notes,
                'statut' => $operationData->statut,
                'dateCreation' => $operationData->created_at->format('Y-m-d H:i:s')
            ], 'Statut mis à jour avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur updateStatut operation: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la mise à jour du statut', 500);
        }
    }

    /**
     * Remove the specified operation
     */
    public function destroy(int $operation): JsonResponse
    {
        try {
            $operationData = Operation::find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            $operationData->delete();

            return $this->successResponse(null, 'Opération supprimée avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur destroy operation: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la suppression de l\'opération', 500);
        }
    }

    /**
     * Get planned operations
     */
    public function planifiees(): JsonResponse
    {
        try {
            $operations = DB::table('operations')
                ->where('statut', 'planifiee')
                ->orderBy('date_prevue', 'asc')
                ->get();

            return $this->successResponse($operations);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des opérations planifiées', 500);
        }
    }

    /**
     * Get ongoing operations
     */
    public function enCours(): JsonResponse
    {
        try {
            $operations = DB::table('operations')
                ->where('statut', 'en_cours')
                ->orderBy('date_debut', 'desc')
                ->get();

            return $this->successResponse($operations);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des opérations en cours', 500);
        }
    }

    /**
     * Get completed operations
     */
    public function terminees(): JsonResponse
    {
        try {
            $operations = DB::table('operations')
                ->where('statut', 'terminee')
                ->orderBy('date_fin', 'desc')
                ->limit(50)
                ->get();

            return $this->successResponse($operations);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des opérations terminées', 500);
        }
    }

    /**
     * Get calendar view of operations
     */
    public function calendar(Request $request): JsonResponse
    {
        try {
            $startDate = $request->input('start', now()->startOfMonth()->toDateString());
            $endDate = $request->input('end', now()->endOfMonth()->toDateString());

            $operations = DB::table('operations')
                ->whereBetween('date_prevue', [$startDate, $endDate])
                ->get()
                ->map(function ($operation) {
                    return [
                        'id' => $operation->id,
                        'title' => $operation->numero_operation,
                        'start' => $operation->date_prevue,
                        'description' => $operation->description,
                        'status' => $operation->statut,
                        'priority' => $operation->priorite,
                    ];
                });

            return $this->successResponse($operations);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du calendrier', 500);
        }
    }

    /**
     * Search operations
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->input('q', '');
            
            if (empty($query)) {
                return $this->successResponse([]);
            }

            $operations = DB::table('operations')
                ->where(function ($q) use ($query) {
                    $q->where('numero_operation', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%")
                      ->orWhere('lieu', 'like', "%{$query}%")
                      ->orWhere('responsable', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get();

            return $this->successResponse($operations);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Export operations
     */
    public function export(Request $request): JsonResponse
    {
        try {
            // This would typically generate an Excel/CSV file
            // For now, return the data that would be exported
            
            $operations = DB::table('operations')
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->successResponse([
                'export_url' => '/api/operations/download/' . time(),
                'total_records' => $operations->count(),
                'generated_at' => now()->toISOString()
            ], 'Export généré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export', 500);
        }
    }

    /**
     * Start an operation
     */
    public function start(int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            if ($operationData->statut !== 'planifiee') {
                return $this->errorResponse('Seules les opérations planifiées peuvent être démarrées', 400);
            }

            DB::table('operations')->where('id', $operation)->update([
                'statut' => 'en_cours',
                'date_debut' => now(),
                'updated_at' => now()
            ]);

            $updatedOperation = DB::table('operations')->find($operation);

            return $this->successResponse($updatedOperation, 'Opération démarrée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du démarrage de l\'opération', 500);
        }
    }

    /**
     * Complete an operation
     */
    public function complete(Request $request, int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            if ($operationData->statut !== 'en_cours') {
                return $this->errorResponse('Seules les opérations en cours peuvent être terminées', 400);
            }

            $validated = $request->validate([
                'observations_fin' => 'nullable|string',
                'duree_reelle' => 'nullable|integer',
            ]);

            DB::table('operations')->where('id', $operation)->update([
                'statut' => 'terminee',
                'date_fin' => now(),
                'observations' => $validated['observations_fin'] ?? $operationData->observations,
                'duree_reelle' => $validated['duree_reelle'] ?? null,
                'updated_at' => now()
            ]);

            $updatedOperation = DB::table('operations')->find($operation);

            return $this->successResponse($updatedOperation, 'Opération terminée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la finalisation de l\'opération', 500);
        }
    }

    /**
     * Cancel an operation
     */
    public function cancel(Request $request, int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            if (in_array($operationData->statut, ['terminee', 'annulee'])) {
                return $this->errorResponse('Cette opération ne peut pas être annulée', 400);
            }

            $validated = $request->validate([
                'motif_annulation' => 'required|string',
            ]);

            DB::table('operations')->where('id', $operation)->update([
                'statut' => 'annulee',
                'date_annulation' => now(),
                'motif_annulation' => $validated['motif_annulation'],
                'updated_at' => now()
            ]);

            $updatedOperation = DB::table('operations')->find($operation);

            return $this->successResponse($updatedOperation, 'Opération annulée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'annulation de l\'opération', 500);
        }
    }

    /**
     * Get operation documents
     */
    public function documents(int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            // This would typically fetch related documents from a documents table
            $documents = [
                [
                    'id' => 1,
                    'nom' => 'Bon de commande.pdf',
                    'type' => 'pdf',
                    'taille' => '245 KB',
                    'date_creation' => now()->subDays(2)->toISOString(),
                    'url' => '/documents/operations/' . $operation . '/bon-commande.pdf'
                ],
                [
                    'id' => 2,
                    'nom' => 'Rapport intervention.docx',
                    'type' => 'docx',
                    'taille' => '1.2 MB',
                    'date_creation' => now()->subDay()->toISOString(),
                    'url' => '/documents/operations/' . $operation . '/rapport.docx'
                ]
            ];

            return $this->successResponse($documents);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des documents', 500);
        }
    }

    /**
     * Get archived operations
     */
    public function archives(Request $request): JsonResponse
    {
        try {
            // Fetch archived operations (completed with invoicing)
            $archives = DB::table('operations as o')
                ->leftJoin('users as u', 'o.responsable_id', '=', 'u.id')
                ->where('o.statut', 'terminee')
                ->whereNotNull('o.date_fin')
                ->select(
                    'o.id',
                    'o.numero_operation as numeroOperation',
                    'o.type_operation as typeOperation',
                    'o.date_debut as dateExecution',
                    DB::raw("'' as camion"),
                    DB::raw("'' as remorque"),
                    DB::raw("COALESCE(u.name, 'N/A') as client"),
                    'o.description as instructions',
                    DB::raw("COALESCE(o.cout_reel, o.cout_estime, 0) as montantTotal"),
                    DB::raw("DATE(o.date_fin) as dateFacturation"),
                    DB::raw("CONCAT('FACT-', o.id) as numeroFacture"),
                    DB::raw("'paye' as statutPaiement"),
                    'o.date_fin as dateArchivage'
                )
                ->orderBy('o.date_fin', 'desc')
                ->get();

            return $this->successResponse($archives, 'Archives récupérées avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur archives opérations: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return $this->errorResponse('Erreur lors de la récupération des archives', 500);
        }
    }

    /**
     * Search in archived operations
     */
    public function archivesSearch(Request $request): JsonResponse
    {
        try {
            $query = DB::table('operations as o')
                ->leftJoin('users as u', 'o.responsable_id', '=', 'u.id')
                ->where('o.statut', 'terminee')
                ->whereNotNull('o.date_fin');

            // Apply filters
            if ($request->filled('date_debut') && $request->filled('date_fin')) {
                $query->whereBetween('o.date_fin', [
                    $request->date_debut,
                    $request->date_fin
                ]);
            }

            if ($request->filled('type_operation')) {
                $query->where('o.type_operation', $request->type_operation);
            }

            if ($request->filled('client')) {
                $query->where('u.name', 'like', '%' . $request->client . '%');
            }

            if ($request->filled('numero_operation')) {
                $query->where('o.numero_operation', 'like', '%' . $request->numero_operation . '%');
            }

            $archives = $query->select(
                    'o.id',
                    'o.numero_operation as numeroOperation',
                    'o.type_operation as typeOperation',
                    'o.date_debut as dateExecution',
                    DB::raw("'' as camion"),
                    DB::raw("'' as remorque"),
                    DB::raw("COALESCE(u.name, 'N/A') as client"),
                    'o.description as instructions',
                    DB::raw("COALESCE(o.cout_reel, o.cout_estime, 0) as montantTotal"),
                    DB::raw("DATE(o.date_fin) as dateFacturation"),
                    DB::raw("CONCAT('FACT-', o.id) as numeroFacture"),
                    DB::raw("'paye' as statutPaiement"),
                    'o.date_fin as dateArchivage'
                )
                ->orderBy('o.date_fin', 'desc')
                ->get();

            return $this->successResponse($archives, 'Recherche effectuée avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur recherche archives opérations: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Get statistics for archived operations
     */
    public function archivesStats(Request $request): JsonResponse
    {
        try {
            $stats = [
                'total_archives' => DB::table('operations')
                    ->where('statut', 'terminee')
                    ->whereNotNull('date_fin')
                    ->count(),
                'par_type' => DB::table('operations')
                    ->where('statut', 'terminee')
                    ->whereNotNull('date_fin')
                    ->select('type_operation', DB::raw('COUNT(*) as count'))
                    ->groupBy('type_operation')
                    ->get()
            ];

            return $this->successResponse($stats);
        } catch (\Exception $e) {
            \Log::error('Erreur statistiques archives opérations: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }
}
    }
}