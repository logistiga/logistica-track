<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Ajouter les contraintes de clés étrangères supplémentaires si nécessaire
        Schema::table('operations', function (Blueprint $table) {
            $table->index(['responsable_id', 'statut']);
            $table->index(['sortie_conteneur_id']);
        });

        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->index(['created_by', 'updated_by']);
        });
    }

    public function down()
    {
        Schema::table('operations', function (Blueprint $table) {
            $table->dropIndex(['responsable_id', 'statut']);
            $table->dropIndex(['sortie_conteneur_id']);
        });

        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->dropIndex(['created_by', 'updated_by']);
        });
    }
};