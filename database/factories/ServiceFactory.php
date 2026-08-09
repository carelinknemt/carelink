<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(3),
            'category' => $this->faker->randomElement(['MEDICAL', 'NON_MEDICAL', 'SPECIALTY']),
            'title' => $this->faker->words(3, true),
            'short_description' => $this->faker->sentence(8),
            'full_description' => $this->faker->paragraph(2),
            'benefits' => [$this->faker->sentence(6), $this->faker->sentence(6)],
            'image' => '/images/wheelchair.webp',
            'icon_name' => 'Wheelchair',
            'suitable_for' => [$this->faker->word(), $this->faker->word()],
            'typical_destinations' => [$this->faker->city(), $this->faker->city()],
            'base_rate' => $this->faker->numberBetween(35, 85),
            'mileage_rate' => $this->faker->randomFloat(1, 2.5, 4.5),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
