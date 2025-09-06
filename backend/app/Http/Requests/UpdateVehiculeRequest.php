<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehiculeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $vehiculeId = $this->route('vehicule')->id;

        return [
            'numero_parc' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('vehicules')->where(function ($query) {
                    return $query->where('type', $this->type ?? $this->route('vehicule')->type);
                })->ignore($vehiculeId)
            ],
            'immatriculation' => 'sometimes|string|max:50',
            'type' => 'sometimes|in:camion,remorque',
            'actif' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'numero_parc.unique' => 'Ce numéro de parc existe déjà pour ce type de véhicule',
            'type.in' => 'Le type doit être "camion" ou "remorque"',
        ];
    }
}