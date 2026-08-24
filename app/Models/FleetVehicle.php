<?php

namespace App\Models;

use Database\Factories\FleetVehicleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FleetVehicle extends Model
{
    /** @use HasFactory<FleetVehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'capacity',
        'features',
        'description',
        'image',
        'accessibility_specs',
        'hourly_rate_est',
        'sort_order',
        'active',
    ];

    protected $attributes = [
        'active' => true,
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'accessibility_specs' => 'array',
            'hourly_rate_est' => 'decimal:2',
            'active' => 'boolean',
        ];
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
