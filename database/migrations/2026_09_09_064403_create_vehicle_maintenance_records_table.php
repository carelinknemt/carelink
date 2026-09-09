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
        Schema::create('vehicle_maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fleet_vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('maintenance_type')->default('oil_change');
            $table->date('service_date');
            $table->unsignedInteger('vehicle_mileage')->nullable();
            $table->string('service_provider')->nullable();
            $table->decimal('total_cost', 10, 2)->default(0);
            $table->date('next_service_date')->nullable();
            $table->unsignedInteger('next_service_mileage')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['fleet_vehicle_id', 'service_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_maintenance_records');
    }
};
