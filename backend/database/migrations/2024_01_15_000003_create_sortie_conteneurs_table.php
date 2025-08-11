<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sortie_conteneurs', function (Blueprint $table) {
            $table->id();
            $table->string('numero_conteneur', 100);
            $table->string('numero_bl', 100);
            $table->string('code_armateur', 50);
            $table->foreignId('camion_id')->constrained('vehicules');
            $table->foreignId('remorque_id')->constrained('vehicules');
            $table->decimal('prime_chauffeur', 10, 2)->default(0);
            $table->string('nom_client');
            $table->enum('destination', ['base', 'client']);
            $table->text('adresse_client')->nullable();
            $table->enum('type_destination', ['bad', 'detention']);
            $table->integer('jours_bad')->nullable();
            $table->date('date_fin_franchise')->nullable();
            $table->string('nom_transitaire');
            $table->date('date_sortie');
            $table->date('date_retour')->nullable();
            $table->enum('statut', ['en_cours', 'livre_client', 'a_la_base', 'retourne_port'])->default('en_cours');
            
            // Champs pour le retour
            $table->foreignId('camion_retour_id')->nullable()->constrained('vehicules');
            $table->foreignId('remorque_retour_id')->nullable()->constrained('vehicules');
            $table->text('observations')->nullable();
            
            // Audit
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Index pour les performances
            $table->index(['statut', 'date_sortie']);
            $table->index(['code_armateur', 'date_sortie']);
            $table->index(['numero_conteneur']);
            
            // Contraintes
            $table->foreign('code_armateur')->references('code')->on('armateurs');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sortie_conteneurs');
    }
};