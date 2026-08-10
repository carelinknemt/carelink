<?php

namespace Database\Factories;

use App\Models\TripRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TripRequest>
 */
class TripRequestFactory extends Factory
{
    protected $model = TripRequest::class;

    public function definition(): array
    {
        return [
            'booking_number' => 'CL-NEMT-'.str_pad((string) $this->faker->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),
            'passenger_first_name' => $this->faker->firstName(),
            'passenger_last_name' => $this->faker->lastName(),
            'payer' => $this->faker->randomElement(['Insurance / Medicaid', 'Private Pay', 'Facility Billing']),
            'transport_type' => $this->faker->randomElement(['Wheelchair Van', 'Ambulatory', 'Transit Shuttle', 'Gurney']),
            'service_type' => $this->faker->randomElement(['Wheelchair Transport', 'Ambulatory Sedan', 'Group Transit Shuttle']),
            'will_call' => $this->faker->boolean(20),
            'trip_date' => $this->faker->date(),
            'input_price' => $this->faker->numberBetween(35, 200),
            'pickup_address' => $this->faker->streetAddress().', Eureka, CA',
            'pickup_time' => $this->faker->randomElement(['07:00 AM', '09:30 AM', '02:15 PM']),
            'dropoff_address' => 'St. Joseph Hospital, Eureka, CA',
            'passenger_phone_number' => $this->faker->phoneNumber(),
            'passenger_email' => $this->faker->safeEmail(),
        ];
    }
}
