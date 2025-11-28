<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSortieConteneurRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'numero_conteneur' => 'sometimes|string|max:100',
            'numero_bl' => 'sometimes|string|max:100',
            'code_armateur' => 'sometimes|string|exists:armateurs,code',
            'camion_id' => 'sometimes|exists:vehicules,id',
            'remorque_id' => 'sometimes|exists:vehicules,id',
            'prime_chauffeur' => 'nullable|numeric|min:0',
            'nom_client' => 'sometimes|string|max:255',
            'destination' => 'sometimes|in:base,client',
            'adresse_client' => 'nullable|string',
            'type_destination' => 'sometimes|in:bad,detention',
            'jours_bad' => 'nullable|integer|min:1',
            'date_fin_franchise' => 'nullable|date',
            'nom_transitaire' => 'sometimes|string|max:255',
            'observations' => 'nullable|string',
            'numero_ordre' => 'nullable|string|max:100',
            'pv_sortie' => 'nullable|string|max:100',
            'pv_rentree_port' => 'nullable|string|max:100',
        ];
    }

    public function messages()
    {
        return [
            'code_armateur.exists' => 'L\'armateur sélectionné n\'existe pas',
            'camion_id.exists' => 'Le camion sélectionné n\'existe pas',
            'remorque_id.exists' => 'La remorque sélectionnée n\'existe pas',
            'destination.in' => 'La destination doit être "base" ou "client"',
            'type_destination.in' => 'Le type de destination doit être "bad" ou "detention"',
        ];
    }
}