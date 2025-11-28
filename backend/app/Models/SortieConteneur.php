<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SortieConteneur extends Model
{
    use HasFactory;

    protected $table = 'sortie_conteneurs';

    protected $fillable = [
        'numero_conteneur',
        'numero_bl',
        'numero_ordre',
        'pv_sortie',
        'pv_rentree_port',
        'code_armateur',
        'camion_id',
        'remorque_id',
        'prime_chauffeur',
        'nom_client',
        'destination',
        'adresse_client',
        'type_destination',
        'jours_bad',
        'date_fin_franchise',
        'nom_transitaire',
        'date_sortie',
        'date_retour',
        'statut',
        'camion_retour_id',
        'remorque_retour_id',
        'observations',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_sortie' => 'date',
        'date_retour' => 'date',
        'date_fin_franchise' => 'date',
        'prime_chauffeur' => 'decimal:2',
        'jours_bad' => 'integer',
    ];

    // Relations
    public function armateur()
    {
        return $this->belongsTo(Armateur::class, 'code_armateur', 'code');
    }

    public function camion()
    {
        return $this->belongsTo(Vehicule::class, 'camion_id');
    }

    public function remorque()
    {
        return $this->belongsTo(Vehicule::class, 'remorque_id');
    }

    public function camionRetour()
    {
        return $this->belongsTo(Vehicule::class, 'camion_retour_id');
    }

    public function remorqueRetour()
    {
        return $this->belongsTo(Vehicule::class, 'remorque_retour_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function detention()
    {
        return $this->hasOne(\App\Models\Detention::class, 'sortie_conteneur_id');
    }

    public function facturation()
    {
        return $this->hasOne(Facturation::class, 'sortie_conteneur_id');
    }

    // Scopes
    public function scopeEnCours($query)
    {
        return $query->where('statut', '!=', 'retourne_port');
    }

    public function scopeRetournees($query)
    {
        return $query->where('statut', 'retourne_port');
    }

    public function scopeParMois($query, $annee, $mois)
    {
        return $query->whereYear('date_sortie', $annee)
                    ->whereMonth('date_sortie', $mois);
    }

    public function scopeParArmateur($query, $codeArmateur)
    {
        return $query->where('code_armateur', $codeArmateur);
    }

    // Accesseurs
    public function getJoursHorsPortAttribute()
    {
        if (!$this->date_retour) {
            return now()->diffInDays($this->date_sortie);
        }
        return $this->date_retour->diffInDays($this->date_sortie);
    }

    public function getStatutLabelAttribute()
    {
        $labels = [
            'en_cours' => 'En cours',
            'livre_client' => 'Livré client',
            'a_la_base' => 'À la base',
            'retourne_port' => 'Retourné au port',
        ];

        return $labels[$this->statut] ?? $this->statut;
    }
}