<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArmateurRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'code' => 'required|string|max:50|unique:armateurs,code',
            'nom' => 'required|string|max:255',
            'type_conteneur' => 'required|string|max:100',
            'jours_gratuits' => 'required|integer|min:0|max:365',
            'prix_par_jour' => 'required|numeric|min:0',
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
            'code.required' => 'Le code armateur est obligatoire',
            'code.unique' => 'Ce code armateur existe déjà',
            'code.max' => 'Le code ne peut pas dépasser 50 caractères',
            'nom.required' => 'Le nom de l\'armateur est obligatoire',
            'type_conteneur.required' => 'Le type de conteneur est obligatoire',
            'jours_gratuits.required' => 'Le nombre de jours gratuits est obligatoire',
            'jours_gratuits.min' => 'Le nombre de jours gratuits ne peut pas être négatif',
            'jours_gratuits.max' => 'Le nombre de jours gratuits ne peut pas dépasser 365',
            'prix_par_jour.required' => 'Le prix par jour est obligatoire',
            'prix_par_jour.min' => 'Le prix par jour ne peut pas être négatif',
            'contact_email.email' => 'L\'email de contact doit être valide',
        ];
    }
}