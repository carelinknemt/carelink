<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogPost>
 */
class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'category' => $this->faker->randomElement(['PATIENT ADVISORY', 'HEALTHCARE LOGISTICS', 'SAFETY & COMPLIANCE']),
            'read_time' => $this->faker->numberBetween(3, 5).' min read',
            'summary' => $this->faker->paragraph(2),
            'excerpt' => $this->faker->sentence(12),
            'content' => $this->faker->paragraphs(3, true),
            'author' => $this->faker->name(),
            'image' => '/images/carelink_driver_care_1785061489888.jpg',
            'published_at' => $this->faker->dateTimeBetween('-3 months'),
            'active' => true,
        ];
    }
}
