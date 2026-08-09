<?php

namespace App\Http\Controllers\Carelink\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Http\Requests\UpdateServiceRatesRequest;
use App\Models\FleetVehicle;
use App\Models\RideBooking;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'bookings' => RideBooking::ordered()->paginate(10),
            'services' => Service::ordered()->get(),
            'fleet' => FleetVehicle::ordered()->get(),
            'activeRidesCount' => RideBooking::whereIn('status', [RideBooking::STATUS_IN_TRANSIT, RideBooking::STATUS_BAMBI_DISPATCHED])->count(),
            'pendingRidesCount' => RideBooking::where('status', RideBooking::STATUS_PENDING_DISPATCH)->count(),
        ]);
    }

    public function fleet(): Response
    {
        return Inertia::render('admin/fleet', [
            'fleet' => FleetVehicle::ordered()->get(),
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('admin/services', [
            'services' => Service::ordered()->get(),
        ]);
    }

    public function updateBookingStatus(UpdateBookingStatusRequest $request, RideBooking $rideBooking): RedirectResponse
    {
        $rideBooking->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Trip {$rideBooking->booking_number} moved to {$request->input('status')}.",
        ]);

        return back();
    }

    public function updateServiceRates(UpdateServiceRatesRequest $request): RedirectResponse
    {
        collect($request->validated('services'))->each(function (array $data): void {
            Service::whereKey($data['id'])->update([
                'base_rate' => $data['base_rate'],
                'mileage_rate' => $data['mileage_rate'],
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Service rates updated successfully in live dispatch calculator.',
        ]);

        return back();
    }
}
