<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = \App\Models\User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['প্রদত্ত তথ্য আমাদের রেকর্ডের সাথে মিলছে না।'],
            ]);
        }

        if ($user->isBanned()) {
            throw ValidationException::withMessages([
                'email' => ['আপনার অ্যাকাউন্টটি সাসপেন্ড করা হয়েছে। অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->update(['last_login_at' => now()]);
        ActivityLog::record($user, 'login', null, "{$user->name} লগইন করেছেন");

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'সফলভাবে লগআউট হয়েছে']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}