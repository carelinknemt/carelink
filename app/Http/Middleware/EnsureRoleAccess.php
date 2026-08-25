<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureRoleAccess
{
    /**
     * Restrict access to users whose role is in the allowed list.
     * Usage: ->middleware('role:admin,manager')
     *
     * @param  Closure(Request): (Response)  $next
     * @param  string  ...$roles  Allowed role names
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, $roles, true)) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'You do not have permission to access that page.',
            ]);

            return back();
        }

        return $next($request);
    }
}
