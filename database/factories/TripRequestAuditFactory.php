<?php

namespace Database\Factories;

use App\Models\TripRequest;
use App\Models\TripRequestAudit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TripRequestAudit>
 */
class TripRequestAuditFactory extends Factory
{
    protected $model = TripRequestAudit::class;

    public function definition(): array
    {
        return [
            'trip_request_id' => TripRequest::factory(),
            'user_name' => $this->faker->name(),
            'role' => $this->faker->randomElement(['dispatcher', 'admin']),
            'action' => TripRequestAudit::ACTION_UPDATED,
            'from_value' => null,
            'to_value' => null,
            'reason' => null,
        ];
    }
}
