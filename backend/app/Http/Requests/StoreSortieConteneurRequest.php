<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSortieConteneurRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'numero_conteneur' => 'required|string|max:100',
            'numero_bl' => 'required|string|max:100',
            'code_armateur' => 'required|string|exists:armateurs,code',
            'camion_id' => 'required|exists:vehicules,id',
            'remorque_id' => 'required|exists:vehicules,id',
            'prime_chauffeur' => 'nullable|numeric|min:0',
            'nom_client' => 'required|string|max:255',
            'destination' => 'required|in:base,client',
            'adresse_client' => 'required_if:destination,client|nullable|string',
            'type_destination' => 'required|in:bad,detention',
            'jours_bad' => 'nullable|integer|min:1',
            'date_fin_franchise' => 'nullable|date|after:today',
            'nom_transitaire' => 'required|string|max:255',
            'date_sortie' => 'nullable|date',
        ];
    }

    public function messages()
    {
        return [
            'numero_conteneur.required' => 'Le numéro de conteneur est obligatoire',
            'numero_bl.required' => 'Le numéro de BL est obligatoire',
            'code_armateur.required' => 'Le code armateur est obligatoire',
            'code_armateur.exists' => 'L\'armateur sélectionné n\'existe pas',
            'camion_id.required' => 'Le camion est obligatoire',
            'camion_id.exists' => 'Le camion sélectionné n\'existe pas',
            'remorque_id.required' => 'La remorque est obligatoire',
            'remorque_id.exists' => 'La remorque sélectionnée n\'existe pas',
            'nom_client.required' => 'Le nom du client est obligatoire',
            'destination.required' => 'La destination est obligatoire',
            'destination.in' => 'La destination doit être "base" ou "client"',
            'adresse_client.required_if' => 'L\'adresse client est obligatoire pour une livraison client',
            'type_destination.required' => 'Le type de destination est obligatoire',
            'type_destination.in' => 'Le type de destination doit être "bad" ou "detention"',
            'nom_transitaire.required' => 'Le nom du transitaire est obligatoire',
            'date_fin_franchise.after' => 'La date de fin de franchise doit être ultérieure à aujourd\'hui',
        ];
    }

    protected function prepareForValidation()
    {
        if (!$this->has('date_sortie')) {
            $this->merge([
                'date_sortie' => now()->format('Y-m-d')
            ]);
        }
    }
}