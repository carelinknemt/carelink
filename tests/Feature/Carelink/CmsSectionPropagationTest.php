<?php

use App\Cms\SectionDefinitions;
use App\Models\ContentSection;
use App\Models\User;
use Database\Seeders\CmsContentSeeder;

beforeEach(function () {
    $this->seed(CmsContentSeeder::class);
});

function carelink_mark_first_string(array &$value, string $marker): bool
{
    foreach ($value as &$item) {
        if (is_array($item)) {
            if (carelink_mark_first_string($item, $marker)) {
                return true;
            }
        } elseif (is_string($item)) {
            $item = $marker;

            return true;
        }
    }

    return false;
}

$carelink_routes = [
    'company_info' => 'home',
    'dispatch_hours' => 'home',
    'payment_methods' => 'home',
    'hero_slides' => 'home',
    'patient_reviews' => 'home',
    'google_rating_stats' => 'home',
    'booking_steps' => 'home',
    'term_sections' => 'terms',
    'privacy_sections' => 'privacy',
    'page_heroes' => 'book',
];

test('every editable section saves and reaches its public page', function () use ($carelink_routes) {
    $admin = User::factory()->admin()->create();

    foreach (SectionDefinitions::all() as $slug => $definition) {
        if ($definition['readonly'] ?? false) {
            continue;
        }

        $marker = 'ZMARKER'.ucfirst(str_replace('_', '', $slug));

        $payload = $definition['defaults'];

        foreach ($definition['fields'] as $field) {
            if (($field['type'] ?? null) !== 'table') {
                continue;
            }

            $textareaCols = collect($field['cols'] ?? [])
                ->where('type', 'textarea')
                ->pluck('key')
                ->all();

            $payload[$field['key']] = array_map(function (array $row) use ($textareaCols): array {
                foreach ($textareaCols as $col) {
                    if (is_string($row[$col] ?? null)) {
                        $row[$col] = [$row[$col]];
                    }
                }

                return $row;
            }, is_array($payload[$field['key']] ?? null) ? $payload[$field['key']] : []);
        }

        $found = carelink_mark_first_string($payload, $marker);
        expect($found)->toBeTrue();

        $this->actingAs($admin)
            ->put(route('cms.sections.update', $slug), ['content' => $payload])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $row = ContentSection::where('slug', $slug)->first();
        expect($row)->not->toBeNull();
        expect(json_encode($row->content ?? []))
            ->toContain($marker);

        $pageRoute = $carelink_routes[$slug];

        $get = $this->get(route($pageRoute))->assertOk();
        $props = $get->viewData('page')['props'] ?? [];
        expect(json_encode($props))
            ->toContain($marker);
    }

    expect(true)->toBeTrue();
});
