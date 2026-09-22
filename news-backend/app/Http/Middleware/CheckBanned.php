<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBanned
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isBanned()) {
            $user->currentAccessToken()?->delete();

            return response()->json([
                'message' => 'আপনার অ্যাকাউন্ট সাসপেন্ড করা হয়েছে।',
            ], 403);
        }

        return $next($request);
    }
}