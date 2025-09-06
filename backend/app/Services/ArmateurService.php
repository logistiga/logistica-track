<?php

namespace App\Services;

use App\Models\Armateur;

class ArmateurService
{
    /**
     * Récupérer tous les armateurs actifs avec filtres
     */
    public function getAllArmateurs(array $filters = [])
    {
        $query = Armateur::where('actif', true);

        if (isset($filters['type_conteneur'])) {
            $query->where('type_conteneur', $filters['type_conteneur']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('type_conteneur', 'like', "%{$search}%");
            });
        }

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
     * Obtenir les armateurs actifs pour les sélections
     */
    public function getArmateursPourSelection()
    {
        return Armateur::where('actif', true)
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