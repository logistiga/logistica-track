<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detentions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sortie_conteneur_id')->constrained('sortie_conteneurs');
            $table->date('date_debut_detention');
            $table->date('date_fin_detention')->nullable();
            $table->integer('jours_detention');
            $table->decimal('cout_par_jour', 10, 2);
            $table->decimal('cout_total', 10, 2);
            $table->enum('responsabilite', ['client', 'logistiga', 'partagee']);
            $table->text('motif_detention');
            $table->enum('statut', ['active', 'resolue', 'contestee'])->default('active');
            $table->text('observations')->nullable();
            $table->timestamps();
            
            $table->index(['statut', 'date_debut_detention']);
            $table->index(['responsabilite', 'statut']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('detentions');
    }
};