<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detentions', function (Blueprint $table) {
            $table->integer('jours_client')->nullable()->after('jours_detention');
            $table->integer('jours_logistiga')->nullable()->after('jours_client');
        });
    }

    public function down(): void
    {
        Schema::table('detentions', function (Blueprint $table) {
            $table->dropColumn(['jours_client', 'jours_logistiga']);
        });
    }
};
