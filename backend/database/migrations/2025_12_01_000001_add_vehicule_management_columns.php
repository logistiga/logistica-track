<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('vehicules', function (Blueprint $table) {
            if (!Schema::hasColumn('vehicules', 'statut')) {
                $table->enum('statut', ['disponible', 'en_mission', 'maintenance'])
                      ->default('disponible')
                      ->after('actif');
            }
            
            if (!Schema::hasColumn('vehicules', 'prochaine_revision')) {
                $table->date('prochaine_revision')->nullable()->after('statut');
            }
            
            if (!Schema::hasColumn('vehicules', 'derniere_revision')) {
                $table->date('derniere_revision')->nullable()->after('prochaine_revision');
            }
            
            if (!Schema::hasColumn('vehicules', 'kilometrage')) {
                $table->integer('kilometrage')->default(0)->after('derniere_revision');
            }
        });
    }

    public function down()
    {
        Schema::table('vehicules', function (Blueprint $table) {
            $table->dropColumn(['statut', 'prochaine_revision', 'derniere_revision', 'kilometrage']);
        });
    }
};
