<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SortieStockageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date_sortie' => 'required|date|after_or_equal:' . $this->route('stockage')?->date_arrivee,
            'observations' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'date_sortie.required' => 'La date de sortie est obligatoire',
            'date_sortie.date' => 'La date de sortie doit être une date valide',
            'date_sortie.after_or_equal' => 'La date de sortie ne peut pas être antérieure à la date d\'arrivée',
        ];
    }
}