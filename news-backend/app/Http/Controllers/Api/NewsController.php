<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SlugHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use App\Models\ActivityLog;
use App\Models\News;
use App\Models\Tag;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', News::class);

        $news = News::with(['category', 'author', 'tags'])
            ->latest()
            ->paginate(15);

        $news->getCollection()->transform(function ($item) use ($request) {
            $item->can_edit = $item->canBeEditedBy($request->user());
            return $item;
        });

        return response()->json($news);
    }

    public function store(StoreNewsRequest $request)
    {
        $this->authorize('create', News::class);

        $data = $request->validated();
        $data['slug'] = SlugHelper::make($data['title']);
        $data['author_id'] = $request->user()->id;
        $data['content'] = \App\Services\ContentSanitizer::clean($data['content']);

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = ImageUploadService::processAndStore($request->file('featured_image'));
        }

        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $news = News::create($data);

        if (!empty($tags)) {
            $news->tags()->sync($this->resolveTagIds($tags));
        }

        ActivityLog::record($request->user(), 'news_created', $news, "\"{$news->title}\" নিউজ তৈরি করেছেন");

        return response()->json($news->load(['category', 'author', 'tags']), 201);
    }

    public function show(News $news)
    {
        $this->authorize('view', $news);

        return response()->json($news->load(['category', 'author', 'tags']));
    }

    public function update(UpdateNewsRequest $request, News $news)
    {
        $this->authorize('update', $news);

        $data = $request->validated();

        if (isset($data['title']) && $data['title'] !== $news->title) {
            $data['slug'] = SlugHelper::make($data['title']);
        }

        if (isset($data['content'])) {
            $data['content'] = \App\Services\ContentSanitizer::clean($data['content']);
        }

        if ($request->hasFile('featured_image')) {
            ImageUploadService::delete($news->featured_image);
            $data['featured_image'] = ImageUploadService::processAndStore($request->file('featured_image'));
        }

        if ((($data['status'] ?? $news->status) === 'published') && !$news->published_at) {
            $data['published_at'] = $data['published_at'] ?? now();
        }

        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        $news->update($data);

        if ($tags !== null) {
            $news->tags()->sync($this->resolveTagIds($tags));
        }

        ActivityLog::record($request->user(), 'news_updated', $news, "\"{$news->title}\" নিউজ আপডেট করেছেন");

        return response()->json($news->load(['category', 'author', 'tags']));
    }

    public function destroy(Request $request, News $news)
    {
        $this->authorize('delete', $news);

        ImageUploadService::delete($news->featured_image);

        $title = $news->title;
        $news->delete();

        ActivityLog::record($request->user(), 'news_deleted', null, "\"{$title}\" নিউজ ডিলিট করেছেন");

        return response()->json(['message' => 'নিউজ ডিলিট করা হয়েছে']);
    }

    private function resolveTagIds(array $tagNames): array
    {
        return collect($tagNames)->filter()->map(function ($name) {
            $name = trim($name);
            $tag = Tag::firstOrCreate(
                ['slug' => SlugHelper::make($name)],
                ['name' => $name]
            );
            return $tag->id;
        })->toArray();
    }
}