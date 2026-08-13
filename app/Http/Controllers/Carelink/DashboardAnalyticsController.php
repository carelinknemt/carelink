<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\TripRequest;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardAnalyticsController extends Controller
{
    private const FEE = 30.0;

    private const DAY_OPTIONS = [7, 30, 90];

    public function index(Request $request): Response
    {
        $days = in_array($request->integer('days'), self::DAY_OPTIONS, true)
            ? $request->integer('days')
            : 30;

        $from = today()->subDays($days - 1);
        $to = today();

        $bookings = TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->whereBetween('trip_date', [$from, $to])
            ->get([
                'id',
                'trip_date',
                'pickup_time',
                'status',
                'service_type',
                'pickup_address',
                'passenger_first_name',
                'passenger_last_name',
                'passenger_email',
                'input_price',
                'paid_at',
            ]);

        return Inertia::render('dashboard/analytics', [
            'days' => $days,
            'range' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
            'summary' => $this->summary($bookings),
            'daily' => $this->dailySeries($bookings, $from, $to),
            'statuses' => $this->counts($bookings, 'status'),
            'services' => $this->counts($bookings, 'service_type'),
            'day_of_week' => $this->dayOfWeek($bookings),
            'pickup_hour' => $this->pickupHours($bookings),
            'top_pickups' => $bookings
                ->whereNotNull('pickup_address')
                ->groupBy('pickup_address')
                ->map(fn (Collection $rows): array => [
                    'address' => (string) $rows->first()?->pickup_address,
                    'count' => $rows->count(),
                ])
                ->sortByDesc('count')
                ->take(8)
                ->values(),
            'repeat_passengers' => $this->repeatPassengers($bookings),
        ]);
    }

    /**
     * @return array{bookings: int, revenue: float, avg_trip_price: float, completed_rate: float}
     */
    private function summary(Collection $bookings): array
    {
        $paid = $bookings->whereNotNull('paid_at');
        $completed = $bookings->where('status', TripRequest::STATUS_COMPLETED)->count();
        $prices = $bookings->whereNotNull('input_price');

        return [
            'bookings' => $bookings->count(),
            'revenue' => round($paid->count() * self::FEE, 2),
            'avg_trip_price' => $prices->isEmpty() ? 0.0 : round($prices->avg('input_price'), 2),
            'completed_rate' => $bookings->isEmpty() ? 0.0 : round($completed / $bookings->count() * 100, 1),
        ];
    }

    /**
     * Zero-filled per-day bookings + booking-fee revenue series.
     *
     * @return array<int, array{date: string, bookings: int, revenue: float}>
     */
    private function dailySeries(Collection $bookings, CarbonInterface $from, CarbonInterface $to): array
    {
        $daily = $bookings->groupBy(fn (TripRequest $tripRequest): string => $tripRequest->trip_date?->toDateString() ?? '');

        return collect($from->toPeriod($to, 1, 'day'))->map(function (CarbonInterface $day) use ($daily): array {
            $key = $day->toDateString();
            $rows = $daily->get($key, new Collection);

            return [
                'date' => $key,
                'bookings' => $rows->count(),
                'revenue' => round($rows->whereNotNull('paid_at')->count() * self::FEE, 2),
            ];
        })->values()->all();
    }

    /**
     * Group a collection by a field into labeled count rows, keeping the
     * model's status/service ordering.
     *
     * @return array<int, array{label: string, count: int}>
     */
    private function counts(Collection $bookings, string $field): array
    {
        $order = $field === 'status' ? TripRequest::STATUSES : ['ambulatory', 'wheelchair', 'wheelchair xl', 'broda chair', 'geri chair', 'curb-to-curb', 'door-to-door', 'door-through-door', 'person-to-person'];

        return collect($order)
            ->map(fn (string $value): array => [
                'label' => (string) $value,
                'count' => $bookings->where($field, $value)->count(),
            ])
            ->filter(fn (array $row): bool => $row['count'] > 0)
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, count: int}>
     */
    private function dayOfWeek(Collection $bookings): array
    {
        $labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return collect($labels)->map(function (string $label, int $index) use ($bookings): array {
            $rows = $bookings->filter(fn (TripRequest $tripRequest): bool => $tripRequest->trip_date?->dayOfWeek === $index);

            return [
                'label' => $label,
                'count' => $rows->count(),
            ];
        })->values()->all();
    }

    /**
     * @return array<int, array{label: string, count: int}>
     */
    private function pickupHours(Collection $bookings): array
    {
        return $bookings
            ->whereNotNull('pickup_time')
            ->groupBy(fn (TripRequest $tripRequest): string => substr((string) $tripRequest->pickup_time, 0, 2))
            ->map(function (Collection $rows): array {
                $hour = (int) ((string) $rows->first()?->pickup_time ?: '0');

                return [
                    'label' => CarbonImmutable::createFromTime($hour)->format('g A'),
                    'count' => $rows->count(),
                ];
            })
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * Passengers booked more than once in the period, busiest first.
     *
     * @return array<int, array{name: string, trips: int}>
     */
    private function repeatPassengers(Collection $bookings): array
    {
        return $bookings
            ->groupBy(fn (TripRequest $tripRequest): string => mb_strtolower(trim($tripRequest->passenger_first_name.' '.$tripRequest->passenger_last_name)))
            ->map(function (Collection $rows): array {
                $first = $rows->first();

                return [
                    'name' => trim("{$first?->passenger_first_name} {$first?->passenger_last_name}"),
                    'trips' => $rows->count(),
                ];
            })
            ->filter(fn (array $row): bool => $row['trips'] > 1)
            ->sortByDesc('trips')
            ->take(10)
            ->values()
            ->all();
    }
}
