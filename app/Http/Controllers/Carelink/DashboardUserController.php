<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Mail\KmsIntroMail;
use App\Models\CareerApplication;
use App\Models\TripRequestAudit;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardUserController extends Controller
{
    private const PER_PAGE = 15;

    /**
     * User management: list, invite via password reset link,
     * and ban/unban accounts.
     */
    public function index(Request $request): Response
    {

        $users = User::query()
            ->when($request->filled('search'), function (Builder $query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('role'), function (Builder $query) use ($request): void {
                $role = $request->string('role')->trim()->toString();

                if (in_array($role, User::ROLES, true)) {
                    $query->where('role', $role);
                }
            })
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (User $user): array => $this->summary($user));

        return Inertia::render('dashboard/users', [
            'users' => $users,
            'filters' => [
                'search' => $request->string('search')->trim()->toString() ?: null,
                'role' => $request->string('role')->trim()->toString() ?: null,
            ],
            'current_user_id' => $request->user()->id,
        ]);
    }

    /**
     * User detail: account info plus a recent section of the user's job
     * applications and the booking changes they performed.
     */
    public function show(Request $request, User $user): Response
    {
        $applications = $user->careerApplications()
            ->with('career:id,title')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (CareerApplication $application): array => [
                'id' => $application->id,
                'position' => $application->career?->title,
                'name' => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'resume_name' => $application->resume_name,
                'submitted_at' => $application->created_at?->toIso8601String(),
            ]);

        $documents = $user->userDocuments->map(fn (UserDocument $document): array => [
            'id' => $document->id,
            'type' => $document->type,
            'label' => $document->typeLabel(),
            'file_name' => $document->file_name,
            'file_size' => $document->file_size,
            'created_at' => $document->created_at->toIso8601String(),
        ]);

        $audits = $user->tripRequestAudits()
            ->with('tripRequest:id,booking_number')
            ->limit(20)
            ->get()
            ->map(fn (TripRequestAudit $audit): array => [
                'id' => $audit->id,
                'trip_request_id' => $audit->trip_request_id,
                'booking_number' => $audit->tripRequest?->booking_number,
                'action' => $audit->action,
                'from_value' => $audit->from_value,
                'to_value' => $audit->to_value,
                'reason' => $audit->reason,
                'created_at' => $audit->created_at->toIso8601String(),
            ]);

        return Inertia::render('dashboard/users/show', [
            'user' => $this->profile($user),
            'current_user_id' => $request->user()->id,
            'applications' => $applications,
            'audits' => $audits,
            'documents' => $documents,
        ]);
    }

    /**
     * Create the account without a usable password and immediately send
     * the user a password reset link so they choose their own password.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['sometimes', 'string', 'in:'.implode(',', User::ROLES)],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'hired_date' => ['nullable', 'date'],
            'driver_license_number' => ['nullable', 'string', 'max:255'],
            'license_expiration_date' => ['nullable', 'date', 'after:today'],
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required_with:documents', 'file', 'max:10240'],
            'documents.*.type' => ['required_with:documents', 'string', 'in:'.implode(',', UserDocument::TYPES)],
            'documents.*.label' => ['nullable', 'string', 'max:255'],
        ]);

        $name = trim(($validated['first_name'] ?? '').' '.($validated['last_name'] ?? '')) ?: $validated['name'] ?? '';

        if ($name === '') {
            return back()->withErrors(['name' => 'The name field is required.']);
        }

        $user = User::create([
            'name' => $name,
            'first_name' => $validated['first_name'] ?? null,
            'last_name' => $validated['last_name'] ?? null,
            'email' => $validated['email'],
            'password' => Str::password(32),
            'role' => $validated['role'] ?? User::ROLE_DISPATCHER,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'hired_date' => $validated['hired_date'] ?? null,
            'driver_license_number' => $validated['driver_license_number'] ?? null,
            'license_expiration_date' => $validated['license_expiration_date'] ?? null,
        ]);

        $this->storeDocuments($user, $validated['documents'] ?? []);

        $status = Password::broker()->sendResetLink(['email' => $user->email]);

        if ($status !== Password::RESET_LINK_SENT) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => "{$user->email} was added, but the password reset email could not be sent. Use the forgot password link at login.",
            ]);

            return back();
        }

        Mail::to($user->email)->send(new KmsIntroMail($user));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$user->email} was added and their welcome links were sent.",
        ]);

        return back();
    }

    /**
     * Update a user's employee details (name, dates, license) from the
     * user detail page.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'hired_date' => ['nullable', 'date'],
            'driver_license_number' => ['nullable', 'string', 'max:255'],
            'license_expiration_date' => ['nullable', 'date', 'after:today'],
        ]);

        $name = trim(($validated['first_name'] ?? $user->first_name ?? '').' '.($validated['last_name'] ?? $user->last_name ?? ''));

        $user->update([
            'name' => $name,
            'first_name' => $validated['first_name'] ?? $user->first_name,
            'last_name' => $validated['last_name'] ?? $user->last_name,
            'email' => $validated['email'],
            'date_of_birth' => $validated['date_of_birth'] ?? $user->date_of_birth?->toDateString(),
            'hired_date' => $validated['hired_date'] ?? $user->hired_date?->toDateString(),
            'driver_license_number' => $validated['driver_license_number'] ?? $user->driver_license_number,
            'license_expiration_date' => $validated['license_expiration_date'] ?? $user->license_expiration_date?->toDateString(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$user->name}'s details were updated.",
        ]);

        return back();
    }

    /**
     * Attach an employee document to a user.
     */
    public function storeDocument(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:10240'],
            'type' => ['required', 'string', 'in:'.implode(',', UserDocument::TYPES)],
            'label' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');

        $user->userDocuments()->create([
            'type' => $validated['type'],
            'label' => $validated['label'] ?? null,
            'file_path' => $file->store('user-documents', 'local'),
            'file_name' => Str::limit($file->getClientOriginalName(), 255),
            'file_size' => $file->getSize(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Document attached.',
        ]);

        return back();
    }

    /**
     * Remove an employee document and its stored file.
     */
    public function destroyDocument(Request $request, User $user, UserDocument $document): RedirectResponse
    {
        if ($document->user_id !== $user->id) {
            abort(404);
        }

        Storage::disk('local')->delete($document->file_path);

        $document->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Document removed.',
        ]);

        return back();
    }

    /**
     * Stream an employee document from private storage.
     */
    public function downloadDocument(Request $request, User $user, UserDocument $document): StreamedResponse
    {
        if ($document->user_id !== $user->id) {
            abort(404);
        }

        return Storage::disk('local')->download($document->file_path, $document->file_name);
    }

    /**
     * Persist the documents submitted with a new user.
     *
     * @param  array<int, array{file: UploadedFile, type?: string, label?: string|null}>  $documents
     */
    private function storeDocuments(User $user, array $documents): void
    {
        foreach ($documents as $document) {
            $file = $document['file'];

            $user->userDocuments()->create([
                'type' => $document['type'] ?? UserDocument::TYPE_CUSTOM,
                'label' => $document['label'] ?? null,
                'file_path' => $file->store('user-documents', 'local'),
                'file_name' => Str::limit($file->getClientOriginalName(), 255),
                'file_size' => $file->getSize(),
            ]);
        }
    }

    /**
     * Change a user's role. Cannot change own role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'You cannot change your own role.',
            ]);

            return back();
        }

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:'.implode(',', User::ROLES)],
        ]);

        $user->update(['role' => $validated['role']]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$user->name}'s role was updated to ".ucfirst($validated['role']).'.',
        ]);

        return back();
    }

    /**
     * Ban an active account or lift the ban. Admins cannot ban themselves.
     */
    public function toggleBan(Request $request, User $user): RedirectResponse
    {

        if ($user->id === $request->user()->id) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'You cannot ban your own account.',
            ]);

            return back();
        }

        $user->update([
            'banned_at' => $user->isBanned() ? null : now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $user->isBanned()
                ? "{$user->name} was banned and their active sessions were ended."
                : "{$user->name} was unbanned and can sign in again.",
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'banned_at' => $user->banned_at?->toIso8601String(),
            'joined_at' => $user->created_at?->toIso8601String(),
        ];
    }

    /**
     * Full account profile for the user detail page.
     *
     * @return array<string, mixed>
     */
    private function profile(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'banned_at' => $user->banned_at?->toIso8601String(),
            'joined_at' => $user->created_at?->toIso8601String(),
            'updated_at' => $user->updated_at?->toIso8601String(),
            'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            'date_of_birth' => $user->date_of_birth?->toDateString(),
            'hired_date' => $user->hired_date?->toDateString(),
            'driver_license_number' => $user->driver_license_number,
            'license_expiration_date' => $user->license_expiration_date?->toDateString(),
            'two_factor_enabled' => $user->two_factor_confirmed_at !== null,
            'sessions_count' => (int) DB::table('sessions')->where('user_id', $user->id)->count(),
        ];
    }
}
