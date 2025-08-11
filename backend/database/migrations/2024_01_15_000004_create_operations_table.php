<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->string('numero_operation')->unique();
            $table->string('type_operation');
            $table->text('description');
            $table->enum('priorite', ['basse', 'normale', 'haute', 'urgente'])->default('normale');
            $table->enum('statut', ['planifiee', 'en_cours', 'terminee', 'annulee'])->default('planifiee');
            $table->datetime('date_prevue');
            $table->datetime('date_debut')->nullable();
            $table->datetime('date_fin')->nullable();
            $table->foreignId('responsable_id')->nullable()->constrained('users');
            $table->foreignId('sortie_conteneur_id')->nullable()->constrained('sortie_conteneurs');
            $table->json('vehicules_assignes')->nullable();
            $table->decimal('cout_estime', 10, 2)->nullable();
            $table->decimal('cout_reel', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['statut', 'date_prevue']);
            $table->index(['type_operation', 'statut']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('operations');
    }
};