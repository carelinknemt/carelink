<?php

namespace App\Cms;

use App\Models\BlogPost;
use App\Models\ContentSection;
use App\Models\Faq;
use App\Models\FleetVehicle;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Resets CMS content back to the shipped defaults. Sections are reset by
 * dropping their stored rows (contentForAll falls back to SectionDefinitions
 * defaults); collections replace every row with the rows from
 * CollectionDefinitions.
 */
class ResetsCmsContent
{
    /**
     * Replace a collection's rows with the CollectionDefinitions defaults.
     */
    public function resetCollection(string $collection): void
    {
        $model = $this->modelFor($collection);

        DB::transaction(function () use ($model, $collection): void {
            $model::query()->delete();

            foreach (CollectionDefinitions::all()[$collection] as $row) {
                $model::create($row);
            }
        });
    }

    /**
     * Reset every section and every CMS-managed collection.
     */
    public function resetAll(): void
    {
        DB::transaction(function (): void {
            ContentSection::query()->delete();

            foreach (array_keys(CollectionDefinitions::all()) as $collection) {
                $this->resetCollection($collection);
            }
        });
    }

    /**
     * @return class-string<Model>
     */
    private function modelFor(string $collection): string
    {
        return match ($collection) {
            'services' => Service::class,
            'fleet' => FleetVehicle::class,
            'team' => TeamMember::class,
            'faqs' => Faq::class,
            'blog' => BlogPost::class,
            default => throw new InvalidArgumentException("Unknown CMS collection: {$collection}"),
        };
    }
}
