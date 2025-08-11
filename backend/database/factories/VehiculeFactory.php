<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VehiculeFactory extends Factory
{
    public function definition(): array
    {
        $marques = ['Mercedes', 'Volvo', 'Scania', 'MAN', 'DAF', 'Iveco', 'Renault'];
        $modeles = [
            'Mercedes' => ['Actros', 'Arocs', 'Atego'],
            'Volvo' => ['FH', 'FM', 'FE'],
            'Scania' => ['R', 'S', 'P'],
            'MAN' => ['TGX', 'TGM', 'TGL'],
            'DAF' => ['XF', 'CF', 'LF'],
            'Iveco' => ['Stralis', 'Eurocargo', 'Daily'],
            'Renault' => ['T', 'C', 'K']
        ];

        $type = fake()->randomElement(['camion', 'remorque']);
        $marque = $type === 'camion' ? fake()->randomElement($marques) : null;
        $modele = $marque ? fake()->randomElement($modeles[$marque]) : null;

        return [
            'numero_parc' => $type === 'camion' 
                ? 'TR ' . fake()->numberBetween(10, 99)
                : 'R ' . fake()->numberBetween(10, 99),
            'immatriculation' => fake()->regexify('[A-Z]{2}[0-9]{3}[A-Z]{2}'),
            'type' => $type,
            'statut' => fake()->randomElement(['disponible', 'en_mission', 'maintenance']),
            'marque' => $marque,
            'modele' => $modele,
            'annee' => fake()->numberBetween(2015, 2024),
            'capacite' => $type === 'camion' ? fake()->numberBetween(20, 40) : null,
            'derniere_revision' => fake()->dateTimeBetween('-1 year', 'now'),
            'prochaine_revision' => fake()->dateTimeBetween('now', '+6 months'),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function camion(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'camion',
        ]);
    }

    public function remorque(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'remorque',
            'marque' => null,
            'modele' => null,
        ]);
    }

    public function disponible(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'disponible',
        ]);
    }
}