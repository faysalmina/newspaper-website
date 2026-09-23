<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\News;
use Illuminate\Http\Request;

class PublicNewsController extends Controller
{
    // হোমপেজের জন্য: ফিচার্ড + ব্রেকিং + লেটেস্ট + সর্বাধিক পঠিত — একসাথে এক কলে
    public function featured()
    {
        $featured = News::with(['category', 'author'])
            ->where('status', 'published')
            ->where('is_featured', true)
            ->latest('published_at')
            ->first();

        if (!$featured) {
            $featured = News::with(['category', 'author'])
                ->where('status', 'published')
                ->latest('published_at')
                ->first();
        }

        $breaking = News::where('status', 'published')
            ->where('is_breaking', true)
            ->latest('published_at')
            ->limit(8)
            ->pluck('title');

        $latest = News::with(['category', 'author'])
            ->where('status', 'published')
            ->when($featured, fn($q) => $q->where('id', '!=', $featured->id))
            ->latest('published_at')
            ->limit(6)
            ->get();

        $mostRead = News::with('category')
            ->where('status', 'published')
            ->orderByDesc('views_count')
            ->limit(5)
            ->get();

        return response()->json([
            'featured' => $featured ? $this->transform($featured) : null,
            'breaking' => $breaking,
            'latest' => $latest->map(fn($n) => $this->transform($n)),
            'most_read' => $mostRead->map(fn($n) => $this->transform($n)),
        ]);
    }

    // সব প্রকাশিত নিউজ (পেজিনেটেড, সার্চ সাপোর্ট সহ)
    public function index(Request $request)
    {
        $query = News::with(['category', 'author'])
            ->where('status', 'published')
            ->latest('published_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $news = $query->paginate(12);
        $news->getCollection()->transform(fn($n) => $this->transform($n));

        return response()->json($news);
    }

    // একটা ক্যাটাগরির সব নিউজ
    public function byCategory(string $slug)
    {
        $category = Category::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $news = News::with(['category', 'author'])
            ->where('status', 'published')
            ->where('category_id', $category->id)
            ->latest('published_at')
            ->paginate(12);

        $news->getCollection()->transform(fn($n) => $this->transform($n));

        return response()->json([
            'category' => $category,
            'news' => $news,
        ]);
    }

    // একটা সিঙ্গেল নিউজ (স্লাগ দিয়ে) + রিলেটেড নিউজ + ভিউ কাউন্ট বাড়বে
    public function show(string $slug)
    {
        $news = News::with(['category', 'author', 'tags'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $news->increment('views_count');

        $related = News::with('category')
            ->where('status', 'published')
            ->where('category_id', $news->category_id)
            ->where('id', '!=', $news->id)
            ->latest('published_at')
            ->limit(4)
            ->get();

        return response()->json([
            'news' => $this->transform($news, true),
            'related' => $related->map(fn($n) => $this->transform($n)),
        ]);
    }

    public function categories()
    {
        return response()->json(
            Category::where('is_active', true)->orderBy('order')->get(['id', 'name', 'slug'])
        );
    }

        // হোমপেজের জন্য — প্রতিটা ক্যাটাগরির সর্বশেষ ৪টা নিউজ (daily-bangladesh স্টাইল সেকশন)
    public function homeSections()
    {
        $categories = Category::where('is_active', true)->orderBy('order')->get();

        $sections = $categories->map(function ($cat) {
            $news = News::with('category')
                ->where('status', 'published')
                ->where('category_id', $cat->id)
                ->latest('published_at')
                ->limit(4)
                ->get();

            if ($news->isEmpty()) {
                return null;
            }

            return [
                'category' => ['name' => $cat->name, 'slug' => $cat->slug],
                'news' => $news->map(fn($n) => $this->transform($n)),
            ];
        })->filter()->values();

        return response()->json($sections);
    }
        // Sitemap বানানোর জন্য — সব প্রকাশিত নিউজের হালকা তথ্য (title/content ছাড়া, দ্রুত লোডের জন্য)
    public function sitemapData()
    {
        $news = News::where('status', 'published')
            ->select('slug', 'category_id', 'updated_at')
            ->with('category:id,slug')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn($n) => [
                'slug' => $n->slug,
                'category_slug' => $n->category?->slug,
                'updated_at' => $n->updated_at,
            ]);

        $categories = Category::where('is_active', true)
            ->select('slug', 'updated_at')
            ->get();

        return response()->json(['news' => $news, 'categories' => $categories]);
    }

    // RSS Feed-এর জন্য — সাম্প্রতিক ৫০টা নিউজ
    public function feed()
    {
        $news = News::with(['category', 'author'])
            ->where('status', 'published')
            ->latest('published_at')
            ->limit(50)
            ->get();

        return response()->json($news->map(fn($n) => $this->transform($n)));
    }

    private function transform(News $news, bool $full = false): array
    {
        return [
            'id' => $news->id,
            'title' => $news->title,
            'slug' => $news->slug,
            'excerpt' => $news->excerpt,
            'content' => $full ? $news->content : null,
            'featured_image' => $news->featured_image,
            'category_name' => $news->category?->name,
            'category_slug' => $news->category?->slug,
            'author_name' => $news->author?->name,
            'published_at' => $news->published_at,
            'views_count' => $news->views_count,
            'is_breaking' => $news->is_breaking,
            'is_featured' => $news->is_featured,
            'meta_title' => $news->meta_title,
            'meta_description' => $news->meta_description,
            'og_image' => $news->og_image,
            'tags' => $news->relationLoaded('tags') ? $news->tags->pluck('name') : [],
        ];
    }
}