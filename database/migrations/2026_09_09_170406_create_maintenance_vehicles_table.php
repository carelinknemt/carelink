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
        Schema::create('maintenance_vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('capacity');
            $table->string('vin')->nullable();
            $table->string('plate')->nullable();
            $table->decimal('hourly_rate_est', 8, 2)->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_vehicles');
    }
};
