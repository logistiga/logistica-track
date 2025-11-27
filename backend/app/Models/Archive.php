<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_archive',
        'reference_originale',
        'donnees_originales',
        'date_archivage',
        'motif_archivage',
        'archive_par',
        'commentaires',
    ];

    protected $casts = [
        'donnees_originales' => 'array',
        'date_archivage' => 'date',
    ];

    public function archivePar()
    {
        return $this->belongsTo(User::class, 'archive_par');
    }
}
