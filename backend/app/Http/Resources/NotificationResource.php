<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => $this->getTypeLabel(),
            'titre' => $this->titre,
            'message' => $this->message,
            'message_preview' => substr($this->message, 0, 100) . '...',
            'priorite' => $this->priorite,
            'priorite_label' => $this->getPrioriteLabel(),
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'user_id' => $this->user_id,
            'metadata' => $this->metadata,
            'lu_le' => $this->lu_le?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'user' => new UserResource($this->whenLoaded('user')),
            
            // Informations calculées
            'is_read' => $this->statut === 'lu',
            'is_recent' => $this->created_at->isAfter(now()->subHours(24)),
            'time_ago' => $this->created_at->diffForHumans(),
            'priority_color' => $this->getPriorityColor(),
            'type_icon' => $this->getTypeIcon(),
            'action_url' => $this->getActionUrl(),
        ];
    }

    /**
     * Get type label
     */
    private function getTypeLabel(): string
    {
        return match($this->type) {
            'sortie_created' => 'Nouvelle sortie',
            'sortie_returned' => 'Retour conteneur',
            'detention_alert' => 'Alerte détention',
            'vehicle_maintenance' => 'Maintenance véhicule',
            'operation_completed' => 'Opération terminée',
            'facture_overdue' => 'Facture en retard',
            'system_alert' => 'Alerte système',
            default => ucfirst(str_replace('_', ' ', $this->type))
        };
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
            'critique' => 'Critique',
            default => ucfirst($this->priorite)
        };
    }

    /**
     * Get statut label
     */
    private function getStatutLabel(): string
    {
        return match($this->statut) {
            'non_lu' => 'Non lu',
            'lu' => 'Lu',
            'archive' => 'Archivé',
            default => ucfirst($this->statut)
        };
    }

    /**
     * Get priority color
     */
    private function getPriorityColor(): string
    {
        return match($this->priorite) {
            'basse' => 'green',
            'normale' => 'blue',
            'haute' => 'orange',
            'critique' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get type icon
     */
    private function getTypeIcon(): string
    {
        return match($this->type) {
            'sortie_created' => 'truck',
            'sortie_returned' => 'check-circle',
            'detention_alert' => 'alert-triangle',
            'vehicle_maintenance' => 'wrench',
            'operation_completed' => 'check',
            'facture_overdue' => 'credit-card',
            'system_alert' => 'alert-circle',
            default => 'bell'
        };
    }

    /**
     * Get action URL based on notification type
     */
    private function getActionUrl(): ?string
    {
        $metadata = $this->metadata;
        
        if (!is_array($metadata)) {
            return null;
        }

        return match($this->type) {
            'sortie_created', 'sortie_returned' => 
                isset($metadata['sortie_id']) ? "/sorties/{$metadata['sortie_id']}" : null,
            'detention_alert' => 
                isset($metadata['detention_id']) ? "/detentions/{$metadata['detention_id']}" : null,
            'vehicle_maintenance' => 
                isset($metadata['vehicule_id']) ? "/vehicules/{$metadata['vehicule_id']}" : null,
            'operation_completed' => 
                isset($metadata['operation_id']) ? "/operations/{$metadata['operation_id']}" : null,
            'facture_overdue' => 
                isset($metadata['facture_id']) ? "/facturations/{$metadata['facture_id']}" : null,
            default => null
        };
    }
}