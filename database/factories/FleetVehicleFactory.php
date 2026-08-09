<?php

namespace Database\Factories;

use App\Models\FleetVehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FleetVehicle>
 */
class FleetVehicleFactory extends Factory
{
    protected $model = FleetVehicle::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(4, true),
            'type' => $this->faker->randomElement(['AMBULATORY', 'WHEELCHAIR', 'TRANSIT_SHUTTLE']),
            'capacity' => '1 Wheelchair + 3 Ambulatory Passengers',
            'features' => [$this->faker->sentence(4), $this->faker->sentence(4)],
            'description' => $this->faker->paragraph(2),
            'image' => '/images/carelink_hero_van_1785061463464.jpg',
            'accessibility_specs' => ['ADA Compliant', 'Lift capacity: 800 lbs'],
            'hourly_rate_est' => $this->faker->numberBetween(55, 110),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
