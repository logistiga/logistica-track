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
            // Supprimer l'ancienne colonne date_prevue (date_debut existe déjà)
            if (Schema::hasColumn('operations', 'date_prevue')) {
                $table->dropColumn('date_prevue');
            }
            
            // Ajouter les nouveaux champs uniquement s'ils n'existent pas
            if (!Schema::hasColumn('operations', 'duree')) {
                $table->integer('duree')->nullable()->after('date_fin')->comment('Durée en jours (calculée)');
            }
            if (!Schema::hasColumn('operations', 'tarif_journalier')) {
                $table->decimal('tarif_journalier', 10, 2)->nullable()->after('duree')->comment('Pour locations');
            }
            if (!Schema::hasColumn('operations', 'lieu_depart')) {
                $table->string('lieu_depart')->nullable()->after('description');
            }
            if (!Schema::hasColumn('operations', 'destination')) {
                $table->string('destination')->nullable()->after('lieu_depart');
            }
            
            // Modifier la colonne statut pour inclure les nouveaux statuts
            DB::statement("ALTER TABLE operations MODIFY COLUMN statut ENUM('planifiee', 'en-attente', 'en-cours', 'terminee', 'confirmee', 'annulee') DEFAULT 'planifiee'");
        });
    }

    public function down()
    {
        Schema::table('operations', function (Blueprint $table) {
            // Recréer date_prevue si elle a été supprimée
            if (!Schema::hasColumn('operations', 'date_prevue')) {
                $table->datetime('date_prevue')->after('statut');
            }
            
            // Supprimer seulement les colonnes qui ont été ajoutées
            $table->dropColumn(['duree', 'tarif_journalier', 'lieu_depart', 'destination']);
            
            DB::statement("ALTER TABLE operations MODIFY COLUMN statut ENUM('planifiee', 'en_cours', 'terminee', 'annulee') DEFAULT 'planifiee'");
        });
    }
};
