<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoubleRelevageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom_client' => 'required|string|max:255',
            'numero_conteneur' => 'required|string|max:100',
            'provenance' => 'required|string|max:255',
            
            // Camion ameneur
            'camion_ameneur_proprietaire' => 'boolean',
            'camion_ameneur_plaque' => 'required|string|max:50',
            'camion_ameneur_remorque' => 'required|string|max:50',
            
            // Camion récupérateur
            'camion_recuperateur_proprietaire' => 'boolean',
            'camion_recuperateur_plaque' => 'required|string|max:50',
            'camion_recuperateur_remorque' => 'required|string|max:50',
            
            'montant_operation' => 'required|numeric|min:0',
            'observations' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'nom_client.required' => 'Le nom du client est obligatoire',
            'numero_conteneur.required' => 'Le numéro de conteneur est obligatoire',
            'provenance.required' => 'La provenance est obligatoire',
            'camion_ameneur_plaque.required' => 'La plaque du camion ameneur est obligatoire',
            'camion_ameneur_remorque.required' => 'La plaque de la remorque ameneur est obligatoire',
            'camion_recuperateur_plaque.required' => 'La plaque du camion récupérateur est obligatoire',
            'camion_recuperateur_remorque.required' => 'La plaque de la remorque récupérateur est obligatoire',
            'montant_operation.required' => 'Le montant de l\'opération est obligatoire',
            'montant_operation.numeric' => 'Le montant de l\'opération doit être un nombre',
            'montant_operation.min' => 'Le montant de l\'opération ne peut pas être négatif',
        ];
    }
}