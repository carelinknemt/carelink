<?php

namespace Database\Factories;

use App\Models\Career;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Career>
 */
class CareerFactory extends Factory
{
    protected $model = Career::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->jobTitle(),
            'location' => 'Eureka, CA Headquarters',
            'employment_type' => $this->faker->randomElement(['Full-Time', 'Part-Time']),
            'summary' => $this->faker->paragraph(2),
            'requirements' => [$this->faker->sentence(6), $this->faker->sentence(6)],
            'sort_order' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
