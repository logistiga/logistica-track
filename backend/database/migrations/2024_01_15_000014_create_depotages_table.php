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
        Schema::create('depotages', function (Blueprint $table) {
            $table->id();
            $table->string('nom_client');
            $table->string('numero_conteneur');
            $table->string('provenance');
            $table->date('date_depotage');
            $table->boolean('camion_proprietaire')->default(true);
            $table->string('plaque_camion');
            $table->string('plaque_remorque');
            $table->string('type_marchandise');
            $table->decimal('prix_depotage', 10, 2);
            $table->enum('statut', ['en_cours', 'termine', 'annule'])->default('en_cours');
            $table->text('observations')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // Index pour performance
            $table->index(['statut', 'date_depotage']);
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
        Schema::dropIfExists('depotages');
    }
};