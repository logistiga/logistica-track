<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConteneurTraite extends Model
{
    use HasFactory;

    protected $table = 'conteneurs_traites';

    protected $fillable = [
        'numero_conteneur',
        'numero_bl',
        'nom_client',
        'code_armateur',
        'type_conteneur',
        'date_sortie',
        'date_retour',
        'chauffeur',
        'destination',
        'observations',
        'jours_detention',
        'montant_detention',
        'source_id',
        'status',
        'received_at',
        'facture_id',
        'factured_at',
    ];

    protected $casts = [
        'date_sortie' => 'date',
        'date_retour' => 'date',
        'received_at' => 'datetime',
        'factured_at' => 'datetime',
        'jours_detention' => 'integer',
        'montant_detention' => 'decimal:2',
        'source_id' => 'integer',
        'facture_id' => 'integer',
    ];

    /**
     * Relation avec la facture (si liée)
     */
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    /**
     * Scope: conteneurs non facturés
     */
    public function scopeNonFactures($query)
    {
        return $query->where('status', '!=', 'facture');
    }

    /**
     * Scope: conteneurs reçus aujourd'hui
     */
    public function scopeRecusAujourdhui($query)
    {
        return $query->whereDate('received_at', today());
    }
}
