<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
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
            $query = DB::table('operations')
                ->select('*')
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->filled('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->filled('type')) {
                $query->where('type_operation', $request->type);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_operation', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $perPage = $request->input('per_page', 15);
            $operations = $query->paginate($perPage);

            return $this->successResponse([
                'operations' => $operations->items(),
                'pagination' => [
                    'current_page' => $operations->currentPage(),
                    'last_page' => $operations->lastPage(),
                    'per_page' => $operations->perPage(),
                    'total' => $operations->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des opérations', 500);
        }
    }

    /**
     * Store a newly created operation
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'numero_operation' => 'required|string|unique:operations',
                'type_operation' => 'required|in:chargement,dechargement,transfert,maintenance',
                'description' => 'required|string',
                'vehicule_id' => 'nullable|exists:vehicules,id',
                'sortie_conteneur_id' => 'nullable|exists:sortie_conteneurs,id',
                'date_prevue' => 'required|date',
                'duree_estimee' => 'nullable|integer',
                'priorite' => 'required|in:basse,normale,haute,urgente',
                'lieu' => 'required|string',
                'responsable' => 'required|string',
                'observations' => 'nullable|string',
            ]);

            $validated['statut'] = 'planifiee';
            $validated['created_at'] = now();
            $validated['updated_at'] = now();

            $operationId = DB::table('operations')->insertGetId($validated);
            $operation = DB::table('operations')->find($operationId);

            return $this->successResponse($operation, 'Opération créée avec succès', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'opération', 500);
        }
    }

    /**
     * Display the specified operation
     */
    public function show(int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            return $this->successResponse($operationData);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'opération', 500);
        }
    }

    /**
     * Update the specified operation
     */
    public function update(Request $request, int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            $validated = $request->validate([
                'type_operation' => 'sometimes|in:chargement,dechargement,transfert,maintenance',
                'description' => 'sometimes|string',
                'vehicule_id' => 'nullable|exists:vehicules,id',
                'sortie_conteneur_id' => 'nullable|exists:sortie_conteneurs,id',
                'date_prevue' => 'sometimes|date',
                'duree_estimee' => 'nullable|integer',
                'priorite' => 'sometimes|in:basse,normale,haute,urgente',
                'lieu' => 'sometimes|string',
                'responsable' => 'sometimes|string',
                'observations' => 'nullable|string',
            ]);

            $validated['updated_at'] = now();

            DB::table('operations')->where('id', $operation)->update($validated);
            $updatedOperation = DB::table('operations')->find($operation);

            return $this->successResponse($updatedOperation, 'Opération mise à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'opération', 500);
        }
    }

    /**
     * Remove the specified operation
     */
    public function destroy(int $operation): JsonResponse
    {
        try {
            $operationData = DB::table('operations')->find($operation);

            if (!$operationData) {
                return $this->errorResponse('Opération non trouvée', 404);
            }

            DB::table('operations')->where('id', $operation)->delete();

            return $this->successResponse(null, 'Opération supprimée avec succès');
        } catch (\Exception $e) {
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
}