<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trip_request_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_request_id')->constrained()->cascadeOnDelete()->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('user_name');
            $table->string('role');
            $table->string('action');
            $table->string('from_value')->nullable();
            $table->string('to_value')->nullable();
            $table->text('reason')->nullable();
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_request_audits');
    }
};
