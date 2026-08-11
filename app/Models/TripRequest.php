<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripRequest extends Model
{
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
            'dropoff_stairs' => 'boolean',
            'must_provide_wheelchair' => 'boolean',
            'has_infectious_disease' => 'boolean',
            'pickup_latitude' => 'float',
            'pickup_longitude' => 'float',
            'dropoff_latitude' => 'float',
            'dropoff_longitude' => 'float',
            'paid_at' => 'datetime',
        ];
    }
}
