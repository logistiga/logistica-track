<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Supprimer les colonnes de gestion de véhicules si elles existent
        Schema::table('vehicules', function (Blueprint $table) {
            $columns = ['statut', 'prochaine_revision', 'derniere_revision', 'kilometrage'];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('vehicules', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    public function down()
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
};