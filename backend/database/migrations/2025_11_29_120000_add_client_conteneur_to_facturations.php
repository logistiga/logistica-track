<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facturations', function (Blueprint $table) {
            $table->string('numero_conteneur')->nullable()->after('type_operation');
            $table->string('nom_client')->nullable()->after('numero_conteneur');
        });
    }

    public function down(): void
    {
        Schema::table('facturations', function (Blueprint $table) {
            $table->dropColumn(['numero_conteneur', 'nom_client']);
        });
    }
};
