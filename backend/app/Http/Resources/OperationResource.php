<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_operation' => $this->numero_operation,
            'type_operation' => $this->type_operation,
            'description' => $this->description,
            'priorite' => $this->priorite,
            'priorite_label' => $this->getPrioriteLabel(),
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'date_prevue' => $this->date_prevue->format('Y-m-d H:i:s'),
            'date_debut' => $this->date_debut?->format('Y-m-d H:i:s'),
            'date_fin' => $this->date_fin?->format('Y-m-d H:i:s'),
            'responsable_id' => $this->responsable_id,
            'sortie_conteneur_id' => $this->sortie_conteneur_id,
            'vehicules_assignes' => $this->vehicules_assignes,
            'cout_estime' => $this->cout_estime,
            'cout_reel' => $this->cout_reel,
            'cout_estime_formatte' => $this->cout_estime ? 
                number_format($this->cout_estime, 0, ',', ' ') . ' FCFA' : null,
            'cout_reel_formatte' => $this->cout_reel ? 
                number_format($this->cout_reel, 0, ',', ' ') . ' FCFA' : null,
            'notes' => $this->notes,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'responsable' => new UserResource($this->whenLoaded('responsable')),
            'sortie_conteneur' => new SortieConteneurResource($this->whenLoaded('sortieConteneur')),
            
            // Informations calculées
            'duree_prevue' => $this->date_debut && $this->date_fin ? 
                $this->date_debut->diffInHours($this->date_fin) : null,
            'retard' => $this->date_prevue->isPast() && $this->statut !== 'terminee',
            'progression' => $this->getProgression(),
        ];
    }

    /**
     * Get priorite label
     */
    private function getPrioriteLabel(): string
    {
        return match($this->priorite) {
            'basse' => 'Basse',
            'normale' => 'Normale',
            'haute' => 'Haute',
            'urgente' => 'Urgente',
            default => ucfirst($this->priorite)
        };
    }

    /**
     * Get statut label
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'planifiee' => 'Planifiée',
            'en_cours' => 'En cours',
            'terminee' => 'Terminée',
            'annulee' => 'Annulée',
            default => ucfirst($this->statut)
        };
    }

    /**
     * Get progression percentage
     */
    private function getProgression(): int
    {
        return match($this->statut) {
            'planifiee' => 0,
            'en_cours' => 50,
            'terminee' => 100,
            'annulee' => 0,
            default => 0
        };
    }
}