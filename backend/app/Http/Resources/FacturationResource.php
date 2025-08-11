<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_facture' => $this->numero_facture,
            'sortie_conteneur_id' => $this->sortie_conteneur_id,
            'date_facture' => $this->date_facture->format('Y-m-d'),
            'date_echeance' => $this->date_echeance->format('Y-m-d'),
            'montant_transport' => $this->montant_transport,
            'montant_detention' => $this->montant_detention,
            'montant_autres' => $this->montant_autres,
            'montant_total' => $this->montant_total,
            'montant_tva' => $this->montant_tva,
            'montant_ttc' => $this->montant_ttc,
            'montant_transport_formatte' => number_format($this->montant_transport, 0, ',', ' ') . ' FCFA',
            'montant_detention_formatte' => number_format($this->montant_detention, 0, ',', ' ') . ' FCFA',
            'montant_autres_formatte' => number_format($this->montant_autres, 0, ',', ' ') . ' FCFA',
            'montant_total_formatte' => number_format($this->montant_total, 0, ',', ' ') . ' FCFA',
            'montant_tva_formatte' => number_format($this->montant_tva, 0, ',', ' ') . ' FCFA',
            'montant_ttc_formatte' => number_format($this->montant_ttc, 0, ',', ' ') . ' FCFA',
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'date_paiement' => $this->date_paiement?->format('Y-m-d'),
            'mode_paiement' => $this->mode_paiement,
            'notes' => $this->notes,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'sortie_conteneur' => new SortieConteneurResource($this->whenLoaded('sortieConteneur')),
            
            // Informations calculées
            'jours_echeance' => $this->date_echeance->diffInDays(now(), false),
            'is_overdue' => $this->date_echeance->isPast() && $this->statut !== 'payee',
            'is_due_soon' => $this->date_echeance->diffInDays(now(), false) <= 3 && $this->statut !== 'payee',
            'delai_paiement' => $this->date_paiement ? 
                $this->date_facture->diffInDays($this->date_paiement) : null,
            'taux_tva' => $this->montant_total > 0 ? 
                round(($this->montant_tva / $this->montant_total) * 100, 2) : 0,
        ];
    }

    /**
     * Get statut label
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'brouillon' => 'Brouillon',
            'envoyee' => 'Envoyée',
            'payee' => 'Payée',
            'annulee' => 'Annulée',
            default => ucfirst($this->statut)
        };
    }
}