<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VehiculeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'numero_parc' => $this->numero_parc,
            'immatriculation' => $this->immatriculation,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'statut' => $this->statut,
            'statut_label' => $this->statut_label,
            'libelle_complet' => $this->libelle_complet,
            'marque' => $this->marque,
            'modele' => $this->modele,
            'annee' => $this->annee,
            'capacite' => $this->capacite,
            'derniere_revision' => $this->derniere_revision?->format('Y-m-d'),
            'prochaine_revision' => $this->prochaine_revision?->format('Y-m-d'),
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}