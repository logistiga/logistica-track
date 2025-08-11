<?php

namespace Database\Seeders;

use App\Models\SortieConteneur;
use Illuminate\Database\Seeder;

class SortieConteneurSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des sorties de conteneurs avec la factory
        SortieConteneur::factory(50)->create();
        
        // Créer quelques sorties spécifiques en cours
        SortieConteneur::factory(10)->enCours()->create();
        
        // Créer quelques sorties retournées
        SortieConteneur::factory(15)->retourne()->create();
    }
}