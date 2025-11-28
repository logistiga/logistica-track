<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Supprimer les doublons en gardant le plus récent pour chaque sortie_id
        DB::statement("
            DELETE pa1 FROM prime_archives pa1
            INNER JOIN prime_archives pa2 
            WHERE 
                pa1.sortie_id = pa2.sortie_id
                AND pa1.id < pa2.id
        ");

        // Ajouter une contrainte UNIQUE sur sortie_id pour empêcher les futurs doublons
        Schema::table('prime_archives', function (Blueprint $table) {
            $table->unique('sortie_id');
        });
    }

    public function down()
    {
        Schema::table('prime_archives', function (Blueprint $table) {
            $table->dropUnique(['sortie_id']);
        });
    }
};
