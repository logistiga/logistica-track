<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('prime_archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sortie_id')->constrained('sortie_conteneurs')->onDelete('cascade');
            $table->string('numero_conteneur');
            $table->string('camion')->nullable();
            $table->string('chauffeur')->nullable();
            $table->date('date_sortie');
            $table->date('date_retour')->nullable();
            $table->decimal('montant_prime', 10, 2);
            $table->string('nom_client')->nullable();
            $table->string('destination')->nullable();
            $table->text('observations')->nullable();
            $table->date('date_paiement');
            $table->string('numero_semaine');
            $table->foreignId('paye_par')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('prime_archives');
    }
};
