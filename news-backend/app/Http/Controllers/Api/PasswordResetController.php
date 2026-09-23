<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        // নিরাপত্তার জন্য — ইমেইল সিস্টেমে আছে কিনা সেটা প্রকাশ করি না (email enumeration attack প্রতিরোধ)
        return response()->json([
            'message' => 'যদি এই ইমেইলটি আমাদের সিস্টেমে থাকে, একটা পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
                $user->tokens()->delete(); // সিকিউরিটি — রিসেটের পর সব পুরনো সেশন লগআউট
                ActivityLog::record($user, 'password_reset', null, "{$user->name} পাসওয়ার্ড রিসেট করেছেন");
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => ['এই টোকেনটি অবৈধ বা মেয়াদোত্তীর্ণ হয়ে গেছে। আবার রিকোয়েস্ট করুন।'],
            ]);
        }

        return response()->json(['message' => 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।']);
    }
}