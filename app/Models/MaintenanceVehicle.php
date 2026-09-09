<?php

namespace App\Models;

use Database\Factories\MaintenanceVehicleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaintenanceVehicle extends Model
{
    /** @use HasFactory<MaintenanceVehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'capacity',
        'vin',
        'plate',
        'hourly_rate_est',
        'description',
        'sort_order',
        'active',
    ];

    protected $attributes = [
        'active' => true,
    ];

    protected function casts(): array
    {
        return [
            'hourly_rate_est' => 'decimal:2',
            'active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<VehicleMaintenanceRecord, $this>
     */
    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(VehicleMaintenanceRecord::class);
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
