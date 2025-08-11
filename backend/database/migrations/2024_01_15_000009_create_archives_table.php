<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->string('type_archive');
            $table->string('reference_originale');
            $table->json('donnees_originales');
            $table->date('date_archivage');
            $table->string('motif_archivage');
            $table->foreignId('archive_par')->constrained('users');
            $table->text('commentaires')->nullable();
            $table->timestamps();
            
            $table->index(['type_archive', 'date_archivage']);
            $table->index(['reference_originale']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('archives');
    }
};