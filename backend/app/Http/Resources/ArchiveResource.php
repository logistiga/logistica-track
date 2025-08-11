<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArchiveResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type_archive' => $this->type_archive,
            'type_archive_label' => $this->getTypeArchiveLabel(),
            'reference_originale' => $this->reference_originale,
            'donnees_originales' => $this->donnees_originales,
            'donnees_preview' => $this->getDonneesPreview(),
            'date_archivage' => $this->date_archivage->format('Y-m-d'),
            'motif_archivage' => $this->motif_archivage,
            'archive_par' => $this->archive_par,
            'commentaires' => $this->commentaires,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relations
            'archived_by_user' => new UserResource($this->whenLoaded('archivedBy')),
            
            // Informations calculées
            'duree_archivage' => $this->date_archivage->diffInDays(now()),
            'can_restore' => $this->canRestore(),
            'archive_size' => $this->getArchiveSize(),
            'is_recent' => $this->date_archivage->isAfter(now()->subDays(30)),
        ];
    }

    /**
     * Get type archive label
     */
    private function getTypeArchiveLabel(): string
    {
        return match($this->type_archive) {
            'sortie_conteneur' => 'Sortie Conteneur',
            'operation' => 'Opération',
            'vehicule' => 'Véhicule',
            'armateur' => 'Armateur',
            'user' => 'Utilisateur',
            'detention' => 'Détention',
            'facturation' => 'Facturation',
            default => ucfirst(str_replace('_', ' ', $this->type_archive))
        };
    }

    /**
     * Get donnees preview
     */
    private function getDonneesPreview(): array
    {
        $data = $this->donnees_originales;
        
        if (!is_array($data)) {
            return [];
        }

        // Retourner seulement les champs principaux pour l'aperçu
        $previewFields = match($this->type_archive) {
            'sortie_conteneur' => ['numero_conteneur', 'numero_bl', 'nom_client', 'date_sortie'],
            'operation' => ['numero_operation', 'type_operation', 'date_prevue', 'statut'],
            'vehicule' => ['numero_parc', 'immatriculation', 'type', 'statut'],
            'armateur' => ['code', 'nom', 'type_conteneur'],
            'user' => ['name', 'email', 'role'],
            'detention' => ['date_debut_detention', 'jours_detention', 'cout_total'],
            'facturation' => ['numero_facture', 'montant_ttc', 'date_facture'],
            default => array_slice(array_keys($data), 0, 4)
        };

        return array_intersect_key($data, array_flip($previewFields));
    }

    /**
     * Check if archive can be restored
     */
    private function canRestore(): bool
    {
        // Règles métier pour la restauration
        $maxDays = match($this->type_archive) {
            'sortie_conteneur' => 90,
            'operation' => 60,
            'vehicule' => 180,
            'armateur' => 365,
            'user' => 30,
            'detention' => 365,
            'facturation' => 2555, // 7 ans pour la comptabilité
            default => 30
        };

        return $this->date_archivage->isAfter(now()->subDays($maxDays));
    }

    /**
     * Get archive size estimation
     */
    private function getArchiveSize(): string
    {
        $size = strlen(json_encode($this->donnees_originales));
        
        if ($size < 1024) {
            return $size . ' B';
        } elseif ($size < 1048576) {
            return round($size / 1024, 2) . ' KB';
        } else {
            return round($size / 1048576, 2) . ' MB';
        }
    }
}