<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'category',
        'title',
        'short_description',
        'full_description',
        'benefits',
        'image',
        'icon_name',
        'suitable_for',
        'typical_destinations',
        'base_rate',
        'mileage_rate',
        'sort_order',
        'active',
    ];

    protected $attributes = [
        'active' => true,
    ];

    protected function casts(): array
    {
        return [
            'benefits' => 'array',
            'suitable_for' => 'array',
            'typical_destinations' => 'array',
            'base_rate' => 'decimal:2',
            'mileage_rate' => 'decimal:2',
            'active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
