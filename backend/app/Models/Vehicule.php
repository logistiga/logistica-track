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
        'actif',
        'statut',
        'prochaine_revision',
        'derniere_revision',
        'kilometrage',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'prochaine_revision' => 'date',
        'derniere_revision' => 'date',
        'kilometrage' => 'integer',
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
    public function scopeActifs($query)
    {
        return $query->where('actif', true);
    }

    public function scopeCamions($query)
    {
        return $query->where('type', 'camion');
    }

    public function scopeRemorques($query)
    {
        return $query->where('type', 'remorque');
    }

    public function scopeDisponibles($query)
    {
        return $query->where('statut', 'disponible')->where('actif', true);
    }

    public function scopeEnMission($query)
    {
        return $query->where('statut', 'en_mission');
    }

    public function scopeEnMaintenance($query)
    {
        return $query->where('statut', 'maintenance');
    }

    // Accesseurs
    public function getLibelleCompletAttribute()
    {
        return "{$this->numero_parc} - {$this->immatriculation}";
    }

    public function getTypeLabelAttribute()
    {
        return ucfirst($this->type);
    }
}