<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Mail\KmsIntroMail;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

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
     * Create the account without a usable password and immediately send
     * the user a password reset link so they choose their own password.
     */
    public function store(Request $request): RedirectResponse
    {

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['sometimes', 'string', 'in:'.implode(',', User::ROLES)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Str::password(32),
            'role' => $validated['role'] ?? User::ROLE_DISPATCHER,
        ]);

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
}
