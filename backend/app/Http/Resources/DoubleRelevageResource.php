<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoubleRelevageResource extends JsonResource
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
            
            // Camion ameneur
            'camion_ameneur' => [
                'proprietaire' => $this->camion_ameneur_proprietaire,
                'plaque' => $this->camion_ameneur_plaque,
                'plaque_remorque' => $this->camion_ameneur_remorque,
            ],
            
            // Camion récupérateur
            'camion_recuperateur' => [
                'proprietaire' => $this->camion_recuperateur_proprietaire,
                'plaque' => $this->camion_recuperateur_plaque,
                'plaque_remorque' => $this->camion_recuperateur_remorque,
            ],
            
            'montant_operation' => $this->montant_operation,
            'montant_operation_formate' => number_format($this->montant_operation, 0, ',', ' ') . ' FCFA',
            'statut' => $this->statut,
            'statut_label' => $this->statut_label,
            'date_creation' => $this->date_creation->format('Y-m-d'),
            'date_confirmation' => $this->date_confirmation?->format('Y-m-d'),
            'observations' => $this->observations,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedBy')),
        ];
    }
}