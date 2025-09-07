<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom_client' => 'required|string|max:255',
            'numero_conteneur' => 'required|string|max:100|unique:stockages,numero_conteneur',
            'provenance' => 'required|string|max:255',
            'date_arrivee' => 'required|date',
            'camion_proprietaire' => 'boolean',
            'plaque_camion' => 'required|string|max:50',
            'plaque_remorque' => 'required|string|max:50',
            'jours_gratuits' => 'required|integer|min:0|max:365',
            'prix_par_jour' => 'required|numeric|min:0',
            'observations' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'nom_client.required' => 'Le nom du client est obligatoire',
            'numero_conteneur.required' => 'Le numéro de conteneur est obligatoire',
            'numero_conteneur.unique' => 'Ce numéro de conteneur existe déjà en stockage',
            'provenance.required' => 'La provenance est obligatoire',
            'date_arrivee.required' => 'La date d\'arrivée est obligatoire',
            'date_arrivee.date' => 'La date d\'arrivée doit être une date valide',
            'plaque_camion.required' => 'La plaque du camion est obligatoire',
            'plaque_remorque.required' => 'La plaque de la remorque est obligatoire',
            'jours_gratuits.required' => 'Le nombre de jours gratuits est obligatoire',
            'jours_gratuits.integer' => 'Le nombre de jours gratuits doit être un entier',
            'jours_gratuits.min' => 'Le nombre de jours gratuits ne peut pas être négatif',
            'prix_par_jour.required' => 'Le prix par jour est obligatoire',
            'prix_par_jour.numeric' => 'Le prix par jour doit être un nombre',
            'prix_par_jour.min' => 'Le prix par jour ne peut pas être négatif',
        ];
    }
}