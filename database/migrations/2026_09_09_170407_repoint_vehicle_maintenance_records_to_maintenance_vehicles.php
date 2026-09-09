<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Repoint vehicle maintenance records from the public fleet table to the
     * dedicated maintenance_vehicles table so the dashboard list is decoupled
     * from the CMS-managed fleet.
     */
    public function up(): void
    {
        Schema::table('vehicle_maintenance_records', function (Blueprint $table) {
            $table->foreignId('maintenance_vehicle_id')->nullable()->after('id');
        });

        $map = [];
        foreach (DB::table('fleet_vehicles')->orderBy('id')->get() as $vehicle) {
            $map[$vehicle->id] = DB::table('maintenance_vehicles')->insertGetId([
                'name' => $vehicle->name,
                'type' => $vehicle->type,
                'capacity' => $vehicle->capacity,
                'vin' => $vehicle->vin,
                'plate' => $vehicle->plate,
                'hourly_rate_est' => $vehicle->hourly_rate_est,
                'description' => $vehicle->description,
                'sort_order' => $vehicle->sort_order,
                'active' => $vehicle->active,
                'created_at' => $vehicle->created_at,
                'updated_at' => $vehicle->updated_at,
            ]);
        }

        DB::table('vehicle_maintenance_records')->orderBy('id')->each(function ($record) use ($map) {
            DB::table('vehicle_maintenance_records')->where('id', $record->id)->update([
                'maintenance_vehicle_id' => $map[$record->fleet_vehicle_id] ?? null,
            ]);
        });

        Schema::table('vehicle_maintenance_records', function (Blueprint $table) {
            $table->dropForeign(['fleet_vehicle_id']);
            $table->dropIndex(['fleet_vehicle_id', 'service_date']);
            $table->dropColumn('fleet_vehicle_id');
        });

        Schema::table('vehicle_maintenance_records', function (Blueprint $table) {
            $table->unsignedBigInteger('maintenance_vehicle_id')->nullable(false)->change();
            $table->foreign('maintenance_vehicle_id')->references('id')->on('maintenance_vehicles')->cascadeOnDelete();
            $table->index(['maintenance_vehicle_id', 'service_date']);
        });
    }

    /**
     * Reverse the repoint, moving records back to the public fleet table.
     */
    public function down(): void
    {
        Schema::table('vehicle_maintenance_records', function (Blueprint $table) {
            $table->foreignId('fleet_vehicle_id')->nullable()->after('id');
        });

        $map = [];
        foreach (DB::table('maintenance_vehicles')->orderBy('id')->get() as $vehicle) {
            $existing = DB::table('fleet_vehicles')->where('name', $vehicle->name)->first();
            $map[$vehicle->id] = $existing->id ?? DB::table('fleet_vehicles')->insertGetId([
                'name' => $vehicle->name,
                'type' => $vehicle->type,
                'capacity' => $vehicle->capacity,
                'vin' => $vehicle->vin,
                'plate' => $vehicle->plate,
                'features' => '[]',
                'description' => $vehicle->description,
                'image' => '',
                'accessibility_specs' => '[]',
                'hourly_rate_est' => $vehicle->hourly_rate_est,
                'sort_order' => $vehicle->sort_order,
                'active' => $vehicle->active,
                'created_at' => $vehicle->created_at,
                'updated_at' => $vehicle->updated_at,
            ]);
        }

        DB::table('vehicle_maintenance_records')->orderBy('id')->each(function ($record) use ($map) {
            DB::table('vehicle_maintenance_records')->where('id', $record->id)->update([
                'fleet_vehicle_id' => $map[$record->maintenance_vehicle_id] ?? null,
            ]);
        });

        Schema::table('vehicle_maintenance_records', function (Blueprint $table) {
            $table->dropForeign(['maintenance_vehicle_id']);
            $table->dropIndex(['maintenance_vehicle_id', 'service_date']);
            $table->dropColumn('maintenance_vehicle_id');
        });

        Schema::table('vehicle_maintenance_records', function (Blueprint $table) {
            $table->unsignedBigInteger('fleet_vehicle_id')->nullable(false)->change();
            $table->foreign('fleet_vehicle_id')->references('id')->on('fleet_vehicles')->cascadeOnDelete();
            $table->index(['fleet_vehicle_id', 'service_date']);
        });
    }
};
