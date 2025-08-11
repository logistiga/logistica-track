<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('numero_parc', 50);
            $table->string('immatriculation', 50);
            $table->enum('type', ['camion', 'remorque']);
            $table->enum('statut', ['disponible', 'en_mission', 'maintenance'])->default('disponible');
            $table->string('marque')->nullable();
            $table->string('modele')->nullable();
            $table->year('annee')->nullable();
            $table->decimal('capacite', 8, 2)->nullable();
            $table->date('derniere_revision')->nullable();
            $table->date('prochaine_revision')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['type', 'statut']);
            $table->unique(['numero_parc', 'type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicules');
    }
};