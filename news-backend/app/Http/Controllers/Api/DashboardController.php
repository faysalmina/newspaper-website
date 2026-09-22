<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        if ($user->isSuperAdmin()) {
            return response()->json([
                'scope' => 'site',
                'total_news' => News::count(),
                'published_news' => News::where('status', 'published')->count(),
                'draft_news' => News::where('status', 'draft')->count(),
                'total_views' => (int) News::sum('views_count'),
                'total_admins' => User::where('role', 'admin')->count(),
                'active_admins' => User::where('role', 'admin')->where('status', 'active')->count(),
                'banned_admins' => User::where('role', 'admin')->where('status', 'banned')->count(),
                'recent_news' => News::with(['author', 'category'])->latest()->take(5)->get(),
            ]);
        }

        return response()->json([
            'scope' => 'own',
            'total_news' => News::where('author_id', $user->id)->count(),
            'published_news' => News::where('author_id', $user->id)->where('status', 'published')->count(),
            'draft_news' => News::where('author_id', $user->id)->where('status', 'draft')->count(),
            'total_views' => (int) News::where('author_id', $user->id)->sum('views_count'),
            'recent_news' => News::with('category')->where('author_id', $user->id)->latest()->take(5)->get(),
        ]);
    }
}