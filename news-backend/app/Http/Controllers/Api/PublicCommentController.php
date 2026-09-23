<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\Request;

class PublicCommentController extends Controller
{
    // শুধু approved কমেন্ট দেখাবে
    public function index(string $slug)
    {
        $news = News::where('slug', $slug)->where('status', 'published')->firstOrFail();

        $comments = $news->comments()
            ->where('status', 'approved')
            ->latest()
            ->get(['id', 'name', 'comment', 'created_at']);

        return response()->json($comments);
    }

    public function store(Request $request, string $slug)
    {
        $news = News::where('slug', $slug)->where('status', 'published')->firstOrFail();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'comment' => ['required', 'string', 'min:3', 'max:1000'],
            // honeypot ফিল্ড — বট থাকলে এটা পূরণ করে ফেলবে, মানুষ দেখতেই পাবে না (CSS দিয়ে লুকানো)
            'website' => ['nullable', 'max:0'],
        ]);

        $news->comments()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'comment' => $data['comment'],
            'status' => 'pending',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'আপনার কমেন্টটি জমা হয়েছে, মডারেশনের পর এটি প্রকাশিত হবে।',
        ], 201);
    }
}