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
            'actif' => 'nullable|boolean',
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
        ];
    }
}