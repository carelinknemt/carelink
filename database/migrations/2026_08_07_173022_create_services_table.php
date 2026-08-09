<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('title');
            $table->text('short_description');
            $table->text('full_description');
            $table->json('benefits');
            $table->string('image');
            $table->string('icon_name');
            $table->json('suitable_for');
            $table->json('typical_destinations');
            $table->decimal('base_rate', 8, 2)->default(0);
            $table->decimal('mileage_rate', 8, 2)->default(0);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
