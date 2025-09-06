<?php

namespace App\Services;

use App\Models\Armateur;
use Illuminate\Support\Facades\DB;

class ArmateurService
{
    /**
     * Récupérer tous les armateurs avec filtres
     */
    public function getAllArmateurs(array $filters = [])
    {
        $query = Armateur::query();

        // Filtres
        if (isset($filters['actif'])) {
            $query->where('actif', $filters['actif']);
        }

        if (isset($filters['type_conteneur'])) {
            $query->parType($filters['type_conteneur']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('type_conteneur', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        $result = $query->orderBy('nom')->paginate($perPage);
        
        return [
            'data' => $result->items(),
            'meta' => [
                'total' => $result->total(),
                'per_page' => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
            ],
            'links' => [
                'first' => $result->url(1),
                'last' => $result->url($result->lastPage()),
                'prev' => $result->previousPageUrl(),
                'next' => $result->nextPageUrl(),
            ]
        ];
    }

    /**
     * Créer un nouvel armateur
     */
    public function createArmateur(array $data)
    {
        return Armateur::create($data);
    }

    /**
     * Mettre à jour un armateur
     */
    public function updateArmateur(Armateur $armateur, array $data)
    {
        $armateur->update($data);
        return $armateur;
    }

    /**
     * Supprimer un armateur
     */
    public function deleteArmateur(Armateur $armateur)
    {
        // Vérifier s'il y a des sorties associées
        if ($armateur->sorties()->exists()) {
            throw new \Exception('Impossible de supprimer cet armateur car il a des sorties associées');
        }

        $armateur->delete();
    }

    /**
     * Obtenir les armateurs actifs pour les sélections
     */
    public function getArmateursPourSelection()
    {
        return Armateur::actifs()
            ->select('id', 'code', 'nom', 'type_conteneur')
            ->orderBy('nom')
            ->get()
            ->map(function ($armateur) {
                return [
                    'value' => $armateur->code,
                    'label' => "{$armateur->code} - {$armateur->nom} ({$armateur->type_conteneur})"
                ];
            });
    }
}