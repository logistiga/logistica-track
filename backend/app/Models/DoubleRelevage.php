<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoubleRelevage extends Model
{
    use HasFactory;

    protected $table = 'double_relevages';

    protected $fillable = [
        'nom_client',
        'numero_conteneur',
        'provenance',
        'camion_ameneur_proprietaire',
        'camion_ameneur_plaque',
        'camion_ameneur_remorque',
        'camion_recuperateur_proprietaire',
        'camion_recuperateur_plaque',
        'camion_recuperateur_remorque',
        'montant_operation',
        'statut',
        'date_creation',
        'date_confirmation',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_creation' => 'date',
        'date_confirmation' => 'date',
        'camion_ameneur_proprietaire' => 'boolean',
        'camion_recuperateur_proprietaire' => 'boolean',
        'montant_operation' => 'decimal:2',
    ];

    // Relations
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Scopes
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeConfirmes($query)
    {
        return $query->where('statut', 'confirme');
    }

    // Accesseurs
    public function getStatutLabelAttribute()
    {
        return match($this->statut) {
            'en_attente' => 'En Attente',
            'confirme' => 'Confirmé',
            'annule' => 'Annulé',
            default => $this->statut,
        };
    }

    public function getCamionAmeneurInfoAttribute()
    {
        return [
            'proprietaire' => $this->camion_ameneur_proprietaire,
            'plaque' => $this->camion_ameneur_plaque,
            'plaqueRemorque' => $this->camion_ameneur_remorque,
        ];
    }

    public function getCamionRecuperateurInfoAttribute()
    {
        return [
            'proprietaire' => $this->camion_recuperateur_proprietaire,
            'plaque' => $this->camion_recuperateur_plaque,
            'plaqueRemorque' => $this->camion_recuperateur_remorque,
        ];
    }
}