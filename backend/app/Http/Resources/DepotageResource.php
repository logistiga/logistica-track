<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepotageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom_client' => $this->nom_client,
            'numero_conteneur' => $this->numero_conteneur,
            'provenance' => $this->provenance,
            'date_depotage' => $this->date_depotage->format('Y-m-d'),
            'camion_proprietaire' => $this->camion_proprietaire,
            'plaque_camion' => $this->plaque_camion,
            'plaque_remorque' => $this->plaque_remorque,
            'type_marchandise' => $this->type_marchandise,
            'prix_depotage' => $this->prix_depotage,
            'prix_depotage_formate' => $this->prix_depotage_formate,
            'statut' => $this->statut,
            'statut_label' => $this->statut_label,
            'observations' => $this->observations,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedBy')),
        ];
    }
}