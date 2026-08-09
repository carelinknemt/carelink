<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    protected $model = TeamMember::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'role' => $this->faker->jobTitle(),
            'title' => $this->faker->jobTitle(),
            'bio' => $this->faker->paragraph(2),
            'image' => null,
            'certifications' => [$this->faker->words(3, true)],
            'experience_years' => $this->faker->numberBetween(3, 15),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
