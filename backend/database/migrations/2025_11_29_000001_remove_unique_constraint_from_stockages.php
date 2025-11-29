<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stockages', function (Blueprint $table) {
            // Retirer la contrainte UNIQUE sur numero_conteneur
            // car la validation applicative gère la réutilisation des numéros
            $table->dropUnique(['numero_conteneur']);
        });
    }

    public function down(): void
    {
        Schema::table('stockages', function (Blueprint $table) {
            $table->unique('numero_conteneur');
        });
    }
};
