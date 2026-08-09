<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        return [
            'question' => $this->faker->sentence(8).'?',
            'answer' => $this->faker->paragraph(2),
            'category' => $this->faker->randomElement(['BOOKING & SERVICE', 'COVERAGE & COUNTIES', 'PAYMENT & INSURANCE']),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
