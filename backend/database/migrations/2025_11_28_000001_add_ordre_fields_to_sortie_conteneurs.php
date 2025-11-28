<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->string('numero_ordre')->nullable()->after('numero_bl');
            $table->string('pv_sortie')->nullable()->after('numero_ordre');
            $table->string('pv_rentree_port')->nullable()->after('pv_sortie');
        });
    }

    public function down()
    {
        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->dropColumn(['numero_ordre', 'pv_sortie', 'pv_rentree_port']);
        });
    }
};
