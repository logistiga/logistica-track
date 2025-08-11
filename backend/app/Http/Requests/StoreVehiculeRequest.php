<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehiculeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'numero_parc' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vehicules')->where(function ($query) {
                    return $query->where('type', $this->type);
                })
            ],
            'immatriculation' => 'required|string|max:50',
            'type' => 'required|in:camion,remorque',
            'statut' => 'nullable|in:disponible,en_mission,maintenance',
            'marque' => 'nullable|string|max:100',
            'modele' => 'nullable|string|max:100',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'capacite' => 'nullable|numeric|min:0',
            'derniere_revision' => 'nullable|date|before_or_equal:today',
            'prochaine_revision' => 'nullable|date|after_or_equal:today',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'numero_parc.required' => 'Le numéro de parc est obligatoire',
            'numero_parc.unique' => 'Ce numéro de parc existe déjà pour ce type de véhicule',
            'immatriculation.required' => 'L\'immatriculation est obligatoire',
            'type.required' => 'Le type de véhicule est obligatoire',
            'type.in' => 'Le type doit être "camion" ou "remorque"',
            'statut.in' => 'Le statut doit être "disponible", "en_mission" ou "maintenance"',
            'annee.min' => 'L\'année doit être supérieure à 1900',
            'annee.max' => 'L\'année ne peut pas être dans le futur',
            'capacite.min' => 'La capacité ne peut pas être négative',
            'derniere_revision.before_or_equal' => 'La dernière révision ne peut pas être dans le futur',
            'prochaine_revision.after_or_equal' => 'La prochaine révision ne peut pas être dans le passé',
            'notes.max' => 'Les notes ne peuvent pas dépasser 1000 caractères',
        ];
    }
}