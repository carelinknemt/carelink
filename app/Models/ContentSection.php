<?php

namespace App\Models;

use App\Cms\SectionDefinitions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentSection extends Model
{
    use HasFactory;

    /**
     * A ContentSection is a CMS-editable JSON blob keyed by a stable slug
     * (e.g. company_info, hero_slides). The schema lives in code
     * (SectionDefinitions) and drives the admin editor UI; the content
     * column holds the current values. Public pages receive every section
     * through the shared Inertia `cms` prop with the definition defaults as
     * a fallback, so missing rows never break the site.
     */
    protected $fillable = ['slug', 'title', 'schema', 'content'];

    protected function casts(): array
    {
        return [
            'schema' => 'array',
            'content' => 'array',
        ];
    }

    /**
     * Every defined section's current content, keyed by slug, with the
     * definition defaults applied as a top-level fallback for fields a row
     * does not store. Lists/tables stored in the row replace the defaults
     * wholesale (array_replace, not recursive merge, so removing rows from
     * a table actually removes them).
     *
     * @return array<string, array<string, mixed>>
     */
    public static function contentForAll(): array
    {
        $rows = static::query()->get(['slug', 'content'])->pluck('content', 'slug');

        return collect(SectionDefinitions::all())
            ->map(function (array $definition, string $slug) use ($rows): array {
                $content = $rows->get($slug);

                return is_array($content) ? array_replace($definition['defaults'], $content) : $definition['defaults'];
            })
            ->all();
    }

    /**
     * The content for a single section, falling back to its defaults.
     *
     * @return array<string, mixed>
     */
    public static function contentFor(string $slug): array
    {
        return static::contentForAll()[$slug] ?? [];
    }
}
