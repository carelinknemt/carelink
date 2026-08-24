<?php

namespace App\Models;

use Database\Factories\CareerFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Career extends Model
{
    /** @use HasFactory<CareerFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'employment_type',
        'summary',
        'requirements',
        'benefits',
        'sort_order',
        'active',
    ];

    protected $attributes = [
        'active' => true,
    ];

    protected function casts(): array
    {
        return [
            'requirements' => 'array',
            'benefits' => 'array',
            'active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<CareerApplication, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(CareerApplication::class);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
