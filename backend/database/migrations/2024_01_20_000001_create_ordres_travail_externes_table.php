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
        Schema::create('ordres_travail_externes', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->string('external_id')->nullable()->index();
            $table->string('client_nom');
            $table->string('client_email')->nullable();
            $table->string('client_telephone')->nullable();
            $table->date('date');
            $table->string('type')->default('import');
            $table->enum('status', ['brouillon', 'en_cours', 'termine', 'facture', 'annule'])->default('brouillon');
            $table->string('reference')->nullable();
            $table->string('booking_number')->nullable();
            $table->string('vessel_name')->nullable();
            $table->json('containers')->nullable();
            $table->json('lignes_prestations')->nullable();
            $table->decimal('montant_total', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('source')->default('external'); // external, manual, api
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'created_at']);
            $table->index('booking_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordres_travail_externes');
    }
};
