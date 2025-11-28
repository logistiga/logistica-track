<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stockage extends Model
{
    use HasFactory;

    protected $table = 'stockages';

    protected $fillable = [
        'sortie_conteneur_id',
        'nom_client',
        'numero_conteneur',
        'provenance',
        'date_arrivee',
        'camion_proprietaire',
        'plaque_camion',
        'plaque_remorque',
        'jours_gratuits',
        'prix_par_jour',
        'statut',
        'date_sortie',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_arrivee' => 'date',
        'date_sortie' => 'date',
        'camion_proprietaire' => 'boolean',
        'prix_par_jour' => 'decimal:2',
        'jours_gratuits' => 'integer',
    ];

    // Relations
    public function sortieConteneur()
    {
        return $this->belongsTo(\App\Models\SortieConteneur::class, 'sortie_conteneur_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Scopes
    public function scopeActifs($query)
    {
        return $query->where('statut', 'stocke');
    }

    public function scopeEnAttenteortie($query)
    {
        return $query->where('statut', 'en_attente_sortie');
    }

    // Accesseurs
    public function getJoursStockageAttribute()
    {
        if ($this->date_sortie) {
            return $this->date_arrivee->diffInDays($this->date_sortie);
        }
        return $this->date_arrivee->diffInDays(now());
    }

    public function getJoursDetentionAttribute()
    {
        return max(0, $this->jours_stockage - $this->jours_gratuits);
    }

    public function getMontantDetentionAttribute()
    {
        return $this->jours_detention * $this->prix_par_jour;
    }

    public function getStatutLabelAttribute()
    {
        return match($this->statut) {
            'stocke' => 'Stocké',
            'en_attente_sortie' => 'En attente sortie',
            'sorti' => 'Sorti',
            default => $this->statut,
        };
    }
}