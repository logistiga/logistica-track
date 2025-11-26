<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->enum('statut_prime', ['en_attente', 'paye'])->default('en_attente')->after('prime_chauffeur');
        });
    }

    public function down()
    {
        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->dropColumn('statut_prime');
        });
    }
};
