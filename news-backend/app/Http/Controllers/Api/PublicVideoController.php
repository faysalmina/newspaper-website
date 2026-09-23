<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;

class PublicVideoController extends Controller
{
    public function index()
    {
        $videos = Video::with(['category', 'author'])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(12);

        $videos->getCollection()->transform(fn($v) => $this->transform($v));

        return response()->json($videos);
    }

    // হোমপেজ সেকশনের জন্য — সর্বশেষ ৫টা
    public function latest()
    {
        $videos = Video::where('status', 'published')
            ->latest('published_at')
            ->limit(5)
            ->get();

        return response()->json($videos->map(fn($v) => $this->transform($v)));
    }

    public function show(string $slug)
    {
        $video = Video::with(['category', 'author'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $video->increment('views_count');

        $related = Video::where('status', 'published')
            ->where('id', '!=', $video->id)
            ->latest('published_at')
            ->limit(4)
            ->get();

        return response()->json([
            'video' => $this->transform($video, true),
            'related' => $related->map(fn($v) => $this->transform($v)),
        ]);
    }

    private function transform(Video $video, bool $full = false): array
    {
        return [
            'id' => $video->id,
            'title' => $video->title,
            'slug' => $video->slug,
            'description' => $full ? $video->description : null,
            'thumbnail' => $video->thumbnail,
            'video_type' => $video->video_type,
            'embed_url' => $video->embed_url,
            'video_file' => $video->video_file,
            'category_name' => $video->category?->name,
            'category_slug' => $video->category?->slug,
            'author_name' => $video->author?->name,
            'published_at' => $video->published_at,
            'views_count' => $video->views_count,
        ];
    }
}