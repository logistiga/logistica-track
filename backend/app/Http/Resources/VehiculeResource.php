<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiculeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Minimaliste : seulement les champs essentiels
        return [
            'id' => $this->id,
            'numero_parc' => $this->numero_parc,
            'immatriculation' => $this->immatriculation,
            'type' => $this->type,
            'actif' => $this->actif ?? true,
        ];
    }
}