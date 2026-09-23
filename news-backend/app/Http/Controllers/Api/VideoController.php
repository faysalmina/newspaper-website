<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SlugHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Models\ActivityLog;
use App\Models\Video;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Video::class);

        $videos = Video::with(['category', 'author'])->latest()->paginate(15);

        $videos->getCollection()->transform(function ($item) use ($request) {
            $item->can_edit = $item->canBeEditedBy($request->user());
            return $item;
        });

        return response()->json($videos);
    }

    public function store(StoreVideoRequest $request)
    {
        $this->authorize('create', Video::class);

        $data = $request->validated();
        $data['slug'] = SlugHelper::make($data['title']);
        $data['author_id'] = $request->user()->id;

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = ImageUploadService::processAndStore($request->file('thumbnail'), 'videos/thumbnails');
        }

        if ($data['video_type'] === 'upload' && $request->hasFile('video_file')) {
            $data['video_file'] = $request->file('video_file')->store('videos', 'public');
        }

        $video = Video::create($data);

        ActivityLog::record($request->user(), 'video_created', $video, "\"{$video->title}\" ভিডিও পোস্ট করেছেন");

        return response()->json($video->load(['category', 'author']), 201);
    }

    public function show(Video $video)
    {
        $this->authorize('view', $video);
        return response()->json($video->load(['category', 'author']));
    }

    public function update(UpdateVideoRequest $request, Video $video)
    {
        $this->authorize('update', $video);

        $data = $request->validated();

        if (isset($data['title']) && $data['title'] !== $video->title) {
            $data['slug'] = SlugHelper::make($data['title']);
        }

        if (($data['status'] ?? $video->status) === 'published' && !$video->published_at) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('thumbnail')) {
            ImageUploadService::delete($video->thumbnail);
            $data['thumbnail'] = ImageUploadService::processAndStore($request->file('thumbnail'), 'videos/thumbnails');
        }

        if (($data['video_type'] ?? $video->video_type) === 'upload' && $request->hasFile('video_file')) {
            if ($video->video_file) {
                Storage::disk('public')->delete($video->video_file);
            }
            $data['video_file'] = $request->file('video_file')->store('videos', 'public');
        }

        $video->update($data);

        ActivityLog::record($request->user(), 'video_updated', $video, "\"{$video->title}\" ভিডিও আপডেট করেছেন");

        return response()->json($video->load(['category', 'author']));
    }

    public function destroy(Request $request, Video $video)
    {
        $this->authorize('delete', $video);

        ImageUploadService::delete($video->thumbnail);
        if ($video->video_file) {
            Storage::disk('public')->delete($video->video_file);
        }

        $title = $video->title;
        $video->delete();

        ActivityLog::record($request->user(), 'video_deleted', null, "\"{$title}\" ভিডিও ডিলিট করেছেন");

        return response()->json(['message' => 'ভিডিও ডিলিট করা হয়েছে']);
    }
}