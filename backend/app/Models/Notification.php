<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'titre',
        'message',
        'priorite',
        'statut',
        'user_id',
        'metadata',
        'lu_le',
    ];

    protected $casts = [
        'metadata' => 'array',
        'lu_le' => 'datetime',
    ];

    protected $attributes = [
        'priorite' => 'normale',
        'statut' => 'non_lu',
    ];

    /**
     * Get the user that owns the notification.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->where('statut', 'non_lu');
    }

    /**
     * Scope a query to only include read notifications.
     */
    public function scopeRead($query)
    {
        return $query->where('statut', 'lu');
    }

    /**
     * Mark the notification as read.
     */
    public function markAsRead()
    {
        $this->update([
            'statut' => 'lu',
            'lu_le' => now(),
        ]);
    }

    /**
     * Get the priority color for display.
     */
    public function getPrioriteColorAttribute(): string
    {
        return match($this->priorite) {
            'critique' => 'red',
            'haute' => 'orange',
            'normale' => 'blue',
            'basse' => 'gray',
            default => 'blue',
        };
    }

    /**
     * Get the status label for display.
     */
    public function getStatutLabelAttribute(): string
    {
        return match($this->statut) {
            'non_lu' => 'Non lu',
            'lu' => 'Lu',
            'archive' => 'Archivé',
            default => 'Non lu',
        };
    }
}