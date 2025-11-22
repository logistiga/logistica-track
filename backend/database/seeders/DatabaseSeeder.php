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
            // SortieConteneurSeeder::class, // Temporarily disabled
            DetentionSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}