<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('facturations', function (Blueprint $table) {
            $table->id();
            $table->string('numero_facture')->unique();
            $table->foreignId('sortie_conteneur_id')->constrained('sortie_conteneurs');
            $table->date('date_facture');
            $table->date('date_echeance');
            $table->decimal('montant_transport', 10, 2);
            $table->decimal('montant_detention', 10, 2)->default(0);
            $table->decimal('montant_autres', 10, 2)->default(0);
            $table->decimal('montant_total', 10, 2);
            $table->decimal('montant_tva', 10, 2)->default(0);
            $table->decimal('montant_ttc', 10, 2);
            $table->enum('statut', ['brouillon', 'envoyee', 'payee', 'annulee'])->default('brouillon');
            $table->date('date_paiement')->nullable();
            $table->string('mode_paiement')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['statut', 'date_facture']);
            $table->index(['date_echeance', 'statut']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('facturations');
    }
};