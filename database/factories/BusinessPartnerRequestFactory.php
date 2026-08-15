<?php

namespace Database\Factories;

use App\Models\BusinessPartnerRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessPartnerRequest>
 */
class BusinessPartnerRequestFactory extends Factory
{
    protected $model = BusinessPartnerRequest::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => $this->faker->company(),
            'contact_name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => '+1 707-555-'.str_pad((string) $this->faker->numberBetween(1000, 9999), 4, '0', STR_PAD_LEFT),
            'business_type' => $this->faker->randomElement(BusinessPartnerRequest::BUSINESS_TYPES),
            'estimated_monthly_trips' => $this->faker->optional()->numberBetween(10, 500),
            'message' => $this->faker->optional()->sentence(),
        ];
    }
}
