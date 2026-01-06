<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiculeResource extends JsonResource
{
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
            // Certains environnements n'ont pas de colonnes timestamps sur vehicules
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => optional($this->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
}