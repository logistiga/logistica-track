<?php

namespace App\Services;

use App\Models\Armateur;
use App\Models\Detention;
use Illuminate\Support\Facades\DB;

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
        return $armateur->fresh();
    }

    /**
     * Supprimer un armateur
     */
    public function deleteArmateur(Armateur $armateur)
    {
        return $armateur->delete();
    }

    /**
     * Statistiques de détention pour un armateur
     */
    public function getDetentionStats(Armateur $armateur)
    {
        $baseQuery = function () use ($armateur) {
            return Detention::whereHas('sortieConteneur', function ($query) use ($armateur) {
                $query->where('armateur_code', $armateur->code);
            });
        };

        $totalDetentions = $baseQuery()->count();
        $detentionActive = $baseQuery()->where('statut', 'active')->count();
        $totalMontant = $baseQuery()->sum('montant') ?? 0;
        $moyenneJours = $baseQuery()->avg('jours_realises') ?? 0;
        $derniereDetention = $baseQuery()->latest('created_at')->first()?->created_at;

        return [
            'total_detentions' => $totalDetentions,
            'detention_active' => $detentionActive,
            'total_montant' => round($totalMontant, 2),
            'moyenne_jours' => round($moyenneJours, 1),
            'derniere_detention' => $derniereDetention?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Statistiques générales d'un armateur
     */
    public function getArmateurStats(Armateur $armateur)
    {
        $totalSorties = $armateur->sorties()->count();
        $sortiesActives = $armateur->sorties()->whereNull('date_retour_effectif')->count();
        $sortiesTerminees = $armateur->sorties()->whereNotNull('date_retour_effectif')->count();

        return [
            'total_sorties' => $totalSorties,
            'sorties_actives' => $sortiesActives,
            'sorties_terminees' => $sortiesTerminees,
            'taux_retour' => $totalSorties > 0 ? round(($sortiesTerminees / $totalSorties) * 100, 1) : 0,
        ];
    }
}