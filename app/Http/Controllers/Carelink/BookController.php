<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTripRequestRequest;
use App\Models\TripRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('book');
    }

    public function store(StoreTripRequestRequest $request): RedirectResponse
    {
        $tripRequest = TripRequest::create([
            ...$request->validated(),
            'booking_number' => $this->generateBookingNumber(),
            'status' => TripRequest::STATUS_PENDING_DISPATCH,
        ]);

        $tripRequest->trip_request_csv_path = $this->exportToCsv($tripRequest);
        $tripRequest->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Trip request {$tripRequest->booking_number} submitted successfully.",
        ]);

        Inertia::flash('booking', [
            'booking_number' => $tripRequest->booking_number,
            'passenger_name' => $tripRequest->passenger_first_name.' '.$tripRequest->passenger_last_name,
            'trip_date' => $tripRequest->trip_date->toDateString(),
            'pickup_address' => $tripRequest->pickup_address,
            'dropoff_address' => $tripRequest->dropoff_address,
            'input_price' => $tripRequest->input_price,
            'status' => $tripRequest->status,
        ]);

        return back();
    }

    private function generateBookingNumber(): string
    {
        do {
            $number = 'CL-NEMT-'.str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (TripRequest::where('booking_number', $number)->exists());

        return $number;
    }

    private function exportToCsv(TripRequest $tripRequest): string
    {
        $path = 'trip-requests/'.$tripRequest->booking_number.'.csv';
        $handle = fopen('php://temp', 'w');

        fputcsv($handle, TripRequest::CSV_COLUMNS);

        fputcsv($handle, array_map(
            fn (string $column) => $this->csvValue($tripRequest, $column),
            TripRequest::CSV_COLUMNS,
        ));

        rewind($handle);
        Storage::disk('local')->put($path, stream_get_contents($handle));
        fclose($handle);

        return $path;
    }

    private function csvValue(TripRequest $tripRequest, string $column): string
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

        return (string) $value;
    }
}
