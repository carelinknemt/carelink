<?php

namespace App\Cms;

use App\Models\ContentSection;

/**
 * Single source of truth for the booking fee amounts and label. Defaults
 * match the historic fee structure: $30 for most trips and $20 for
 * ambulatory trips; admins override them through the booking_fee_settings
 * CMS section, and every consumer (Stripe checkout, book/track summaries,
 * dashboard sums) reads through here.
 */
class BookingFee
{
    public const DEFAULT_AMOUNT_CENTS = 3000;

    public const DEFAULT_AMBULATORY_AMOUNT_CENTS = 2000;

    public const DEFAULT_LABEL = 'CareLink Booking Fee';

    public static function amountInCents(): int
    {
        return (int) (ContentSection::contentFor('booking_fee_settings')['fee_amount_cents'] ?? self::DEFAULT_AMOUNT_CENTS);
    }

    public static function ambulatoryAmountInCents(): int
    {
        return (int) (ContentSection::contentFor('booking_fee_settings')['ambulatory_fee_amount_cents'] ?? self::DEFAULT_AMBULATORY_AMOUNT_CENTS);
    }

    /**
     * The fee for a specific transport type: ambulatory trips use the
     * ambulatory fee, every other transport type uses the standard fee.
     */
    public static function amountInCentsFor(string $transportType): int
    {
        return $transportType === 'ambulatory'
            ? self::ambulatoryAmountInCents()
            : self::amountInCents();
    }

    public static function label(): string
    {
        return (string) (ContentSection::contentFor('booking_fee_settings')['label'] ?? self::DEFAULT_LABEL);
    }

    public static function amountInDollars(): string
    {
        return number_format(self::amountInCents() / 100, 2);
    }

    public static function amountInDollarsFor(string $transportType): string
    {
        return number_format(self::amountInCentsFor($transportType) / 100, 2);
    }

    /**
     * The fee as a formatted dollar string with the currency symbol.
     */
    public static function dollars(): string
    {
        return '$'.self::amountInDollars();
    }

    public static function dollarsFor(string $transportType): string
    {
        return '$'.self::amountInDollarsFor($transportType);
    }
}
