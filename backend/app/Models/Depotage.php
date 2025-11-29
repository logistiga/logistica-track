<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Depotage extends Model
{
    use HasFactory;

    protected $fillable = [
        'sortie_conteneur_id',
        'nom_client',
        'numero_conteneur',
        'provenance',
        'date_depotage',
        'camion_proprietaire',
        'plaque_camion',
        'plaque_remorque',
        'type_marchandise',
        'prix_depotage',
        'statut',
        'observations',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_depotage' => 'date',
        'camion_proprietaire' => 'boolean',
        'prix_depotage' => 'integer',
    ];

    protected $appends = ['statut_label', 'prix_depotage_formate'];

    public function getStatutLabelAttribute()
    {
        return match($this->statut) {
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            'annule' => 'Annulé',
            default => $this->statut
        };
    }

    public function getPrixDepotageFormateAttribute()
    {
        return number_format($this->prix_depotage, 0, ',', ' ') . ' FCFA';
    }

    /**
     * Relations
     */
    public function sortieConteneur(): BelongsTo
    {
        return $this->belongsTo(\App\Models\SortieConteneur::class, 'sortie_conteneur_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scopes
     */
    public function scopeEnCours($query)
    {
        return $query->where('statut', 'en_cours');
    }

    public function scopeTermine($query)
    {
        return $query->where('statut', 'termine');
    }

    public function scopeAnnule($query)
    {
        return $query->where('statut', 'annule');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nom_client', 'like', "%{$search}%")
              ->orWhere('numero_conteneur', 'like', "%{$search}%")
              ->orWhere('type_marchandise', 'like', "%{$search}%");
        });
    }
}