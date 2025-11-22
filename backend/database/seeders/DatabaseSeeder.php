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
            NotificationSeeder::class,
            // SortieConteneurSeeder::class, // Temporarily disabled - autoloader issue
            // DetentionSeeder::class, // Disabled - requires SortieConteneur data
        ]);
    }
}