<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facturations', function (Blueprint $table) {
            // Add columns in order - first add nom_client and numero_conteneur if they don't exist
            if (!Schema::hasColumn('facturations', 'numero_conteneur')) {
                $table->string('numero_conteneur')->nullable()->after('type_operation');
            }
            if (!Schema::hasColumn('facturations', 'nom_client')) {
                $table->string('nom_client')->nullable()->after('numero_conteneur');
            }
            // Then add details_operation
            $table->json('details_operation')->nullable()->after('nom_client');
        });
    }

    public function down(): void
    {
        Schema::table('facturations', function (Blueprint $table) {
            if (Schema::hasColumn('facturations', 'details_operation')) {
                $table->dropColumn('details_operation');
            }
        });
    }
};
