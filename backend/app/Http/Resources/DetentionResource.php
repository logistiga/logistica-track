<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetentionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $sortieConteneur = $this->sortieConteneur;
        $armateur = $sortieConteneur?->armateur;
        
        // Calculer les jours BAT autorisés depuis l'armateur
        $joursBAT = 0;
        if ($armateur && $armateur->jours_gratuits) {
            $joursBAT = $armateur->jours_gratuits;
        } elseif ($sortieConteneur && in_array($sortieConteneur->type_destination, ['bad', 'fix'])) {
            $joursBAT = 7; // Valeur par défaut
        }
        
        // Calculer les jours réalisés (en jours entiers)
        $joursRealises = 0;
        if ($sortieConteneur && $sortieConteneur->date_sortie) {
            $dateSortie = $sortieConteneur->date_sortie;
            $dateRetour = $sortieConteneur->date_retour ?? now();
            $joursRealises = (int) $dateSortie->diffInDays($dateRetour);
        }
        
        $joursDepassement = max(0, $joursRealises - $joursBAT);
        
        return [
            'id' => $this->id,
            'sortie_conteneur_id' => $this->sortie_conteneur_id,
            'date_debut_detention' => $this->date_debut_detention->format('Y-m-d'),
            'date_fin_detention' => $this->date_fin_detention?->format('Y-m-d'),
            'jours_detention' => $this->jours_detention,
            'cout_par_jour' => $this->cout_par_jour,
            'cout_total' => $this->cout_total,
            'cout_par_jour_formatte' => number_format($this->cout_par_jour, 0, ',', ' ') . ' FCFA',
            'cout_total_formatte' => number_format($this->cout_total, 0, ',', ' ') . ' FCFA',
            'responsabilite' => $this->responsabilite,
            'responsabilite_label' => $this->getResponsabiliteLabel(),
            'motif_detention' => $this->motif_detention,
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'observations' => $this->observations,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Données calculées pour le frontend
            'numero_conteneur' => $sortieConteneur?->numero_conteneur,
            'code_armateur' => $sortieConteneur?->code_armateur,
            'nom_client' => $sortieConteneur?->nom_client,
            'type_conteneur_label' => $sortieConteneur?->type_destination === 'bad' ? 'BAD' : 
                                    ($sortieConteneur?->type_destination === 'fix' ? 'FIX' : 'BAD'),
            'date_sortie' => $sortieConteneur?->date_sortie?->format('Y-m-d'),
            'date_retour' => $sortieConteneur?->date_retour?->format('Y-m-d'),
            'jours_bat' => $joursBAT,
            'jours_realises' => $joursRealises,
            'jours_depassement' => $joursDepassement,
            'jours_client' => $this->responsabilite === 'client' ? $this->jours_detention : 0,
            'jours_logistica' => in_array($this->responsabilite, ['transitaire', 'transporteur', 'autre']) ? $this->jours_detention : 0,
            'note_debit_generee' => $this->statut === 'resolue',
            'paiement_confirme' => $this->statut === 'resolue',
            
            // Relations
            'sortie_conteneur' => new SortieConteneurResource($this->whenLoaded('sortieConteneur')),
            
            // Informations calculées
            'duree_detention' => $this->date_fin_detention ? 
                $this->date_debut_detention->diffInDays($this->date_fin_detention) : 
                $this->date_debut_detention->diffInDays(now()),
            'cout_journalier_actuel' => $this->statut === 'active' ? 
                $this->date_debut_detention->diffInDays(now()) * $this->cout_par_jour : 0,
            'is_active' => $this->statut === 'active',
            'is_critical' => $this->jours_detention > 10 || $this->cout_total > 100000,
        ];
    }

    /**
     * Get responsabilite label
     */
    private function getResponsabiliteLabel(): string
    {
        return match($this->responsabilite) {
            'client' => 'Client',
            'transitaire' => 'Transitaire',
            'transporteur' => 'Transporteur',
            'autre' => 'Autre',
            default => ucfirst($this->responsabilite)
        };
    }

    /**
     * Get statut label
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'resolue' => 'Résolue',
            'contestee' => 'Contestée',
            default => ucfirst($this->statut)
        };
    }
}