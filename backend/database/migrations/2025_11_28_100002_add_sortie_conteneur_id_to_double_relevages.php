<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('double_relevages', function (Blueprint $table) {
            $table->foreignId('sortie_conteneur_id')->nullable()->after('id')->constrained('sortie_conteneurs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('double_relevages', function (Blueprint $table) {
            $table->dropForeign(['sortie_conteneur_id']);
            $table->dropColumn('sortie_conteneur_id');
        });
    }
};
