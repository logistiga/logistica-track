<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Validation\ValidationException;

class SortieSearchService
{
    protected SortieConteneurService $sortieService;

    public function __construct(SortieConteneurService $sortieService)
    {
        $this->sortieService = $sortieService;
    }

    /**
     * Recherche avancée avec validation
     */
    public function search(string $query, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        if (strlen($query) < 2) {
            throw ValidationException::withMessages([
                'query' => 'La requête doit contenir au moins 2 caractères'
            ]);
        }

        return $this->sortieService->searchSorties($query, $filters);
    }
}