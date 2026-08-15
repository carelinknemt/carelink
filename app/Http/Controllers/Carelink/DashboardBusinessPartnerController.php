<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Mail\BusinessPartnerApproved;
use App\Mail\BusinessPartnerRejected;
use App\Models\BusinessPartnerRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class DashboardBusinessPartnerController extends Controller
{
    private const PER_PAGE = 15;

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = BusinessPartnerRequest::query();

        if ($status !== BusinessPartnerRequest::STATUS_FILTER_ALL) {
            // No status filter defaults to pending inquiries; the
            // '__all' sentinel reveals every status.
            $query->where('status', $status !== '' ? $status : BusinessPartnerRequest::STATUS_PENDING);
        }

        $requests = $query
            ->when($request->filled('search'), function (Builder $query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function (Builder $query) use ($search): void {
                    $query->where('company_name', 'like', "%{$search}%")
                        ->orWhere('contact_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('business_type', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (BusinessPartnerRequest $request): array => $request->managerSummary());

        return Inertia::render('dashboard/business-partners', [
            'requests' => $requests,
            'filters' => [
                'search' => $request->string('search')->trim()->toString() ?: null,
                'status' => $status ?: BusinessPartnerRequest::STATUS_PENDING,
            ],
            'statuses' => BusinessPartnerRequest::STATUSES,
        ]);
    }

    /**
     * Approve the partnership and email the company's used address.
     */
    public function approve(Request $request, BusinessPartnerRequest $businessRequest): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $businessRequest->update(['status' => BusinessPartnerRequest::STATUS_APPROVED]);

        Mail::to($validated['email'])->send(new BusinessPartnerApproved(
            $businessRequest->company_name,
            $businessRequest->contact_name,
        ));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$businessRequest->company_name} was approved and the company was notified.",
        ]);

        return back();
    }

    /**
     * Reject the partnership and email the company's registered address
     * with the rejection reason.
     */
    public function reject(Request $request, BusinessPartnerRequest $businessRequest): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:5000'],
        ]);

        $businessRequest->update(['status' => BusinessPartnerRequest::STATUS_REJECTED]);

        Mail::to($businessRequest->email)->send(new BusinessPartnerRejected(
            $businessRequest->company_name,
            $businessRequest->contact_name,
            $validated['reason'],
        ));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$businessRequest->company_name} was rejected and the company was notified.",
        ]);

        return back();
    }
}
