<?php

namespace App\Observers;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\Auth;

class SortieConteneurObserver
{
    public function creating(SortieConteneur $sortieConteneur)
    {
        if (Auth::check()) {
            $sortieConteneur->created_by = Auth::id();
        }
    }

    public function updating(SortieConteneur $sortieConteneur)
    {
        if (Auth::check()) {
            $sortieConteneur->updated_by = Auth::id();
        }
    }

    public function created(SortieConteneur $sortieConteneur)
    {
        // Ici on pourrait envoyer des notifications
        // event(new SortieCreated($sortieConteneur));
    }

    public function updated(SortieConteneur $sortieConteneur)
    {
        // Ici on pourrait envoyer des notifications de mise à jour
        // if ($sortieConteneur->wasChanged('statut')) {
        //     event(new SortieStatusChanged($sortieConteneur));
        // }
    }
}