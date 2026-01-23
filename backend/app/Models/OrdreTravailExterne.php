<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdreTravailExterne extends Model
{
    use HasFactory;

    protected $table = 'ordres_travail_externes';

    protected $fillable = [
        'numero',
        'external_id',
        'client_nom',
        'client_email',
        'client_telephone',
        'date',
        'type',
        'status',
        'reference',
        'booking_number',
        'vessel_name',
        'containers',
        'lignes_prestations',
        'montant_total',
        'notes',
        'source',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'date' => 'date',
        'containers' => 'array',
        'lignes_prestations' => 'array',
        'montant_total' => 'decimal:2',
        'validated_at' => 'datetime',
    ];

    // Relations
    public function validatedBy()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    // Scopes
    public function scopeEnAttente($query)
    {
        return $query->whereIn('status', ['brouillon', 'en_cours']);
    }

    public function scopeValides($query)
    {
        return $query->whereIn('status', ['termine', 'facture']);
    }

    public function scopeAnnules($query)
    {
        return $query->where('status', 'annule');
    }

    // Accesseurs
    public function getContainersCountAttribute(): int
    {
        return is_array($this->containers) ? count($this->containers) : 0;
    }

    public function getClientAttribute(): array
    {
        return [
            'nom' => $this->client_nom,
            'email' => $this->client_email,
            'telephone' => $this->client_telephone,
        ];
    }

    public function getStatusLabelAttribute(): string
    {
        $labels = [
            'brouillon' => 'Brouillon',
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            'facture' => 'Facturé',
            'annule' => 'Annulé',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    // Méthodes
    public static function generateNumero(): string
    {
        $prefix = 'OTE-' . date('Ym') . '-';
        $lastOrder = self::where('numero', 'like', $prefix . '%')
            ->orderBy('numero', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = intval(substr($lastOrder->numero, -4));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function calculateMontantTotal(): float
    {
        if (!is_array($this->lignes_prestations)) {
            return 0;
        }

        return collect($this->lignes_prestations)->sum(function ($ligne) {
            return ($ligne['quantite'] ?? 0) * ($ligne['prix_unitaire'] ?? 0);
        });
    }
}
