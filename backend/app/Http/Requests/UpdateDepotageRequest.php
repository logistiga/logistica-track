<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepotageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom_client' => 'sometimes|required|string|max:255',
            'numero_conteneur' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('depotages', 'numero_conteneur')->ignore($this->route('depotage'))
            ],
            'provenance' => 'sometimes|required|string|max:255',
            'date_depotage' => 'sometimes|required|date',
            'camion_proprietaire' => 'sometimes|required|boolean',
            'plaque_camion' => 'sometimes|required|string|max:20',
            'plaque_remorque' => 'sometimes|required|string|max:20',
            'type_marchandise' => 'sometimes|required|string|max:255',
            'prix_depotage' => 'sometimes|required|numeric|min:0',
            'statut' => 'sometimes|required|in:en_cours,termine,annule',
            'observations' => 'nullable|string'
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nom_client.required' => 'Le nom du client est obligatoire.',
            'numero_conteneur.required' => 'Le numéro du conteneur est obligatoire.',
            'numero_conteneur.unique' => 'Ce numéro de conteneur existe déjà.',
            'provenance.required' => 'La provenance est obligatoire.',
            'date_depotage.required' => 'La date de dépotage est obligatoire.',
            'date_depotage.date' => 'La date de dépotage doit être une date valide.',
            'camion_proprietaire.required' => 'Le type de camion est obligatoire.',
            'plaque_camion.required' => 'La plaque du camion est obligatoire.',
            'plaque_remorque.required' => 'La plaque de la remorque est obligatoire.',
            'type_marchandise.required' => 'Le type de marchandise est obligatoire.',
            'prix_depotage.required' => 'Le prix de dépotage est obligatoire.',
            'prix_depotage.numeric' => 'Le prix de dépotage doit être un nombre.',
            'prix_depotage.min' => 'Le prix de dépotage doit être positif.',
            'statut.in' => 'Le statut doit être: en_cours, termine ou annule.'
        ];
    }
}