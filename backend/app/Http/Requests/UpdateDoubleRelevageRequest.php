<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoubleRelevageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom_client' => 'sometimes|string|max:255',
            'numero_conteneur' => 'sometimes|string|max:100',
            'provenance' => 'sometimes|string|max:255',
            
            // Camion ameneur
            'camion_ameneur_proprietaire' => 'boolean',
            'camion_ameneur_plaque' => 'sometimes|string|max:50',
            'camion_ameneur_remorque' => 'sometimes|string|max:50',
            
            // Camion récupérateur
            'camion_recuperateur_proprietaire' => 'boolean',
            'camion_recuperateur_plaque' => 'sometimes|string|max:50',
            'camion_recuperateur_remorque' => 'sometimes|string|max:50',
            
            'montant_operation' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:en_attente,confirme,annule',
            'observations' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'montant_operation.numeric' => 'Le montant de l\'opération doit être un nombre',
            'montant_operation.min' => 'Le montant de l\'opération ne peut pas être négatif',
            'statut.in' => 'Le statut doit être en_attente, confirme ou annule',
        ];
    }
}