<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'role_label' => $this->getRoleLabel(),
            'telephone' => $this->telephone,
            'departement' => $this->departement,
            'actif' => $this->actif,
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'derniere_connexion' => $this->derniere_connexion?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get role label
     */
    private function getRoleLabel(): string
    {
        return match($this->role) {
            'admin' => 'Administrateur',
            'manager' => 'Manager',
            'operator' => 'Opérateur',
            'viewer' => 'Visiteur',
            default => ucfirst($this->role)
        };
    }
}