<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type_email' => $this->type_email,
            'type_email_label' => $this->getTypeEmailLabel(),
            'destinataire_email' => $this->destinataire_email,
            'destinataire_nom' => $this->destinataire_nom,
            'sujet' => $this->sujet,
            'contenu' => $this->contenu,
            'contenu_preview' => substr(strip_tags($this->contenu), 0, 100) . '...',
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'date_envoi' => $this->date_envoi?->format('Y-m-d H:i:s'),
            'erreur_message' => $this->erreur_message,
            'sortie_conteneur_id' => $this->sortie_conteneur_id,
            'user_id' => $this->user_id,
            'pieces_jointes' => $this->pieces_jointes,
            'pieces_jointes_count' => is_array($this->pieces_jointes) ? count($this->pieces_jointes) : 0,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'sortie_conteneur' => new SortieConteneurResource($this->whenLoaded('sortieConteneur')),
            'user' => new UserResource($this->whenLoaded('user')),
            
            // Informations calculées
            'tentatives_envoi' => $this->getTentativesEnvoi(),
            'delai_envoi' => $this->date_envoi ? 
                $this->created_at->diffInMinutes($this->date_envoi) : null,
            'is_prioritaire' => $this->type_email === 'alerte' || $this->type_email === 'urgence',
            'can_resend' => in_array($this->statut, ['echec', 'annule']),
        ];
    }

    /**
     * Get type email label
     */
    private function getTypeEmailLabel(): string
    {
        return match($this->type_email) {
            'notification' => 'Notification',
            'alerte' => 'Alerte',
            'rapport' => 'Rapport',
            'facture' => 'Facture',
            'reminder' => 'Rappel',
            'urgence' => 'Urgence',
            default => ucfirst($this->type_email)
        };
    }

    /**
     * Get statut label
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'envoye' => 'Envoyé',
            'echec' => 'Échec',
            'annule' => 'Annulé',
            default => ucfirst($this->statut)
        };
    }

    /**
     * Get tentatives envoi (mock calculation)
     */
    private function getTentativesEnvoi(): int
    {
        // Cette méthode pourrait être calculée depuis une table d'audit
        return $this->statut === 'echec' ? 3 : 1;
    }
}