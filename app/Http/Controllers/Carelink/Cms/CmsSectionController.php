<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Cms\ResetsCmsContent;
use App\Cms\SectionDefinitions;
use App\Http\Controllers\Controller;
use App\Models\ContentSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsSectionController extends Controller
{
    /**
     * Admin-only CMS section editor: every content section with its stored
     * values, ready for the schema-driven editor on the frontend.
     */
    public function index(Request $request): Response
    {

        $sections = collect(SectionDefinitions::all())
            ->map(function (array $definition, string $slug): array {
                $row = ContentSection::where('slug', $slug)->first();

                return [
                    'slug' => $slug,
                    'title' => $definition['title'],
                    'description' => $definition['description'],
                    'schema' => $definition['fields'],
                    'content' => ContentSection::contentFor($slug),
                    'updated_at' => $row?->updated_at?->toDateTimeString(),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('cms/sections', [
            'sections' => $sections,
        ]);
    }

    /**
     * Persist one section's content; the schema stored in the database is
     * always refreshed from SectionDefinitions so the editor self-heals.
     */
    public function update(Request $request, string $section): RedirectResponse
    {

        $definitions = SectionDefinitions::all();

        abort_unless(isset($definitions[$section]), 404);

        $fields = $definitions[$section]['fields'];
        $defaults = $definitions[$section]['defaults'];

        $validated = $request->validate($this->rulesFor($fields));

        $content = $this->buildContent($defaults, $fields, $validated);

        ContentSection::updateOrCreate(
            ['slug' => $section],
            [
                'title' => $definitions[$section]['title'],
                'schema' => $fields,
                'content' => $content,
            ],
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$definitions[$section]['title']} was saved.",
        ]);

        return back();
    }

    /**
     * Drop a section's stored content so every field falls back to its
     * SectionDefinitions default (the row is deleted; contentForAll returns
     * the code defaults for missing rows).
     */
    public function restore(Request $request, string $section): RedirectResponse
    {

        $definitions = SectionDefinitions::all();

        abort_unless(isset($definitions[$section]), 404);

        ContentSection::where('slug', $section)->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$definitions[$section]['title']} was reset to its defaults.",
        ]);

        return back();
    }

    /**
     * Reset every section and collection back to the shipped defaults.
     */
    public function restoreAll(Request $request): RedirectResponse
    {

        (new ResetsCmsContent)->resetAll();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'All website content was reset to its defaults.',
        ]);

        return back();
    }

    /**
     * @param  array<int, array<string, mixed>>  $fields
     * @return array<string, array<int, string>>
     */
    private function rulesFor(array $fields): array
    {
        $rules = [];

        foreach ($fields as $field) {
            switch ($field['type']) {
                case 'number':
                    $rules[$field['key']] = ['nullable', 'numeric'];
                    break;
                case 'switch':
                    $rules[$field['key']] = ['nullable', 'boolean'];
                    break;
                case 'list':
                    $rules[$field['key']] = ['nullable', 'array'];
                    $rules[$field['key'].'.*'] = ['nullable', 'string'];
                    break;
                case 'table':
                    $rules[$field['key']] = ['nullable', 'array'];
                    foreach ($field['cols'] ?? [] as $col) {
                        $rule = $col['type'] === 'number' ? ['nullable', 'numeric'] : ['nullable', 'string'];
                        $rules[$field['key'].'.*.'.$col['key']] = $rule;
                    }
                    break;
                default:
                    $rules[$field['key']] = ['nullable', 'string', 'max:20000'];
            }
        }

        return $rules;
    }

    /**
     * Rebuild one section's content array from the validated input, falling
     * back to the defaults for fields that were not submitted. Lists and
     * tables replace their defaults wholesale.
     *
     * @param  array<string, mixed>  $defaults
     * @param  array<int, array<string, mixed>>  $fields
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function buildContent(array $defaults, array $fields, array $validated): array
    {
        $content = $defaults;

        foreach ($fields as $field) {
            $key = $field['key'];

            if (! array_key_exists($key, $validated)) {
                continue;
            }

            $value = $validated[$key];

            if ($field['type'] === 'switch') {
                $content[$key] = (bool) $value;
            } elseif ($field['type'] === 'list') {
                $content[$key] = collect($value ?? [])
                    ->filter(fn ($line): bool => $line !== null && trim((string) $line) !== '')
                    ->map(fn ($line): string => trim((string) $line))
                    ->values()
                    ->all();
            } elseif ($field['type'] === 'table') {
                $content[$key] = collect($value ?? [])
                    ->map(function (array $row): array {
                        return collect($row)
                            ->map(fn ($cell): mixed => is_array($cell)
                                ? collect($cell)
                                    ->filter(fn ($line): bool => $line !== null && trim((string) $line) !== '')
                                    ->map(fn ($line): string => trim((string) $line))
                                    ->values()
                                    ->all()
                                : $cell)
                            ->all();
                    })
                    ->filter(fn (array $row): bool => collect($row)->filter(fn ($cell) => $cell !== null && $cell !== '' && $cell !== [])->isNotEmpty())
                    ->values()
                    ->all();
            } else {
                $content[$key] = $value === null || $value === '' ? null : $value;
            }
        }

        return $content;
    }
}
