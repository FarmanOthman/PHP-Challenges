<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AzureSasTokenSecurity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the request is AJAX/XHR
        if (!$request->ajax() && !$request->wantsJson()) {
            Log::warning('Direct SAS token access attempt detected', [
                'ip' => $request->ip(),
                'user_id' => $request->user() ? $request->user()->id : 'unauthenticated',
            ]);
            return response()->json(['error' => 'Unauthorized access'], 403);
        }
        
        // Rate limiting (optional additional protection)
        // We will use Laravel's built-in throttle middleware for this
        
        // Time-based token validity check
        $permissions = $request->input('permissions', 'w');
        $expiryMinutes = $request->input('expiry', 60);
        
        // Enforce maximum limits
        if ($expiryMinutes > 120) {
            return response()->json([
                'error' => 'Maximum expiry time is 120 minutes'
            ], 400);
        }
        
        // Restrict permissions to only what's necessary
        $allowedPermissions = ['r', 'w', 'rw'];
        if (!in_array($permissions, $allowedPermissions)) {
            return response()->json([
                'error' => 'Invalid permissions requested'
            ], 400);
        }
        
        // Additional security checks could be added here
        
        return $next($request);
    }
}