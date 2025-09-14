<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Detention extends Model
{
    use HasFactory;

    protected $fillable = [
        'sortie_conteneur_id',
        'date_debut_detention',
        'date_fin_detention',
        'jours_detention',
        'cout_par_jour',
        'cout_total',
        'responsabilite',
        'motif_detention',
        'statut',
        'observations',
    ];

    protected $casts = [
        'date_debut_detention' => 'date',
        'date_fin_detention' => 'date',
        'cout_par_jour' => 'decimal:2',
        'cout_total' => 'decimal:2',
        'jours_detention' => 'integer',
    ];

    // Relations
    public function sortieConteneur()
    {
        return $this->belongsTo(SortieConteneur::class, 'sortie_conteneur_id');
    }

    // Scopes
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }

    public function scopeResolues($query)
    {
        return $query->where('statut', 'resolue');
    }

    public function scopeContestees($query)
    {
        return $query->where('statut', 'contestee');
    }

    public function scopeParResponsabilite($query, $responsabilite)
    {
        return $query->where('responsabilite', $responsabilite);
    }

    // Accesseurs
    public function getDureeDetentionAttribute()
    {
        if ($this->date_fin_detention) {
            return $this->date_debut_detention->diffInDays($this->date_fin_detention);
        }
        return $this->date_debut_detention->diffInDays(now());
    }

    public function getCoutJournalierActuelAttribute()
    {
        return $this->cout_par_jour;
    }

    public function getIsActiveAttribute()
    {
        return $this->statut === 'active';
    }

    public function getIsCriticalAttribute()
    {
        return $this->duree_detention > 7 && $this->is_active;
    }

    public function getResponsabiliteLabelAttribute()
    {
        $labels = [
            'client' => 'Client',
            'logistiga' => 'Logistiga',
            'partagee' => 'Partagée',
        ];

        return $labels[$this->responsabilite] ?? $this->responsabilite;
    }

    public function getStatutLabelAttribute()
    {
        $labels = [
            'active' => 'Active',
            'resolue' => 'Résolue',
            'contestee' => 'Contestée',
        ];

        return $labels[$this->statut] ?? $this->statut;
    }

    // Méthodes métier
    public function calculerCoutTotal()
    {
        $this->cout_total = $this->jours_detention * $this->cout_par_jour;
        return $this->cout_total;
    }

    public function resoudre(string $observations = null)
    {
        $this->statut = 'resolue';
        $this->date_fin_detention = now();
        if ($observations) {
            $this->observations = $observations;
        }
        $this->save();
    }

    public function contester(string $motif)
    {
        $this->statut = 'contestee';
        $this->observations = $motif;
        $this->save();
    }
}