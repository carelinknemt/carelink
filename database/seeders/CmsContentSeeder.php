<?php

namespace Database\Seeders;

use App\Cms\SectionDefinitions;
use App\Models\ContentSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CmsContentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed (or refresh) every CMS content section with the values from
     * SectionDefinitions. Re-running the seeder restores the original
     * content, so only run it when you want to reset.
     */
    public function run(): void
    {
        foreach (SectionDefinitions::all() as $slug => $definition) {
            ContentSection::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $definition['title'],
                    'schema' => $definition['fields'],
                    'content' => $definition['defaults'],
                ],
            );
        }
    }
}
