<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockageResource extends JsonResource
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
            'date_arrivee' => $this->date_arrivee->format('Y-m-d'),
            'camion_proprietaire' => $this->camion_proprietaire,
            'plaque_camion' => $this->plaque_camion,
            'plaque_remorque' => $this->plaque_remorque,
            'jours_gratuits' => $this->jours_gratuits,
            'prix_par_jour' => $this->prix_par_jour,
            'prix_par_jour_formate' => number_format($this->prix_par_jour, 0, ',', ' ') . ' FCFA',
            'statut' => $this->statut,
            'statut_label' => $this->statut_label,
            'date_sortie' => $this->date_sortie?->format('Y-m-d'),
            'observations' => $this->observations,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Informations calculées
            'jours_stockage' => $this->jours_stockage,
            'jours_detention' => $this->jours_detention,
            'montant_detention' => $this->montant_detention,
            'montant_detention_formate' => number_format($this->montant_detention, 0, ',', ' ') . ' FCFA',
            
            // Relations
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedBy')),
        ];
    }
}