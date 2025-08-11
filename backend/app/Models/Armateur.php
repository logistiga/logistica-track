<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Armateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'nom',
        'type_conteneur',
        'jours_gratuits',
        'prix_par_jour',
        'contact_nom',
        'contact_email',
        'contact_telephone',
        'adresse',
        'actif',
    ];

    protected $casts = [
        'prix_par_jour' => 'decimal:2',
        'jours_gratuits' => 'integer',
        'actif' => 'boolean',
    ];

    // Relations
    public function sorties()
    {
        return $this->hasMany(SortieConteneur::class, 'code_armateur', 'code');
    }

    // Scopes
    public function scopeActifs($query)
    {
        return $query->where('actif', true);
    }

    public function scopeParType($query, $type)
    {
        return $query->where('type_conteneur', 'like', "%{$type}%");
    }

    // Accesseurs
    public function getPrixFormatteAttribute()
    {
        return number_format($this->prix_par_jour, 0, ',', ' ') . ' FCFA';
    }

    public function getCodeNomAttribute()
    {
        return "{$this->code} - {$this->nom}";
    }
}