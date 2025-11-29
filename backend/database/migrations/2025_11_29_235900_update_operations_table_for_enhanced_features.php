<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('operations', function (Blueprint $table) {
            // Renommer date_prevue en date_debut
            $table->renameColumn('date_prevue', 'date_debut');
            
            // Ajouter les nouveaux champs
            $table->date('date_fin')->nullable()->after('date_debut');
            $table->integer('duree')->nullable()->after('date_fin')->comment('Durée en jours (calculée)');
            $table->decimal('tarif_journalier', 10, 2)->nullable()->after('duree')->comment('Pour locations');
            $table->string('lieu_depart')->nullable()->after('description');
            $table->string('destination')->nullable()->after('lieu_depart');
            
            // Modifier la colonne statut pour inclure les nouveaux statuts
            DB::statement("ALTER TABLE operations MODIFY COLUMN statut ENUM('planifiee', 'en-attente', 'en-cours', 'terminee', 'confirmee', 'annulee') DEFAULT 'planifiee'");
        });
    }

    public function down()
    {
        Schema::table('operations', function (Blueprint $table) {
            $table->renameColumn('date_debut', 'date_prevue');
            $table->dropColumn(['date_fin', 'duree', 'tarif_journalier', 'lieu_depart', 'destination']);
            
            DB::statement("ALTER TABLE operations MODIFY COLUMN statut ENUM('planifiee', 'en_cours', 'terminee', 'annulee') DEFAULT 'planifiee'");
        });
    }
};
