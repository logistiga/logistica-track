<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('facturations', function (Blueprint $table) {
            $table->enum('type_operation', ['stockage', 'double_relevage', 'depotage'])
                  ->after('sortie_conteneur_id')
                  ->nullable();
        });
    }

    public function down()
    {
        Schema::table('facturations', function (Blueprint $table) {
            $table->dropColumn('type_operation');
        });
    }
};
