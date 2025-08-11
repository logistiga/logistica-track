<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ArmateurFactory extends Factory
{
    public function definition(): array
    {
        $companies = [
            'CMA-CGM', 'MAERSK', 'MSC', 'COSCO', 'HAPAG-LLOYD',
            'ONE', 'EVERGREEN', 'YANG MING', 'PIL', 'ZIM'
        ];
        
        $containerTypes = ["20' sec", "40' sec", "40' HC", "45' HC"];
        
        return [
            'code' => strtoupper(fake()->lexify('???')) . fake()->numberBetween(10, 99),
            'nom' => fake()->randomElement($companies),
            'type_conteneur' => fake()->randomElement($containerTypes),
            'jours_gratuits' => fake()->numberBetween(0, 7),
            'prix_par_jour' => fake()->numberBetween(8000, 25000),
            'contact_nom' => fake()->name(),
            'contact_email' => fake()->companyEmail(),
            'contact_telephone' => fake()->phoneNumber(),
            'adresse' => fake()->address(),
            'actif' => fake()->boolean(90),
        ];
    }

    public function actif(): static
    {
        return $this->state(fn (array $attributes) => [
            'actif' => true,
        ]);
    }

    public function inactif(): static
    {
        return $this->state(fn (array $attributes) => [
            'actif' => false,
        ]);
    }
}