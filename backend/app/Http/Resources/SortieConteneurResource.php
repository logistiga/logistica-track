<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SortieConteneurResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'numero_conteneur' => $this->numero_conteneur,
            'numero_bl' => $this->numero_bl,
            'code_armateur' => $this->code_armateur,
            'armateur' => new ArmateurResource($this->whenLoaded('armateur')),
            'camion_id' => $this->camion_id,
            'camion' => new VehiculeResource($this->whenLoaded('camion')),
            'remorque_id' => $this->remorque_id,
            'remorque' => new VehiculeResource($this->whenLoaded('remorque')),
            'prime_chauffeur' => $this->prime_chauffeur,
            'nom_client' => $this->nom_client,
            'destination' => $this->destination,
            'adresse_client' => $this->adresse_client,
            'type_destination' => $this->type_destination,
            'jours_bad' => $this->jours_bad,
            'date_fin_franchise' => $this->date_fin_franchise?->format('Y-m-d'),
            'nom_transitaire' => $this->nom_transitaire,
            'date_sortie' => $this->date_sortie->format('Y-m-d'),
            'date_retour' => $this->date_retour?->format('Y-m-d'),
            'statut' => $this->statut,
            'statut_label' => $this->statut_label,
            'camion_retour_id' => $this->camion_retour_id,
            'camion_retour' => new VehiculeResource($this->whenLoaded('camionRetour')),
            'remorque_retour_id' => $this->remorque_retour_id,
            'remorque_retour' => new VehiculeResource($this->whenLoaded('remorqueRetour')),
            'observations' => $this->observations,
            'jours_hors_port' => $this->jours_hors_port,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
        ];
    }
}