<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('double_relevages', function (Blueprint $table) {
            $table->id();
            $table->string('nom_client');
            $table->string('numero_conteneur');
            $table->string('provenance');
            
            // Camion ameneur
            $table->boolean('camion_ameneur_proprietaire')->default(true);
            $table->string('camion_ameneur_plaque');
            $table->string('camion_ameneur_remorque');
            
            // Camion récupérateur
            $table->boolean('camion_recuperateur_proprietaire')->default(false);
            $table->string('camion_recuperateur_plaque');
            $table->string('camion_recuperateur_remorque');
            
            $table->decimal('montant_operation', 10, 2);
            $table->enum('statut', ['en_attente', 'confirme', 'annule'])->default('en_attente');
            $table->date('date_creation');
            $table->date('date_confirmation')->nullable();
            $table->text('observations')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // Index pour performance
            $table->index(['statut', 'date_creation']);
            $table->index('numero_conteneur');
            $table->index('nom_client');

            // Foreign keys
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('double_relevages');
    }
};