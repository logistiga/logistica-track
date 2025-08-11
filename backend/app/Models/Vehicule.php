<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_parc',
        'immatriculation',
        'type',
        'statut',
        'marque',
        'modele',
        'annee',
        'capacite',
        'derniere_revision',
        'prochaine_revision',
        'notes',
    ];

    protected $casts = [
        'annee' => 'integer',
        'capacite' => 'decimal:2',
        'derniere_revision' => 'date',
        'prochaine_revision' => 'date',
    ];

    // Relations
    public function sortiesCommeAttele()
    {
        return $this->hasMany(SortieConteneur::class, 'camion_id');
    }

    public function sortiesCommeRemorque()
    {
        return $this->hasMany(SortieConteneur::class, 'remorque_id');
    }

    public function retoursCommeAttele()
    {
        return $this->hasMany(SortieConteneur::class, 'camion_retour_id');
    }

    public function retoursCommeRemorque()
    {
        return $this->hasMany(SortieConteneur::class, 'remorque_retour_id');
    }

    // Scopes
    public function scopeDisponibles($query)
    {
        return $query->where('statut', 'disponible');
    }

    public function scopeEnMission($query)
    {
        return $query->where('statut', 'en_mission');
    }

    public function scopeCamions($query)
    {
        return $query->where('type', 'camion');
    }

    public function scopeRemorques($query)
    {
        return $query->where('type', 'remorque');
    }

    // Accesseurs
    public function getLibelleCompletAttribute()
    {
        return "{$this->numero_parc} - {$this->immatriculation}";
    }

    public function getStatutLabelAttribute()
    {
        $labels = [
            'disponible' => 'Disponible',
            'en_mission' => 'En mission',
            'maintenance' => 'Maintenance',
        ];

        return $labels[$this->statut] ?? $this->statut;
    }

    public function getTypeLabelAttribute()
    {
        return ucfirst($this->type);
    }
}