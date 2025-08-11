<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'table_name' => $this->table_name,
            'table_label' => $this->getTableLabel(),
            'record_id' => $this->record_id,
            'action' => $this->action,
            'action_label' => $this->getActionLabel(),
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'changes_summary' => $this->getChangesSummary(),
            'user_id' => $this->user_id,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'browser_info' => $this->getBrowserInfo(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            
            // Relations
            'user' => new UserResource($this->whenLoaded('user')),
            
            // Informations calculées
            'changes_count' => $this->getChangesCount(),
            'is_critical' => $this->isCriticalAction(),
            'time_ago' => $this->created_at->diffForHumans(),
            'action_icon' => $this->getActionIcon(),
            'action_color' => $this->getActionColor(),
        ];
    }

    /**
     * Get table label
     */
    private function getTableLabel(): string
    {
        return match($this->table_name) {
            'users' => 'Utilisateurs',
            'armateurs' => 'Armateurs',
            'vehicules' => 'Véhicules',
            'sortie_conteneurs' => 'Sorties Conteneurs',
            'operations' => 'Opérations',
            'detentions' => 'Détentions',
            'facturations' => 'Facturations',
            'emails' => 'Emails',
            'notifications' => 'Notifications',
            'archives' => 'Archives',
            default => ucfirst($this->table_name)
        };
    }

    /**
     * Get action label
     */
    private function getActionLabel(): string
    {
        return match($this->action) {
            'create' => 'Création',
            'update' => 'Modification',
            'delete' => 'Suppression',
            default => ucfirst($this->action)
        };
    }

    /**
     * Get changes summary
     */
    private function getChangesSummary(): array
    {
        if ($this->action === 'create') {
            return ['action' => 'Création d\'un nouvel enregistrement'];
        }

        if ($this->action === 'delete') {
            return ['action' => 'Suppression de l\'enregistrement'];
        }

        if ($this->action === 'update' && $this->old_values && $this->new_values) {
            $changes = [];
            $oldValues = is_array($this->old_values) ? $this->old_values : [];
            $newValues = is_array($this->new_values) ? $this->new_values : [];

            foreach ($newValues as $field => $newValue) {
                $oldValue = $oldValues[$field] ?? null;
                if ($oldValue !== $newValue) {
                    $changes[] = [
                        'field' => $field,
                        'field_label' => $this->getFieldLabel($field),
                        'old_value' => $oldValue,
                        'new_value' => $newValue,
                    ];
                }
            }

            return $changes;
        }

        return [];
    }

    /**
     * Get field label
     */
    private function getFieldLabel(string $field): string
    {
        $labels = [
            'name' => 'Nom',
            'email' => 'Email',
            'role' => 'Rôle',
            'statut' => 'Statut',
            'numero_conteneur' => 'Numéro conteneur',
            'date_sortie' => 'Date sortie',
            'date_retour' => 'Date retour',
            'prime_chauffeur' => 'Prime chauffeur',
            'nom_client' => 'Nom client',
            'numero_parc' => 'Numéro parc',
            'immatriculation' => 'Immatriculation',
            'type' => 'Type',
            'marque' => 'Marque',
            'modele' => 'Modèle',
            'code' => 'Code',
            'nom' => 'Nom',
            'prix_par_jour' => 'Prix par jour',
            'jours_gratuits' => 'Jours gratuits',
            'actif' => 'Actif',
        ];

        return $labels[$field] ?? ucfirst(str_replace('_', ' ', $field));
    }

    /**
     * Get changes count
     */
    private function getChangesCount(): int
    {
        if ($this->action !== 'update' || !$this->old_values || !$this->new_values) {
            return 0;
        }

        $oldValues = is_array($this->old_values) ? $this->old_values : [];
        $newValues = is_array($this->new_values) ? $this->new_values : [];
        
        $changes = 0;
        foreach ($newValues as $field => $newValue) {
            $oldValue = $oldValues[$field] ?? null;
            if ($oldValue !== $newValue) {
                $changes++;
            }
        }

        return $changes;
    }

    /**
     * Check if action is critical
     */
    private function isCriticalAction(): bool
    {
        if ($this->action === 'delete') {
            return true;
        }

        $criticalTables = ['users', 'armateurs', 'facturations'];
        $criticalFields = ['role', 'actif', 'statut', 'prix_par_jour', 'montant_total'];

        if (in_array($this->table_name, $criticalTables)) {
            return true;
        }

        if ($this->action === 'update' && $this->new_values) {
            $newValues = is_array($this->new_values) ? $this->new_values : [];
            foreach ($criticalFields as $field) {
                if (array_key_exists($field, $newValues)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get action icon
     */
    private function getActionIcon(): string
    {
        return match($this->action) {
            'create' => 'plus-circle',
            'update' => 'edit',
            'delete' => 'trash',
            default => 'activity'
        };
    }

    /**
     * Get action color
     */
    private function getActionColor(): string
    {
        return match($this->action) {
            'create' => 'green',
            'update' => 'blue',
            'delete' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get browser info from user agent
     */
    private function getBrowserInfo(): array
    {
        if (!$this->user_agent) {
            return ['browser' => 'Inconnu', 'platform' => 'Inconnu'];
        }

        $browser = 'Inconnu';
        $platform = 'Inconnu';

        // Détection simple du navigateur
        if (strpos($this->user_agent, 'Chrome') !== false) {
            $browser = 'Chrome';
        } elseif (strpos($this->user_agent, 'Firefox') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($this->user_agent, 'Safari') !== false) {
            $browser = 'Safari';
        } elseif (strpos($this->user_agent, 'Edge') !== false) {
            $browser = 'Edge';
        }

        // Détection simple de la plateforme
        if (strpos($this->user_agent, 'Windows') !== false) {
            $platform = 'Windows';
        } elseif (strpos($this->user_agent, 'Mac') !== false) {
            $platform = 'macOS';
        } elseif (strpos($this->user_agent, 'Linux') !== false) {
            $platform = 'Linux';
        } elseif (strpos($this->user_agent, 'Mobile') !== false) {
            $platform = 'Mobile';
        }

        return ['browser' => $browser, 'platform' => $platform];
    }
}