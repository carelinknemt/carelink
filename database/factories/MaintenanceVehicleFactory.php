<?php

namespace Database\Factories;

use App\Models\MaintenanceVehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceVehicle>
 */
class MaintenanceVehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(4, true),
            'type' => $this->faker->randomElement(['AMBULATORY', 'WHEELCHAIR', 'TRANSIT_SHUTTLE']),
            'capacity' => '1 Wheelchair + 3 Ambulatory Passengers',
            'vin' => $this->faker->regexify('[A-HJ-NPR-Z0-9]{17}'),
            'plate' => $this->faker->regexify('[A-Z0-9]{7}'),
            'description' => $this->faker->paragraph(2),
            'hourly_rate_est' => $this->faker->numberBetween(55, 110),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
