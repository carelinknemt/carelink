<?php

namespace Database\Factories;

use App\Models\BookingCharge;
use App\Models\TripRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BookingCharge>
 */
class BookingChargeFactory extends Factory
{
    protected $model = BookingCharge::class;

    public function definition(): array
    {
        return [
            'trip_request_id' => TripRequest::factory(),
            'amount_cents' => $this->faker->numberBetween(500, 20000),
            'status' => BookingCharge::STATUS_PENDING,
            'token' => Str::random(40),
            'note' => null,
            'created_by' => User::factory(),
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => BookingCharge::STATUS_PAID,
            'paid_at' => now(),
        ]);
    }
}
