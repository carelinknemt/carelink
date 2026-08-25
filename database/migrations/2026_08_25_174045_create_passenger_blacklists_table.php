<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('passenger_blacklists', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->string('phone_digits', 10)->nullable();
            $table->text('reason');
            $table->foreignId('blacklisted_by')->constrained('users');
            $table->timestamps();

            $table->index('email');
            $table->index('phone_digits');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('passenger_blacklists');
    }
};
