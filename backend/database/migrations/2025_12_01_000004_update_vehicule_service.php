<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Migration pour mettre à jour tous les véhicules existants avec le statut 'disponible'
     */
    public function up()
    {
        // Mettre à jour tous les véhicules actifs sans statut
        DB::table('vehicules')
            ->where('actif', true)
            ->whereNull('statut')
            ->update(['statut' => 'disponible']);
            
        // Mettre à jour tous les véhicules inactifs
        DB::table('vehicules')
            ->where('actif', false)
            ->update(['statut' => 'maintenance']);
    }

    public function down()
    {
        // Pas de rollback nécessaire
    }
};
