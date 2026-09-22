<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private array $defaultKeys = [
        'site_name', 'site_tagline', 'footer_text',
        'facebook_url', 'twitter_url', 'youtube_url',
        'google_analytics_id', 'contact_email', 'contact_phone',
    ];

    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        // ফ্রন্টএন্ডে খালি ফিল্ড দেখানোর জন্য ডিফল্ট কী গুলো নিশ্চিত করি
        $result = [];
        foreach ($this->defaultKeys as $key) {
            $result[$key] = $settings[$key] ?? '';
        }

        return response()->json($result);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'site_tagline' => ['nullable', 'string', 'max:255'],
            'footer_text' => ['nullable', 'string', 'max:500'],
            'facebook_url' => ['nullable', 'string', 'max:255'],
            'twitter_url' => ['nullable', 'string', 'max:255'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'google_analytics_id' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        ActivityLog::record($request->user(), 'settings_updated', null, 'সাইট সেটিংস আপডেট করেছেন');

        return response()->json(['message' => 'সেটিংস সেভ হয়েছে']);
    }
}