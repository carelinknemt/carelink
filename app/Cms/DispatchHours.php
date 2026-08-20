<?php

namespace App\Cms;

use App\Models\ContentSection;
use DateTimeInterface;
use Illuminate\Support\Carbon;

/**
 * Supported weekly dispatch windows from the dispatch_hours CMS section
 * ("7:00 a.m.-6:00 p.m." per day). The book flow validates the pickup
 * time against these windows: a pickup outside the day's window is
 * rejected as an invalid booking.
 */
class DispatchHours
{
    /**
     * The dispatch window for a given trip date, or null when that day
     * offers no service.
     *
     * @return array{day: string, open_minutes: int, close_minutes: int, label: string}|null
     */
    public static function forDate(string|DateTimeInterface $date): ?array
    {
        $date = Carbon::parse($date);

        foreach (self::windowsForWeek() as $window) {
            if ($window['day'] === $date->format('l')) {
                return $window;
            }
        }

        return null;
    }

    /**
     * Whether a pickup time ("07:30 AM", "7:00 p.m.", "18:00") falls inside
     * the dispatch window for the trip date. Missing/closed days and
     * unparseable times return false.
     */
    public static function isSupported(string|DateTimeInterface $date, string $pickupTime): bool
    {
        $window = self::forDate($date);
        $minutes = self::parseTime($pickupTime);

        if ($window === null || $minutes === null) {
            return false;
        }

        return $minutes >= $window['open_minutes'] && $minutes <= $window['close_minutes'];
    }

    /**
     * @return array<int, array{day: string, open_minutes: int, close_minutes: int, label: string}>
     */
    private static function windowsForWeek(): array
    {
        $days = ContentSection::contentFor('dispatch_hours')['days'] ?? [];

        return collect($days)
            ->filter(fn (mixed $row): bool => is_array($row))
            ->map(function (array $row): ?array {
                $pair = self::parseWindow((string) ($row['hours'] ?? ''));

                if ($pair === null) {
                    return null;
                }

                return [
                    'day' => (string) ($row['day'] ?? ''),
                    'open_minutes' => $pair[0],
                    'close_minutes' => $pair[1],
                    'label' => (string) ($row['hours'] ?? ''),
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Parse "7:00 a.m.-6:00 p.m." (dash variants and AM/PM spellings
     * accepted) into [open, close] minutes from midnight, or null.
     *
     * @return array{0: int, 1: int}|null
     */
    private static function parseWindow(string $hours): ?array
    {
        if (! preg_match('/^\s*([^-–—]+)\s*[-–—]\s*([^-–—]+)\s*$/', $hours, $matches)) {
            return null;
        }

        $start = self::parseTime($matches[1]);
        $end = self::parseTime($matches[2]);

        if ($start === null || $end === null) {
            return null;
        }

        return [$start, $end];
    }

    /**
     * Parse a 12-hour time ("07:30 AM", "7:00 a.m.", "12pm") or a 24-hour
     * time ("18:00") into minutes from midnight, or null when unparseable.
     */
    private static function parseTime(string $time): ?int
    {
        $time = trim($time);

        if (preg_match('/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)$/i', $time, $matches)) {
            $hour = (int) $matches[1];
            $minute = (int) ($matches[2] ?? 0);
            $isPm = stripos($matches[3], 'p') === 0;

            if ($hour < 1 || $hour > 12 || $minute > 59) {
                return null;
            }

            return (($isPm ? ($hour === 12 ? 12 : $hour + 12) : ($hour === 12 ? 0 : $hour)) * 60) + $minute;
        }

        if (preg_match('/^(\d{1,2}):(\d{2})$/', $time, $matches)) {
            $hour = (int) $matches[1];
            $minute = (int) $matches[2];

            if ($hour > 23 || $minute > 59) {
                return null;
            }

            return ($hour * 60) + $minute;
        }

        return null;
    }
}
