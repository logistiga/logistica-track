<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('detentions', function (Blueprint $table) {
            // Ajouter les colonnes manquantes pour les archives
            if (!Schema::hasColumn('detentions', 'jours_bat')) {
                $table->integer('jours_bat')->default(0)->after('jours_detention');
            }
            
            if (!Schema::hasColumn('detentions', 'jours_realises')) {
                $table->integer('jours_realises')->default(0)->after('jours_bat');
            }
            
            if (!Schema::hasColumn('detentions', 'numero_facture')) {
                $table->string('numero_facture', 50)->nullable()->after('observations');
            }
            
            if (!Schema::hasColumn('detentions', 'jours_client')) {
                $table->integer('jours_client')->default(0)->after('jours_detention');
            }
            
            if (!Schema::hasColumn('detentions', 'jours_logistiga')) {
                $table->integer('jours_logistiga')->default(0)->after('jours_client');
            }
        });
    }

    public function down()
    {
        Schema::table('detentions', function (Blueprint $table) {
            $table->dropColumn([
                'jours_bat',
                'jours_realises',
                'numero_facture',
                'jours_client',
                'jours_logistiga'
            ]);
        });
    }
};
