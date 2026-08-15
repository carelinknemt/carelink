<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripRequest extends Model
{
    use HasFactory;

    public const STATUS_PENDING_DISPATCH = 'PENDING_DISPATCH';

    public const STATUS_BAMBI_DISPATCHED = 'BAMBI_DISPATCHED';

    public const STATUS_IN_TRANSIT = 'IN_TRANSIT';

    public const STATUS_COMPLETED = 'COMPLETED';

    public const STATUS_CANCELLED = 'CANCELLED';

    /**
     * Sentinel used by the dashboard bookings status filter to request
     * every status (as opposed to no filter, which means pending only).
     */
    public const STATUS_FILTER_ALL = '__all';

    public const STATUSES = [
        self::STATUS_PENDING_DISPATCH,
        self::STATUS_BAMBI_DISPATCHED,
        self::STATUS_IN_TRANSIT,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

    /**
     * Statuses a manager may assign directly via the status dropdown.
     * CANCELLED is assignable too: the dedicated cancel action remains
     * for the refund-first flow, but managers may also mark a booking
     * cancelled directly.
     */
    public const ASSIGNABLE_STATUSES = [
        self::STATUS_PENDING_DISPATCH,
        self::STATUS_BAMBI_DISPATCHED,
        self::STATUS_IN_TRANSIT,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

    public const PAYMENT_STATUS_PENDING = 'PENDING';

    public const PAYMENT_STATUS_PAID = 'PAID';

    public const PAYMENT_STATUSES = [
        self::PAYMENT_STATUS_PENDING,
        self::PAYMENT_STATUS_PAID,
    ];

    /**
     * CSV column order expected by the Bambi trip request import.
     */
    public const CSV_COLUMNS = [
        'passenger_first_name',
        'passenger_last_name',
        'payer',
        'transport_type',
        'service_type',
        'will_call',
        'trip_date',
        'input_price',
        'pickup_address',
        'pickup_time',
        'dropoff_address',
        'id',
        'passenger_phone_number',
        'passenger_email',
        'passenger_dob',
        'passenger_gender',
        'passenger_weight',
        'passenger_is_bariatric',
        'passenger_notes',
        'attendants_needed',
        'additional_passengers',
        'oxygen_required',
        'oxygen_liters_per_min',
        'requested_by_name',
        'requested_by_phone_number',
        'dispatcher_notes',
        'pickup_address_details',
        'pickup_stairs',
        'pickup_stair_equipment',
        'pickup_driver_notes',
        'pickup_contact_name',
        'pickup_contact_phone_number',
        'load_time',
        'dropoff_address_details',
        'appointment_time',
        'dropoff_stairs',
        'dropoff_stair_equipment',
        'dropoff_driver_notes',
        'dropoff_contact_name',
        'dropoff_contact_phone_number',
        'unload_time',
        'must_provide_wheelchair',
        'has_infectious_disease',
        'tag_list',
    ];

    protected $fillable = [
        'booking_number',
        ...self::CSV_COLUMNS,
        'pickup_latitude',
        'pickup_longitude',
        'dropoff_latitude',
        'dropoff_longitude',
        'status',
        'trip_request_csv_path',
        'stripe_checkout_session_id',
        'payment_status',
        'paid_at',
        'refunded_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING_DISPATCH,
        'payment_status' => self::PAYMENT_STATUS_PENDING,
    ];

    protected function casts(): array
    {
        return [
            'will_call' => 'boolean',
            'trip_date' => 'date',
            'input_price' => 'decimal:2',
            'passenger_dob' => 'date',
            'passenger_weight' => 'decimal:1',
            'passenger_is_bariatric' => 'boolean',
            'oxygen_required' => 'boolean',
            'pickup_stairs' => 'boolean',
            'dropoff_stairs' => 'integer',
            'must_provide_wheelchair' => 'boolean',
            'has_infectious_disease' => 'boolean',
            'pickup_latitude' => 'float',
            'pickup_longitude' => 'float',
            'dropoff_latitude' => 'float',
            'dropoff_longitude' => 'float',
            'paid_at' => 'datetime',
            'refunded_at' => 'datetime',
        ];
    }

    /**
     * A row for the Bambi import CSV (docs/schema.csv contract): the id
     * column exports empty, booleans export as TRUE/FALSE, dates as
     * YYYY-MM-DD, and null values as an empty string.
     */
    public static function exportRow(self $tripRequest): array
    {
        return array_map(
            fn (string $column): string => self::csvValue($tripRequest, $column),
            self::CSV_COLUMNS,
        );
    }

    private static function csvValue(self $tripRequest, string $column): string
    {
        if ($column === 'id') {
            return '';
        }

        $value = $tripRequest->getAttribute($column);

        if (is_bool($value)) {
            return $value ? 'TRUE' : 'FALSE';
        }

        if ($value instanceof Carbon) {
            return $value->toDateString();
        }

        if ($value === null) {
            return '';
        }

        return (string) $value;
    }

    /**
     * Display summary used by the manager dashboard lists.
     */
    public function managerSummary(): array
    {
        return [
            'id' => $this->id,
            'booking_number' => $this->booking_number,
            'passenger_name' => trim($this->passenger_first_name.' '.$this->passenger_last_name),
            'phone' => $this->passenger_phone_number,
            'email' => $this->passenger_email,
            'service_type' => $this->service_type,
            'trip_date' => $this->trip_date?->toDateString(),
            'pickup_time' => $this->pickup_time,
            'pickup_address' => $this->pickup_address,
            'dropoff_address' => $this->dropoff_address,
            'input_price' => $this->input_price,
            'status' => $this->status,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'booked_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
