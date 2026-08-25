<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlacklistRequest;
use App\Models\PassengerBlacklist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardBlacklistController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $entries = PassengerBlacklist::query()
            ->with('blacklister:id,name')
            ->when($search, function ($query, $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('email', 'like', "%{$search}%")
                        ->orWhere('phone_digits', 'like', "%{$search}%")
                        ->orWhere('reason', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard/blacklist', [
            'blacklist' => $entries,
            'filters' => [
                'search' => $search ?: null,
            ],
        ]);
    }

    public function store(StoreBlacklistRequest $request): RedirectResponse
    {
        $email = $request->input('email')
            ? strtolower(trim($request->input('email')))
            : null;
        $phoneDigits = $request->input('phone')
            ? PassengerBlacklist::digitsFromPhone($request->input('phone'))
            : null;

        $exists = PassengerBlacklist::query()
            ->where(function ($q) use ($email, $phoneDigits): void {
                if ($email) {
                    $q->where('email', $email);
                }
                if ($phoneDigits) {
                    $q->orWhere('phone_digits', $phoneDigits);
                }
            })
            ->exists();

        if ($exists) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'This passenger is already blacklisted.',
            ]);

            return back();
        }

        PassengerBlacklist::create([
            'email' => $email,
            'phone_digits' => $phoneDigits,
            'reason' => $request->input('reason'),
            'blacklisted_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Passenger has been blacklisted.',
        ]);

        return back();
    }

    public function destroy(PassengerBlacklist $blacklist): RedirectResponse
    {
        $blacklist->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Passenger has been removed from the blacklist.',
        ]);

        return back();
    }
}
