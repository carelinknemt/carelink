<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ride_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->string('passenger_name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('service_type');
            $table->string('pickup_address');
            $table->string('pickup_county');
            $table->string('destination_address');
            $table->string('destination_county');
            $table->date('ride_date');
            $table->string('ride_time');
            $table->boolean('is_round_trip')->default(false);
            $table->boolean('wheelchair_needed')->default(false);
            $table->boolean('oxygen_needed')->default(false);
            $table->text('additional_notes')->nullable();
            $table->string('payment_method');
            $table->decimal('estimated_cost', 8, 2)->nullable();
            $table->string('status')->default('PENDING_DISPATCH')->index();
            $table->string('bambi_dispatch_ref')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ride_bookings');
    }
};
