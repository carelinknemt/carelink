<?php

namespace Database\Factories;

use App\Models\RideBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RideBooking>
 */
class RideBookingFactory extends Factory
{
    protected $model = RideBooking::class;

    public function definition(): array
    {
        return [
            'booking_number' => 'CL-'.$this->faker->unique()->numberBetween(1000, 9999),
            'passenger_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'service_type' => $this->faker->randomElement(['Ambulatory Sedan', 'Wheelchair Van', 'Gurney Stretcher', 'Transit Shuttle']),
            'pickup_address' => $this->faker->streetAddress().', Eureka, CA',
            'pickup_county' => 'Humboldt',
            'destination_address' => 'St. Joseph Hospital, Eureka, CA',
            'destination_county' => 'Humboldt',
            'ride_date' => $this->faker->date(),
            'ride_time' => $this->faker->randomElement(['09:30 AM', '11:00 AM', '02:15 PM']),
            'is_round_trip' => $this->faker->boolean(),
            'wheelchair_needed' => $this->faker->boolean(),
            'oxygen_needed' => $this->faker->boolean(20),
            'additional_notes' => $this->faker->sentence(),
            'payment_method' => $this->faker->randomElement(['Insurance / Medicaid', 'Facility Billing', 'Credit Card (Stripe/Square)', 'Private Pay Cash']),
            'estimated_cost' => $this->faker->numberBetween(50, 150),
            'status' => $this->faker->randomElement(RideBooking::STATUSES),
            'bambi_dispatch_ref' => null,
        ];
    }
}
