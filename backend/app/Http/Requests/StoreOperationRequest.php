<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOperationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'type_operation' => 'required|in:location,transport,double-relevage,logistique',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'camion' => 'required|string|max:255',
            'remorque' => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'instructions' => 'nullable|string|max:1000',
            'tarif_journalier' => 'nullable|numeric|min:0',
            'montant' => 'nullable|numeric|min:0',
            'lieu_depart' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255'
        ];

        // Règles spécifiques selon le type
        if ($this->input('type_operation') === 'location') {
            $rules['date_fin'] = 'required|date|after_or_equal:date_debut';
            $rules['tarif_journalier'] = 'required|numeric|min:0';
        }

        if ($this->input('type_operation') === 'transport') {
            $rules['lieu_depart'] = 'required|string|max:255';
            $rules['destination'] = 'required|string|max:255';
        }

        if (in_array($this->input('type_operation'), ['transport', 'double-relevage', 'logistique'])) {
            $rules['montant'] = 'required|numeric|min:0';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'type_operation.required' => 'Le type d\'opération est obligatoire.',
            'type_operation.in' => 'Le type d\'opération doit être: location, transport, double-relevage ou logistique.',
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_debut.date' => 'La date de début doit être une date valide.',
            'date_fin.required' => 'La date de fin est obligatoire pour les locations.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after_or_equal' => 'La date de fin doit être après ou égale à la date de début.',
            'camion.required' => 'Le camion est obligatoire.',
            'remorque.required' => 'La remorque est obligatoire.',
            'client.required' => 'Le client est obligatoire.',
            'tarif_journalier.required' => 'Le tarif journalier est obligatoire pour les locations.',
            'tarif_journalier.numeric' => 'Le tarif journalier doit être un nombre.',
            'montant.required' => 'Le montant est obligatoire.',
            'montant.numeric' => 'Le montant doit être un nombre.',
            'lieu_depart.required' => 'Le lieu de départ est obligatoire pour les transports.',
            'destination.required' => 'La destination est obligatoire pour les transports.'
        ];
    }
}
