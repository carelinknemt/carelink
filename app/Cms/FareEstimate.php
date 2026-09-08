<?php

namespace App\Cms;

use App\Models\Service;
use Illuminate\Support\Facades\Cache;

/**
 * Single source of truth for the fare estimate shown when a customer
 * books a trip. The estimate is the service's base rate for the first
 * INCLUDED_MILES, plus the per-mile mileage rate for every additional
 * mile. Service rates are managed through the services CMS collection;
 * when a transport type has no matching service row, it falls back to
 * the documented wheelchair ($45 / $3.50) and ambulatory ($20 / $2.50)
 * rates so estimates never fail silently.
 */
class FareEstimate
{
    /**
     * The number of miles covered by the base rate.
     */
    public const INCLUDED_MILES = 5.0;

    /**
     * Fallback rates kept in sync with the wheelchair-transport and
     * ambulatory-sedan service rows.
     */
    private const FALLBACK_BASE_RATE = 45.0;

    private const FALLBACK_MILEAGE_RATE = 3.5;

    private const FALLBACK_AMBULATORY_BASE_RATE = 20.0;

    private const FALLBACK_AMBULATORY_MILEAGE_RATE = 2.5;

    /**
     * The service slug that prices a given transport type. The book form
     * offers four wheelchair-style vehicles plus ambulatory; every
     * wheelchair-style vehicle is priced as the Wheelchair Transport
     * service.
     */
    public static function serviceSlugFor(string $transportType): string
    {
        return $transportType === 'ambulatory'
            ? 'ambulatory-sedan'
            : 'wheelchair-transport';
    }

    /**
     * The fare estimate in cents for a transport type and driving
     * distance, rounded to the nearest cent.
     */
    public static function amountInCents(string $transportType, float $miles): int
    {
        $baseRate = self::baseRateFor($transportType);
        $mileageRate = self::mileageRateFor($transportType);
        $extraMiles = max(0.0, $miles - self::INCLUDED_MILES);

        return (int) round(($baseRate + ($mileageRate * $extraMiles)) * 100);
    }

    public static function amountInDollars(string $transportType, float $miles): string
    {
        return number_format(self::amountInCents($transportType, $miles) / 100, 2);
    }

    public static function dollars(string $transportType, float $miles): string
    {
        return '$'.self::amountInDollars($transportType, $miles);
    }

    private static function baseRateFor(string $transportType): float
    {
        $rates = self::ratesFor($transportType);

        if ($rates !== null) {
            return $rates['base_rate'];
        }

        return $transportType === 'ambulatory'
            ? self::FALLBACK_AMBULATORY_BASE_RATE
            : self::FALLBACK_BASE_RATE;
    }

    private static function mileageRateFor(string $transportType): float
    {
        $rates = self::ratesFor($transportType);

        if ($rates !== null) {
            return $rates['mileage_rate'];
        }

        return $transportType === 'ambulatory'
            ? self::FALLBACK_AMBULATORY_MILEAGE_RATE
            : self::FALLBACK_MILEAGE_RATE;
    }

    /**
     * Scalar service rates for a transport type, cached by value (never the
     * model instance itself — serializing an Eloquent model into the cache
     * can unserialize as an unusable object). Falls back to the documented
     * rates when the service row is missing.
     *
     * @return array{base_rate: float, mileage_rate: float}|null
     */
    private static function ratesFor(string $transportType): ?array
    {
        $service = Service::where('slug', self::serviceSlugFor($transportType))->first();

        if ($service === null) {
            return null;
        }

        return Cache::remember(
            'fare-estimate:rates:'.self::serviceSlugFor($transportType),
            now()->addHour(),
            fn (): array => [
                'base_rate' => (float) $service->base_rate,
                'mileage_rate' => (float) $service->mileage_rate,
            ],
        );
    }
}
