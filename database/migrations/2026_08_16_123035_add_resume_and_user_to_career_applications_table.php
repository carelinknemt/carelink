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
        Schema::table('career_applications', function (Blueprint $table) {
            $table->string('resume_path')->nullable()->after('cover_letter');
            $table->string('resume_name')->nullable()->after('resume_path');
            $table->foreignId('user_id')->nullable()->after('career_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('career_applications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['resume_path', 'resume_name']);
        });
    }
};
