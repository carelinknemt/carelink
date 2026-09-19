<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\BookingChargeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property Carbon|null $email_sent_at
 * @property Carbon|null $paid_at
 */
class BookingCharge extends Model
{
    /** @use HasFactory<BookingChargeFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'PENDING';

    public const STATUS_PAID = 'PAID';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PAID,
    ];

    protected $fillable = [
        'trip_request_id',
        'amount_cents',
        'status',
        'stripe_checkout_session_id',
        'token',
        'note',
        'created_by',
        'email_sent_at',
        'paid_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
    ];

    protected function casts(): array
    {
        return [
            'amount_cents' => 'integer',
            'email_sent_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<TripRequest, $this>
     */
    public function tripRequest(): BelongsTo
    {
        return $this->belongsTo(TripRequest::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getRouteKeyName(): string
    {
        return 'token';
    }

    public function amountInDollars(): string
    {
        return number_format($this->amount_cents / 100, 2);
    }

    /**
     * The ready-to-send SMS message a dispatcher copies to the passenger,
     * including the private payment link so the passenger can pay online.
     */
    public function paymentSmsMessage(): string
    {
        return 'CareLink Medical Transportation: A payment of $'.$this->amountInDollars().
            ' is due for trip request '.$this->tripRequest->booking_number.
            '. Pay now: '.route('charges.pay', $this);
    }
}
