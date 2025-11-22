<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Drop existing table if exists
        Schema::dropIfExists('vehicules');
        
        // Create simplified vehicules table
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('numero_parc', 50);
            $table->string('immatriculation', 50);
            $table->enum('type', ['camion', 'remorque']);
            $table->boolean('actif')->default(true);
            $table->timestamps();
            
            $table->index(['type', 'actif']);
            $table->unique(['numero_parc', 'type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicules');
    }
};
