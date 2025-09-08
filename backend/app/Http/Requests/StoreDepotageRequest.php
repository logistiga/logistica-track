<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepotageRequest extends FormRequest
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
            'nom_client' => 'required|string|max:255',
            'numero_conteneur' => 'required|string|max:255|unique:depotages,numero_conteneur',
            'provenance' => 'required|string|max:255',
            'date_depotage' => 'required|date',
            'camion_proprietaire' => 'required|boolean',
            'plaque_camion' => 'required|string|max:20',
            'plaque_remorque' => 'required|string|max:20',
            'type_marchandise' => 'required|string|max:255',
            'prix_depotage' => 'required|numeric|min:0',
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
            'prix_depotage.min' => 'Le prix de dépotage doit être positif.'
        ];
    }
}