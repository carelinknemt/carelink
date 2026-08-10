<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trip_requests', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->string('passenger_first_name');
            $table->string('passenger_last_name');
            $table->string('payer');
            $table->string('transport_type');
            $table->string('service_type');
            $table->boolean('will_call')->default(false);
            $table->date('trip_date');
            $table->decimal('input_price', 8, 2);
            $table->string('pickup_address');
            $table->string('pickup_time');
            $table->string('dropoff_address');
            $table->string('passenger_phone_number')->nullable();
            $table->string('passenger_email')->nullable();
            $table->date('passenger_dob')->nullable();
            $table->string('passenger_gender')->nullable();
            $table->decimal('passenger_weight', 6, 1)->nullable();
            $table->boolean('passenger_is_bariatric')->default(false);
            $table->text('passenger_notes')->nullable();
            $table->unsignedInteger('attendants_needed')->default(0);
            $table->unsignedInteger('additional_passengers')->default(0);
            $table->boolean('oxygen_required')->default(false);
            $table->unsignedInteger('oxygen_liters_per_min')->nullable();
            $table->string('requested_by_name')->nullable();
            $table->string('requested_by_phone_number')->nullable();
            $table->text('dispatcher_notes')->nullable();
            $table->string('pickup_address_details')->nullable();
            $table->boolean('pickup_stairs')->default(false);
            $table->string('pickup_stair_equipment')->nullable();
            $table->text('pickup_driver_notes')->nullable();
            $table->string('pickup_contact_name')->nullable();
            $table->string('pickup_contact_phone_number')->nullable();
            $table->string('load_time')->nullable();
            $table->string('dropoff_address_details')->nullable();
            $table->string('appointment_time')->nullable();
            $table->boolean('dropoff_stairs')->default(false);
            $table->string('dropoff_stair_equipment')->nullable();
            $table->text('dropoff_driver_notes')->nullable();
            $table->string('dropoff_contact_name')->nullable();
            $table->string('dropoff_contact_phone_number')->nullable();
            $table->string('unload_time')->nullable();
            $table->boolean('must_provide_wheelchair')->default(false);
            $table->boolean('has_infectious_disease')->default(false);
            $table->string('tag_list')->nullable();
            $table->string('status')->default('PENDING_DISPATCH')->index();
            $table->string('trip_request_csv_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_requests');
    }
};
