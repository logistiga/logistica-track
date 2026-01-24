<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ordres_travail_externes', function (Blueprint $table) {
            $table->string('armateur_nom')->nullable()->after('transitaire_nom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordres_travail_externes', function (Blueprint $table) {
            $table->dropColumn('armateur_nom');
        });
    }
};
