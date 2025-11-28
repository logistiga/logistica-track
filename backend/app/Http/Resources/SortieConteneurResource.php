<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SortieConteneurResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_conteneur' => $this->numero_conteneur,
            'numero_bl' => $this->numero_bl,
            'numero_ordre' => $this->numero_ordre,
            'pv_sortie' => $this->pv_sortie,
            'pv_rentree_port' => $this->pv_rentree_port,
            'code_armateur' => $this->code_armateur,
            'camion_id' => $this->camion_id,
            'remorque_id' => $this->remorque_id,
            'prime_chauffeur' => $this->prime_chauffeur,
            'prime_chauffeur_formattee' => number_format($this->prime_chauffeur, 0, ',', ' ') . ' FCFA',
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
            'statut_label' => $this->getStatutLabelAttribute(),
            'jours_hors_port' => $this->getJoursHorsPortAttribute(),
            'camion_retour_id' => $this->camion_retour_id,
            'remorque_retour_id' => $this->remorque_retour_id,
            'observations' => $this->observations,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'armateur' => new ArmateurResource($this->whenLoaded('armateur')),
            'camion' => new VehiculeResource($this->whenLoaded('camion')),
            'remorque' => new VehiculeResource($this->whenLoaded('remorque')),
            'camion_retour' => new VehiculeResource($this->whenLoaded('camionRetour')),
            'remorque_retour' => new VehiculeResource($this->whenLoaded('remorqueRetour')),
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedBy')),
            
            // Informations calculées
            'detention_info' => $this->when($this->relationLoaded('detention'), 
                fn() => $this->detention ? new DetentionResource($this->detention) : null
            ),
            'facturation_info' => $this->when($this->relationLoaded('facturation'), 
                fn() => $this->facturation ? new FacturationResource($this->facturation) : null
            ),
            'is_detention' => $this->type_destination === 'detention',
            'franchise_expiree' => $this->date_fin_franchise && 
                $this->date_fin_franchise->isPast() && 
                $this->statut !== 'retourne_port',
            'duree_franchise' => $this->date_fin_franchise && $this->date_sortie ?
                $this->date_sortie->diffInDays($this->date_fin_franchise) : null,
        ];
    }
}