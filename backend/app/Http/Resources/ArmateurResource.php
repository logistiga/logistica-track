<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArmateurResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'nom' => $this->nom,
            'type_conteneur' => $this->type_conteneur,
            'jours_gratuits' => $this->jours_gratuits,
            'prix_par_jour' => $this->prix_par_jour,
            'prix_formatte' => $this->getPrixFormatteAttribute(),
            'contact_nom' => $this->contact_nom,
            'contact_email' => $this->contact_email,
            'contact_telephone' => $this->contact_telephone,
            'adresse' => $this->adresse,
            'actif' => $this->actif,
            'statut_label' => $this->actif ? 'Actif' : 'Inactif',
            'code_nom' => $this->getCodeNomAttribute(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations conditionnelles
            'sorties_count' => $this->when($this->relationLoaded('sorties'), 
                fn() => $this->sorties->count()
            ),
            'sorties' => SortieConteneurResource::collection($this->whenLoaded('sorties')),
        ];
    }
}