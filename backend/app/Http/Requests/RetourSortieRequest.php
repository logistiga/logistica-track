<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RetourSortieRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date_retour' => 'required|date|after_or_equal:date_sortie',
            'camion_retour_id' => 'required|exists:vehicules,id',
            'remorque_retour_id' => 'required|exists:vehicules,id',
            'observations' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'date_retour.required' => 'La date de retour est obligatoire',
            'date_retour.after_or_equal' => 'La date de retour doit être postérieure ou égale à la date de sortie',
            'camion_retour_id.required' => 'Le camion de retour est obligatoire',
            'camion_retour_id.exists' => 'Le camion de retour sélectionné n\'existe pas',
            'remorque_retour_id.required' => 'La remorque de retour est obligatoire',
            'remorque_retour_id.exists' => 'La remorque de retour sélectionnée n\'existe pas',
            'observations.max' => 'Les observations ne peuvent pas dépasser 1000 caractères',
        ];
    }
}