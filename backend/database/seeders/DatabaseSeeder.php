<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ArmateurSeeder::class,
            VehiculeSeeder::class,
            // NotificationSeeder::class, // Disabled temporarily - column issue
            // SortieConteneurSeeder::class, // Disabled - autoloader issue
            // DetentionSeeder::class, // Disabled - requires SortieConteneur data
        ]);
    }
}