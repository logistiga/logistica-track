<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('armateurs', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('nom');
            $table->string('type_conteneur', 100);
            $table->integer('jours_gratuits')->default(0);
            $table->decimal('prix_par_jour', 10, 2)->default(0);
            $table->string('contact_nom')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
            
            $table->index(['code', 'actif']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('armateurs');
    }
};