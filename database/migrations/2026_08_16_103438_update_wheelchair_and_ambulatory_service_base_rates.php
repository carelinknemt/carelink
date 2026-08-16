<?php

use App\Models\Service;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align the public pricing rule: a $45 base fare (first five miles
     * included) for wheelchair service and a $20 base fare for ambulatory
     * (taxi) service.
     */
    public function up(): void
    {
        Service::where('slug', 'wheelchair-transport')->update(['base_rate' => 45]);
        Service::where('slug', 'ambulatory-sedan')->update(['base_rate' => 20]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Service::where('slug', 'wheelchair-transport')->update(['base_rate' => 55]);
        Service::where('slug', 'ambulatory-sedan')->update(['base_rate' => 35]);
    }
};
