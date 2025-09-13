<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Rendre la colonne 'responsabilite' nullable (MySQL ENUM -> utiliser SQL brut)
        DB::statement("ALTER TABLE detentions MODIFY responsabilite ENUM('client','transitaire','transporteur','autre') NULL");
    }

    public function down(): void
    {
        // Revenir à NOT NULL (choisir 'client' comme valeur par défaut pour éviter les erreurs de contraintes)
        DB::statement("ALTER TABLE detentions MODIFY responsabilite ENUM('client','transitaire','transporteur','autre') NOT NULL DEFAULT 'client'");
    }
};