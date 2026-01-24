<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->timestamp('synced_to_facturation_at')->nullable()->after('observations');
            $table->boolean('sync_facturation_failed')->default(false)->after('synced_to_facturation_at');
        });
    }

    public function down(): void
    {
        Schema::table('sortie_conteneurs', function (Blueprint $table) {
            $table->dropColumn(['synced_to_facturation_at', 'sync_facturation_failed']);
        });
    }
};
