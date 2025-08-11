<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->string('type_email');
            $table->string('destinataire_email');
            $table->string('destinataire_nom')->nullable();
            $table->string('sujet');
            $table->text('contenu');
            $table->enum('statut', ['en_attente', 'envoye', 'echec', 'annule'])->default('en_attente');
            $table->timestamp('date_envoi')->nullable();
            $table->text('erreur_message')->nullable();
            $table->foreignId('sortie_conteneur_id')->nullable()->constrained('sortie_conteneurs');
            $table->foreignId('user_id')->constrained('users');
            $table->json('pieces_jointes')->nullable();
            $table->timestamps();
            
            $table->index(['statut', 'date_envoi']);
            $table->index(['type_email', 'statut']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('emails');
    }
};