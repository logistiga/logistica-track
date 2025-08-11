<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArmateurRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $armateurId = $this->route('armateur')->id;

        return [
            'code' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('armateurs', 'code')->ignore($armateurId)
            ],
            'nom' => 'sometimes|string|max:255',
            'type_conteneur' => 'sometimes|string|max:100',
            'jours_gratuits' => 'sometimes|integer|min:0|max:365',
            'prix_par_jour' => 'sometimes|numeric|min:0',
            'contact_nom' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:1000',
            'actif' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'code.unique' => 'Ce code armateur existe déjà',
            'code.max' => 'Le code ne peut pas dépasser 50 caractères',
            'jours_gratuits.min' => 'Le nombre de jours gratuits ne peut pas être négatif',
            'jours_gratuits.max' => 'Le nombre de jours gratuits ne peut pas dépasser 365',
            'prix_par_jour.min' => 'Le prix par jour ne peut pas être négatif',
            'contact_email.email' => 'L\'email de contact doit être valide',
        ];
    }
}