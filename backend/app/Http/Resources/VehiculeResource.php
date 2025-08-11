<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiculeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_parc' => $this->numero_parc,
            'immatriculation' => $this->immatriculation,
            'type' => $this->type,
            'type_label' => $this->getTypeLabelAttribute(),
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabelAttribute(),
            'marque' => $this->marque,
            'modele' => $this->modele,
            'annee' => $this->annee,
            'capacite' => $this->capacite,
            'libelle_complet' => $this->getLibelleCompletAttribute(),
            'derniere_revision' => $this->derniere_revision?->format('Y-m-d'),
            'prochaine_revision' => $this->prochaine_revision?->format('Y-m-d'),
            'jours_avant_revision' => $this->prochaine_revision ? 
                now()->diffInDays($this->prochaine_revision, false) : null,
            'revision_status' => $this->getRevisionStatus(),
            'notes' => $this->notes,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations conditionnelles
            'sorties_actives_count' => $this->when($this->relationLoaded('sortiesCommeAttele'), 
                fn() => $this->sortiesCommeAttele()->where('statut', '!=', 'retourne_port')->count()
            ),
            'derniere_sortie' => $this->when($this->relationLoaded('sortiesCommeAttele'), 
                fn() => $this->sortiesCommeAttele()->latest()->first()?->date_sortie?->format('Y-m-d')
            ),
        ];
    }

    /**
     * Get revision status
     */
    private function getRevisionStatus(): string
    {
        if (!$this->prochaine_revision) {
            return 'non_planifiee';
        }

        $jours = now()->diffInDays($this->prochaine_revision, false);
        
        if ($jours < 0) {
            return 'en_retard';
        } elseif ($jours <= 7) {
            return 'urgente';
        } elseif ($jours <= 30) {
            return 'prochaine';
        }
        
        return 'planifiee';
    }
}