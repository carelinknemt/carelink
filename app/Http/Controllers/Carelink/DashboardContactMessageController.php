<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardContactMessageController extends Controller
{
    private const PER_PAGE = 15;

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = ContactMessage::query();

        if ($status !== ContactMessage::STATUS_FILTER_ALL) {
            $query->where(
                'status',
                $status !== '' ? $status : ContactMessage::STATUS_PENDING,
            );
        }

        $messages = $query
            ->when($request->filled('search'), function (Builder $query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (ContactMessage $message): array => $message->managerSummary());

        return Inertia::render('dashboard/contact-messages', [
            'messages' => $messages,
            'filters' => [
                'search' => $request->string('search')->trim()->toString() ?: null,
                'status' => $status ?: ContactMessage::STATUS_PENDING,
            ],
            'statuses' => ContactMessage::STATUSES,
        ]);
    }

    public function markRead(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->update([
            'status' => ContactMessage::STATUS_READ,
            'read_at' => now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "The message from {$contactMessage->name} was marked as read.",
        ]);

        return back();
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $name = $contactMessage->name;

        $contactMessage->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "The message from {$name} was deleted.",
        ]);

        return back();
    }
}
