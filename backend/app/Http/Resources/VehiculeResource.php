<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiculeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_parc' => $this->numero_parc,
            'immatriculation' => $this->immatriculation,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'libelle_complet' => $this->libelle_complet,
            'actif' => $this->actif ?? true,
            'statut' => $this->statut ?? 'disponible',
            'prochaine_revision' => $this->prochaine_revision?->format('Y-m-d'),
            'derniere_revision' => $this->derniere_revision?->format('Y-m-d'),
            'kilometrage' => $this->kilometrage ?? 0,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}