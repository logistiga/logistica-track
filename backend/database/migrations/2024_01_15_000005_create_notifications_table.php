<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('titre');
            $table->text('message');
            $table->enum('priorite', ['basse', 'normale', 'haute', 'critique'])->default('normale');
            $table->enum('statut', ['non_lu', 'lu', 'archive'])->default('non_lu');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->json('metadata')->nullable();
            $table->timestamp('lu_le')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'statut']);
            $table->index(['type', 'priorite']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};