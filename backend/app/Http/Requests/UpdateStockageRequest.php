<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStockageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom_client' => 'sometimes|string|max:255',
            'numero_conteneur' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('stockages', 'numero_conteneur')->ignore($this->route('stockage'))
            ],
            'provenance' => 'sometimes|string|max:255',
            'date_arrivee' => 'sometimes|date',
            'camion_proprietaire' => 'boolean',
            'plaque_camion' => 'sometimes|string|max:50',
            'plaque_remorque' => 'sometimes|string|max:50',
            'jours_gratuits' => 'sometimes|integer|min:0|max:365',
            'prix_par_jour' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:stocke,en_attente_sortie,sorti',
            'observations' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'numero_conteneur.unique' => 'Ce numéro de conteneur existe déjà en stockage',
            'date_arrivee.date' => 'La date d\'arrivée doit être une date valide',
            'jours_gratuits.integer' => 'Le nombre de jours gratuits doit être un entier',
            'jours_gratuits.min' => 'Le nombre de jours gratuits ne peut pas être négatif',
            'prix_par_jour.numeric' => 'Le prix par jour doit être un nombre',
            'prix_par_jour.min' => 'Le prix par jour ne peut pas être négatif',
            'statut.in' => 'Le statut doit être stocke, en_attente_sortie ou sorti',
        ];
    }
}