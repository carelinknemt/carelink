<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\BlogPostFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    /** @use HasFactory<BlogPostFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'read_time',
        'summary',
        'excerpt',
        'content',
        'author',
        'image',
        'published_at',
        'active',
    ];

    protected $attributes = [
        'active' => true,
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'active' => 'boolean',
        ];
    }

    /**
     * @return Attribute<string|null, string|null>
     */
    protected function publishedAt(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): ?string => $value ? Carbon::parse($value)->format('M j, Y') : null,
        );
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('active', true)->whereNotNull('published_at');
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at');
    }
}
