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
            if (!Schema::hasColumn('operations', 'date_debut_execution')) {
                $table->datetime('date_debut_execution')->nullable()->after('date_debut');
            }
            
            if (!Schema::hasColumn('operations', 'date_fin_execution')) {
                $table->datetime('date_fin_execution')->nullable()->after('date_debut_execution');
            }
        });

        // Uniformiser les valeurs de statut avec underscores
        DB::table('operations')->where('statut', 'en-attente')->update(['statut' => 'en_attente']);
        DB::table('operations')->where('statut', 'en-cours')->update(['statut' => 'en_cours']);
    }

    public function down()
    {
        Schema::table('operations', function (Blueprint $table) {
            $table->dropColumn(['date_debut_execution', 'date_fin_execution']);
        });
    }
};
