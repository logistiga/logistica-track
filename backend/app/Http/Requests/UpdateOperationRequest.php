<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOperationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'type_operation' => 'sometimes|in:location,transport,double-relevage,logistique',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'camion' => 'sometimes|string|max:255',
            'remorque' => 'sometimes|string|max:255',
            'client' => 'sometimes|string|max:255',
            'instructions' => 'nullable|string|max:1000',
            'tarif_journalier' => 'nullable|numeric|min:0',
            'montant' => 'nullable|numeric|min:0',
            'lieu_depart' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'statut' => 'sometimes|in:planifiee,en-attente,en-cours,terminee,confirmee,annulee'
        ];
    }

    public function messages()
    {
        return [
            'type_operation.in' => 'Le type d\'opération doit être: location, transport, double-relevage ou logistique.',
            'date_debut.date' => 'La date de début doit être une date valide.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after_or_equal' => 'La date de fin doit être après ou égale à la date de début.',
            'statut.in' => 'Le statut n\'est pas valide.'
        ];
    }
}
