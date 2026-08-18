<?php

namespace App\Cms;

use App\Models\ContentSection;

/**
 * Single source of truth for the booking fee amount and label. Defaults
 * match the historic $30 fee; admins override them through the
 * booking_fee_settings CMS section, and every consumer (Stripe checkout,
 * book/track summaries, dashboard sums) reads through here.
 */
class BookingFee
{
    public const DEFAULT_AMOUNT_CENTS = 3000;

    public const DEFAULT_LABEL = 'CareLink Booking Fee';

    public static function amountInCents(): int
    {
        return (int) (ContentSection::contentFor('booking_fee_settings')['fee_amount_cents'] ?? self::DEFAULT_AMOUNT_CENTS);
    }

    public static function label(): string
    {
        return (string) (ContentSection::contentFor('booking_fee_settings')['label'] ?? self::DEFAULT_LABEL);
    }

    public static function amountInDollars(): string
    {
        return number_format(self::amountInCents() / 100, 2);
    }

    /**
     * The fee as a formatted dollar string with the currency symbol.
     */
    public static function dollars(): string
    {
        return '$'.self::amountInDollars();
    }
}
