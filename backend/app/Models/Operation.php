<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Operation extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_operation',
        'type_operation',
        'description',
        'priorite',
        'statut',
        'date_debut',
        'date_fin',
        'duree',
        'date_debut_execution',
        'date_fin_execution',
        'responsable_id',
        'sortie_conteneur_id',
        'vehicules_assignes',
        'tarif_journalier',
        'cout_estime',
        'cout_reel',
        'lieu_depart',
        'destination',
        'notes'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'date_debut_execution' => 'datetime',
        'date_fin_execution' => 'datetime',
        'vehicules_assignes' => 'array',
        'tarif_journalier' => 'decimal:2',
        'cout_estime' => 'decimal:2',
        'cout_reel' => 'decimal:2',
        'duree' => 'integer'
    ];

    // Relations
    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function sortieConteneur()
    {
        return $this->belongsTo(SortieConteneur::class, 'sortie_conteneur_id');
    }

    // Calculer automatiquement la durée pour les locations
    public function calculerDuree()
    {
        if ($this->type_operation === 'location' && $this->date_debut && $this->date_fin) {
            $debut = Carbon::parse($this->date_debut);
            $fin = Carbon::parse($this->date_fin);
            $this->duree = $debut->diffInDays($fin);
        }
    }

    // Calculer le montant pour les locations
    public function calculerMontant()
    {
        if ($this->type_operation === 'location' && $this->duree && $this->tarif_journalier) {
            $this->cout_estime = $this->duree * $this->tarif_journalier;
        }
    }

    // Boot method pour calculer automatiquement
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($operation) {
            // Calculer durée et montant avant sauvegarde
            if ($operation->type_operation === 'location') {
                $operation->calculerDuree();
                $operation->calculerMontant();
            }
        });
    }
}
