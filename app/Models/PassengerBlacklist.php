<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\PassengerBlacklistFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string|null $email
 * @property string|null $phone_digits
 * @property string $reason
 * @property int $blacklisted_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $blacklister
 */
class PassengerBlacklist extends Model
{
    /** @use HasFactory<PassengerBlacklistFactory> */
    use HasFactory;

    protected $fillable = [
        'email',
        'phone_digits',
        'reason',
        'blacklisted_by',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function blacklister(): BelongsTo
    {
        return $this->belongsTo(User::class, 'blacklisted_by');
    }

    public static function digitsFromPhone(string $phone): string
    {
        return preg_replace('/\D+/', '', $phone);
    }

    public static function matchFor(TripRequest $trip): ?self
    {
        $email = $trip->passenger_email
            ? strtolower(trim($trip->passenger_email))
            : null;
        $phoneDigits = $trip->passenger_phone_number
            ? self::digitsFromPhone($trip->passenger_phone_number)
            : null;

        if (! $email && ! $phoneDigits) {
            return null;
        }

        return static::query()
            ->where(function ($query) use ($email, $phoneDigits): void {
                if ($email) {
                    $query->where('email', $email);
                }

                if ($email && $phoneDigits) {
                    $query->orWhere(function ($q) use ($phoneDigits): void {
                        $q->where('phone_digits', $phoneDigits);
                    });
                } elseif ($phoneDigits) {
                    $query->where('phone_digits', $phoneDigits);
                }
            })
            ->with('blacklister:id,name')
            ->first();
    }

    /**
     * @param  iterable<TripRequest>  $trips
     * @return array<int, self|null>
     */
    public static function matchCollection(iterable $trips): array
    {
        $emails = [];
        $phones = [];

        foreach ($trips as $trip) {
            if ($trip->passenger_email) {
                $emails[] = strtolower(trim($trip->passenger_email));
            }
            if ($trip->passenger_phone_number) {
                $phones[] = self::digitsFromPhone($trip->passenger_phone_number);
            }
        }

        $entries = static::query()
            ->where(function ($query) use ($emails, $phones): void {
                if ($emails) {
                    $query->whereIn('email', $emails);
                }
                if ($phones) {
                    if ($emails) {
                        $query->orWhereIn('phone_digits', $phones);
                    } else {
                        $query->whereIn('phone_digits', $phones);
                    }
                }
            })
            ->with('blacklister:id,name')
            ->get();

        $byEmail = $entries->where('email', '!=', null)
            ->keyBy(fn (self $e) => strtolower($e->email));
        $byPhone = $entries->where('phone_digits', '!=', null)
            ->keyBy('phone_digits');

        $result = [];

        foreach ($trips as $trip) {
            $email = $trip->passenger_email
                ? strtolower(trim($trip->passenger_email))
                : null;
            $phoneDigits = $trip->passenger_phone_number
                ? self::digitsFromPhone($trip->passenger_phone_number)
                : null;

            $match = ($email && $byEmail->has($email))
                ? $byEmail->get($email)
                : (($phoneDigits && $byPhone->has($phoneDigits))
                    ? $byPhone->get($phoneDigits)
                    : null);

            $result[$trip->id] = $match;
        }

        return $result;
    }
}
