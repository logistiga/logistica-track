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
        Schema::create('stockages', function (Blueprint $table) {
            $table->id();
            $table->string('nom_client');
            $table->string('numero_conteneur')->unique();
            $table->string('provenance');
            $table->date('date_arrivee');
            $table->boolean('camion_proprietaire')->default(true);
            $table->string('plaque_camion');
            $table->string('plaque_remorque');
            $table->integer('jours_gratuits');
            $table->decimal('prix_par_jour', 10, 2);
            $table->enum('statut', ['stocke', 'en_attente_sortie', 'sorti'])->default('stocke');
            $table->date('date_sortie')->nullable();
            $table->text('observations')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // Index pour performance
            $table->index(['statut', 'date_arrivee']);
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
        Schema::dropIfExists('stockages');
    }
};