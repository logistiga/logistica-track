<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Si la colonne pv_rentree existe, la renommer
        if (Schema::hasColumn('sortie_conteneurs', 'pv_rentree')) {
            Schema::table('sortie_conteneurs', function (Blueprint $table) {
                $table->renameColumn('pv_rentree', 'pv_rentree_port');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('sortie_conteneurs', 'pv_rentree_port')) {
            Schema::table('sortie_conteneurs', function (Blueprint $table) {
                $table->renameColumn('pv_rentree_port', 'pv_rentree');
            });
        }
    }
};
