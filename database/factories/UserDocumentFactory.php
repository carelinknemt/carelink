<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserDocument>
 */
class UserDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => UserDocument::TYPE_CUSTOM,
            'label' => fake()->word(),
            'file_path' => 'documents/'.fake()->uuid().'.pdf',
            'file_name' => 'document.pdf',
            'file_size' => 1024,
        ];
    }
}
