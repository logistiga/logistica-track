<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ArmateurResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'nom' => $this->nom,
            'type_conteneur' => $this->type_conteneur,
            'jours_gratuits' => $this->jours_gratuits,
            'prix_par_jour' => $this->prix_par_jour,
            'prix_formatte' => $this->prix_formatte,
            'code_nom' => $this->code_nom,
            'contact_nom' => $this->contact_nom,
            'contact_email' => $this->contact_email,
            'contact_telephone' => $this->contact_telephone,
            'adresse' => $this->adresse,
            'actif' => $this->actif,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'sorties_count' => $this->when($this->sorties, $this->sorties->count()),
        ];
    }
}