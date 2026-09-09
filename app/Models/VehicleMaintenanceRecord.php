<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\VehicleMaintenanceRecordFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property Carbon $service_date
 * @property Carbon|null $next_service_date
 */
class VehicleMaintenanceRecord extends Model
{
    /** @use HasFactory<VehicleMaintenanceRecordFactory> */
    use HasFactory;

    public const TYPE_OIL_CHANGE = 'oil_change';

    public const TYPE_TIRE_ROTATION = 'tire_rotation';

    public const TYPE_BRAKE_SERVICE = 'brake_service';

    public const TYPE_FLUID_CHECK = 'fluid_check';

    public const TYPE_BATTERY = 'battery';

    public const TYPE_INSPECTION = 'inspection';

    public const TYPE_FILTER_REPLACEMENT = 'filter_replacement';

    public const TYPE_OTHER = 'other';

    public const TYPES = [
        self::TYPE_OIL_CHANGE,
        self::TYPE_TIRE_ROTATION,
        self::TYPE_BRAKE_SERVICE,
        self::TYPE_FLUID_CHECK,
        self::TYPE_BATTERY,
        self::TYPE_INSPECTION,
        self::TYPE_FILTER_REPLACEMENT,
        self::TYPE_OTHER,
    ];

    public const TYPE_LABELS = [
        self::TYPE_OIL_CHANGE => 'Oil change',
        self::TYPE_TIRE_ROTATION => 'Tire rotation',
        self::TYPE_BRAKE_SERVICE => 'Brake service',
        self::TYPE_FLUID_CHECK => 'Fluid check',
        self::TYPE_BATTERY => 'Battery service',
        self::TYPE_INSPECTION => 'Inspection',
        self::TYPE_FILTER_REPLACEMENT => 'Filter replacement',
        self::TYPE_OTHER => 'Other',
    ];

    protected $fillable = [
        'maintenance_vehicle_id',
        'maintenance_type',
        'service_date',
        'vehicle_mileage',
        'service_provider',
        'total_cost',
        'next_service_date',
        'next_service_mileage',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'service_date' => 'date',
            'vehicle_mileage' => 'integer',
            'total_cost' => 'decimal:2',
            'next_service_date' => 'date',
            'next_service_mileage' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<MaintenanceVehicle, $this>
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(MaintenanceVehicle::class, 'maintenance_vehicle_id');
    }

    /**
     * @return HasMany<MaintenanceDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(MaintenanceDocument::class);
    }
}
