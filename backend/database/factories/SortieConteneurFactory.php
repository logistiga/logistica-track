<?php

namespace Database\Factories;

use App\Models\Armateur;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Database\Eloquent\Factories\Factory;

class SortieConteneurFactory extends Factory
{
    public function definition(): array
    {
        $camions = Vehicule::where('type', 'camion')->pluck('id')->toArray();
        $remorques = Vehicule::where('type', 'remorque')->pluck('id')->toArray();
        $armateurs = Armateur::pluck('code')->toArray();
        $users = User::pluck('id')->toArray();

        $dateSortie = fake()->dateTimeBetween('-3 months', 'now');
        $statut = fake()->randomElement(['en_cours', 'livre_client', 'a_la_base', 'retourne_port']);
        
        return [
            'numero_conteneur' => strtoupper(fake()->lexify('????')) . fake()->numerify('######') . fake()->numerify('#'),
            'numero_bl' => 'BL' . fake()->numerify('##########'),
            'code_armateur' => fake()->randomElement($armateurs),
            'camion_id' => fake()->randomElement($camions),
            'remorque_id' => fake()->randomElement($remorques),
            'prime_chauffeur' => fake()->numberBetween(5000, 15000),
            'nom_client' => fake()->company(),
            'destination' => fake()->randomElement(['base', 'client']),
            'adresse_client' => fake()->optional()->address(),
            'type_destination' => fake()->randomElement(['bad', 'detention']),
            'jours_bad' => fake()->optional()->numberBetween(1, 10),
            'date_fin_franchise' => fake()->optional()->dateTimeBetween($dateSortie, '+10 days'),
            'nom_transitaire' => fake()->company(),
            'date_sortie' => $dateSortie,
            'date_retour' => $statut === 'retourne_port' ? fake()->dateTimeBetween($dateSortie, 'now') : null,
            'statut' => $statut,
            'camion_retour_id' => $statut === 'retourne_port' ? fake()->randomElement($camions) : null,
            'remorque_retour_id' => $statut === 'retourne_port' ? fake()->randomElement($remorques) : null,
            'observations' => fake()->optional()->sentence(),
            'created_by' => fake()->randomElement($users),
            'updated_by' => fake()->randomElement($users),
        ];
    }

    public function enCours(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_cours',
            'date_retour' => null,
            'camion_retour_id' => null,
            'remorque_retour_id' => null,
        ]);
    }

    public function retourne(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'retourne_port',
            'date_retour' => fake()->dateTimeBetween($attributes['date_sortie'], 'now'),
        ]);
    }
}