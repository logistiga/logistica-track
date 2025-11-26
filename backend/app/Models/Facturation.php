<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facturation extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_facture',
        'date_facture',
        'date_echeance',
        'sortie_conteneur_id',
        'montant_transport',
        'montant_detention',
        'montant_autres',
        'montant_total',
        'montant_tva',
        'montant_ttc',
        'statut',
        'date_paiement',
        'mode_paiement',
        'notes',
    ];

    protected $casts = [
        'date_facture' => 'date',
        'date_echeance' => 'date',
        'date_paiement' => 'date',
        'montant_transport' => 'decimal:2',
        'montant_detention' => 'decimal:2',
        'montant_autres' => 'decimal:2',
        'montant_total' => 'decimal:2',
        'montant_tva' => 'decimal:2',
        'montant_ttc' => 'decimal:2',
    ];

    public function sortieConteneur()
    {
        return $this->belongsTo(SortieConteneur::class, 'sortie_conteneur_id');
    }
}
