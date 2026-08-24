<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\RideBookingFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string|null $ride_date
 */
class RideBooking extends Model
{
    /** @use HasFactory<RideBookingFactory> */
    use HasFactory;

    public const STATUS_PENDING_DISPATCH = 'PENDING_DISPATCH';

    public const STATUS_BAMBI_DISPATCHED = 'BAMBI_DISPATCHED';

    public const STATUS_IN_TRANSIT = 'IN_TRANSIT';

    public const STATUS_COMPLETED = 'COMPLETED';

    public const STATUSES = [
        self::STATUS_PENDING_DISPATCH,
        self::STATUS_BAMBI_DISPATCHED,
        self::STATUS_IN_TRANSIT,
        self::STATUS_COMPLETED,
    ];

    protected $fillable = [
        'booking_number',
        'passenger_name',
        'phone',
        'email',
        'service_type',
        'pickup_address',
        'pickup_county',
        'destination_address',
        'destination_county',
        'ride_date',
        'ride_time',
        'is_round_trip',
        'wheelchair_needed',
        'oxygen_needed',
        'additional_notes',
        'payment_method',
        'estimated_cost',
        'status',
        'bambi_dispatch_ref',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING_DISPATCH,
    ];

    protected function casts(): array
    {
        return [
            'ride_date' => 'date',
            'is_round_trip' => 'boolean',
            'wheelchair_needed' => 'boolean',
            'oxygen_needed' => 'boolean',
            'estimated_cost' => 'decimal:2',
        ];
    }

    /**
     * @return Attribute<string|null, string|null>
     */
    protected function rideDate(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): ?string => $value ? Carbon::parse($value)->format('m/d/Y') : null,
        );
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('created_at');
    }
}
