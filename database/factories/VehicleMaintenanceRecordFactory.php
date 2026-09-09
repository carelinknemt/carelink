<?php

namespace Database\Factories;

use App\Models\MaintenanceVehicle;
use App\Models\VehicleMaintenanceRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VehicleMaintenanceRecord>
 */
class VehicleMaintenanceRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'maintenance_vehicle_id' => MaintenanceVehicle::factory(),
            'maintenance_type' => $this->faker->randomElement(VehicleMaintenanceRecord::TYPES),
            'service_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'vehicle_mileage' => $this->faker->numberBetween(10_000, 120_000),
            'service_provider' => $this->faker->company(),
            'total_cost' => $this->faker->randomFloat(2, 40, 900),
            'next_service_date' => $this->faker->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'next_service_mileage' => $this->faker->numberBetween(10_000, 130_000),
            'notes' => $this->faker->sentence(),
        ];
    }
}
