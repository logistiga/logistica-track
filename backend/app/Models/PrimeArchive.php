<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrimeArchive extends Model
{
    use HasFactory;

    protected $fillable = [
        'sortie_id',
        'numero_conteneur',
        'camion',
        'chauffeur',
        'date_sortie',
        'date_retour',
        'montant_prime',
        'nom_client',
        'destination',
        'observations',
        'date_paiement',
        'numero_semaine',
        'paye_par',
    ];

    protected $casts = [
        'date_sortie' => 'date',
        'date_retour' => 'date',
        'date_paiement' => 'date',
        'montant_prime' => 'decimal:2',
    ];

    public function sortie()
    {
        return $this->belongsTo(SortieConteneur::class, 'sortie_id');
    }

    public function payePar()
    {
        return $this->belongsTo(User::class, 'paye_par');
    }
}
