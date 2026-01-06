<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SortieCreationService
{
    protected VehiculeManagementService $vehiculeService;

    public function __construct(VehiculeManagementService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Créer une nouvelle sortie
     */
    public function createSortie(array $data)
    {
        DB::beginTransaction();

        try {
            Log::info('Données reçues pour création sortie:', $data);

            // Vérifier la disponibilité des véhicules
            if (isset($data['camion_id']) && isset($data['remorque_id'])) {
                Log::info('Vérification des véhicules:', [
                    'camion_id' => $data['camion_id'],
                    'remorque_id' => $data['remorque_id']
                ]);
                $this->vehiculeService->checkVehiculeDisponibilite($data['camion_id'], $data['remorque_id']);
            }

            // Préparer les données pour création
            $sortieData = $this->prepareSortieData($data);

            Log::info('Données préparées pour création:', $sortieData);

            // Créer la sortie
            $sortie = SortieConteneur::create($sortieData);

            Log::info('Sortie créée avec succès:', ['id' => $sortie->id]);

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la sortie:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Mettre à jour une sortie
     */
    public function updateSortie(SortieConteneur $sortie, array $data)
    {
        DB::beginTransaction();

        try {
            Log::info('🔄 Updating sortie:', [
                'sortie_id' => $sortie->id,
                'data_received' => $data,
                'before_update' => [
                    'numero_ordre' => $sortie->numero_ordre,
                    'pv_sortie' => $sortie->pv_sortie,
                    'pv_rentree_port' => $sortie->pv_rentree_port,
                ]
            ]);

            // Gestion des changements de véhicules
            $this->handleVehiculeChanges($sortie, $data);

            // TEST: Utiliser SQL brut pour contourner Eloquent
            if (isset($data['numero_ordre']) || isset($data['pv_sortie']) || isset($data['pv_rentree_port'])) {
                $updateFields = [];
                $bindings = [];
                
                if (isset($data['numero_ordre'])) {
                    $updateFields[] = 'numero_ordre = ?';
                    $bindings[] = $data['numero_ordre'];
                }
                if (isset($data['pv_sortie'])) {
                    $updateFields[] = 'pv_sortie = ?';
                    $bindings[] = $data['pv_sortie'];
                }
                if (isset($data['pv_rentree_port'])) {
                    $updateFields[] = 'pv_rentree_port = ?';
                    $bindings[] = $data['pv_rentree_port'];
                }
                
                $bindings[] = $sortie->id;
                
                $sql = "UPDATE sortie_conteneurs SET " . implode(', ', $updateFields) . ", updated_at = NOW() WHERE id = ?";
                
                Log::info('🔧 Executing RAW SQL:', [
                    'sql' => $sql,
                    'bindings' => $bindings
                ]);
                
                DB::update($sql, $bindings);
                
                // Supprimer ces champs du tableau $data pour ne pas les traiter deux fois
                unset($data['numero_ordre'], $data['pv_sortie'], $data['pv_rentree_port']);
            }

            // Mettre à jour les autres champs avec Eloquent
            if (!empty($data)) {
                $sortie->update($data);
            }
            
            // Recharger depuis la DB pour vérifier
            $sortie->refresh();

            Log::info('✅ Sortie updated successfully:', [
                'sortie_id' => $sortie->id,
                'after_update' => [
                    'numero_ordre' => $sortie->numero_ordre,
                    'pv_sortie' => $sortie->pv_sortie,
                    'pv_rentree_port' => $sortie->pv_rentree_port,
                ]
            ]);

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque']);
        } catch (\Exception $e) {
            Log::error('❌ Error updating sortie:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Supprimer une sortie
     */
    public function deleteSortie(SortieConteneur $sortie)
    {
        DB::beginTransaction();

        try {
            // Libérer les véhicules si la sortie n'est pas terminée
            if ($sortie->statut !== 'retourne_port') {
                $this->vehiculeService->updateVehiculeStatut($sortie->camion_id, 'disponible');
                $this->vehiculeService->updateVehiculeStatut($sortie->remorque_id, 'disponible');
            }

            $sortie->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Préparer les données de sortie pour la création
     */
    private function prepareSortieData(array $data): array
    {
        return [
            'numero_conteneur' => $data['numero_conteneur'],
            'numero_bl' => $data['numero_bl'],
            'code_armateur' => $data['code_armateur'],
            'camion_id' => $data['camion_id'] ?? null,
            'remorque_id' => $data['remorque_id'] ?? null,
            'prime_chauffeur' => $data['prime_chauffeur'] ?? null,
            'nom_client' => $data['nom_client'],
            'destination' => $data['destination'],
            'adresse_client' => $data['adresse_client'] ?? null,
            'type_destination' => $data['type_destination'],
            'jours_bad' => $data['jours_bad'] ?? null,
            'date_fin_franchise' => $data['date_fin_franchise'] ?? null,
            'nom_transitaire' => $data['nom_transitaire'],
            'statut' => $data['destination'] === 'base' ? 'a_la_base' : 'livre_client',
            'date_sortie' => $data['date_sortie'] ?? now()->format('Y-m-d'),
        ];
    }

    /**
     * Gérer les changements de véhicules lors de la mise à jour
     */
    private function handleVehiculeChanges(SortieConteneur $sortie, array $data): void
    {
        if (isset($data['camion_id']) && $data['camion_id'] !== $sortie->camion_id) {
            $this->vehiculeService->checkVehiculeDisponibilite($data['camion_id']);
        }

        if (isset($data['remorque_id']) && $data['remorque_id'] !== $sortie->remorque_id) {
            $this->vehiculeService->checkVehiculeDisponibilite($data['remorque_id']);
        }
    }
}