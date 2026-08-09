<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\RideBooking;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        $booking = RideBooking::create([
            ...$request->validated(),
            'booking_number' => $this->generateBookingNumber(),
            'bambi_dispatch_ref' => 'Bambi NEMT Dispatch #'.$this->latestDispatchId(),
        ]);

        Inertia::flash('booking', [
            'booking_number' => $booking->booking_number,
            'passenger_name' => $booking->passenger_name,
            'service_type' => $booking->service_type,
            'pickup_address' => $booking->pickup_address,
            'pickup_county' => $booking->pickup_county,
            'destination_address' => $booking->destination_address,
            'destination_county' => $booking->destination_county,
            'ride_date' => $booking->ride_date,
            'ride_time' => $booking->ride_time,
            'estimated_cost' => $booking->estimated_cost,
            'bambi_dispatch_ref' => $booking->bambi_dispatch_ref,
            'status' => $booking->status,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ride booking confirmed & dispatched to Bambi NEMT.',
        ]);

        return back();
    }

    private function generateBookingNumber(): string
    {
        do {
            $number = 'CL-NEMT-'.str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (RideBooking::where('booking_number', $number)->exists());

        return $number;
    }

    private function latestDispatchId(): int
    {
        return RideBooking::count() + 1024;
    }
}
