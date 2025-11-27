<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Rendre la colonne 'responsabilite' nullable avec les bonnes valeurs ENUM
        DB::statement("ALTER TABLE detentions MODIFY responsabilite ENUM('client','logistiga','partagee') NULL");
    }

    public function down(): void
    {
        // Revenir à NOT NULL avec les bonnes valeurs ENUM
        DB::statement("ALTER TABLE detentions MODIFY responsabilite ENUM('client','logistiga','partagee') NOT NULL DEFAULT 'client'");
    }
};