<?php

namespace Database\Factories;

use App\Models\PassengerBlacklist;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PassengerBlacklist>
 */
class PassengerBlacklistFactory extends Factory
{
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'phone_digits' => null,
            'reason' => fake()->sentence(12),
            'blacklisted_by' => User::factory(),
        ];
    }

    public function emailOnly(): static
    {
        return $this->state(fn () => [
            'phone_digits' => null,
        ]);
    }

    public function phoneOnly(): static
    {
        return $this->state(fn () => [
            'email' => null,
            'phone_digits' => fake()->numerify('##########'),
        ]);
    }

    public function both(): static
    {
        return $this->state(fn () => [
            'email' => fake()->unique()->safeEmail(),
            'phone_digits' => fake()->numerify('##########'),
        ]);
    }
}
