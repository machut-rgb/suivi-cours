<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsApproved
{
    /**
     * Self-registered délégués must be approved by a responsable before using the app.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->isApproved()) {
            return $request->expectsJson()
                ? abort(403, 'Your account is awaiting approval.')
                : redirect()->route('approval.pending');
        }

        return $next($request);
    }
}
