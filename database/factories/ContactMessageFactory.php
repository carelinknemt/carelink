<?php

namespace Database\Factories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    protected $model = ContactMessage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->optional()->numerify('+1 707-555-####'),
            'message' => $this->faker->sentence(12),
        ];
    }

    public function read(): static
    {
        return $this->state(fn (): array => [
            'status' => ContactMessage::STATUS_READ,
            'read_at' => now()->subDay(),
        ]);
    }
}
