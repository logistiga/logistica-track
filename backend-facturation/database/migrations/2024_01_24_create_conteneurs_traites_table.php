<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conteneurs_traites', function (Blueprint $table) {
            $table->id();
            
            // Données du conteneur
            $table->string('numero_conteneur', 20);
            $table->string('numero_bl', 100)->nullable();
            $table->string('nom_client', 255);
            $table->string('code_armateur', 50)->nullable();
            $table->string('type_conteneur', 10)->nullable();
            
            // Dates d'opération
            $table->date('date_sortie')->nullable();
            $table->date('date_retour')->nullable();
            
            // Détails opérationnels
            $table->string('chauffeur', 255)->nullable();
            $table->string('destination', 255)->nullable();
            $table->text('observations')->nullable();
            
            // Détention
            $table->integer('jours_detention')->default(0);
            $table->decimal('montant_detention', 12, 2)->default(0);
            
            // Traçabilité
            $table->unsignedBigInteger('source_id')->nullable()->comment('ID dans app OPS');
            $table->string('status', 20)->default('recu'); // recu, en_traitement, facture
            $table->timestamp('received_at')->nullable();
            
            // Lien facturation
            $table->unsignedBigInteger('facture_id')->nullable();
            $table->timestamp('factured_at')->nullable();
            
            $table->timestamps();
            
            // Index pour recherches fréquentes
            $table->index('numero_conteneur');
            $table->index('nom_client');
            $table->index('status');
            $table->index('received_at');
            $table->unique(['numero_conteneur', 'source_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conteneurs_traites');
    }
};
