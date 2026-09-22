<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SlugHelper;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    // সবাই (admin/super_admin) নিউজ ফর্মে ব্যবহারের জন্য লিস্ট দেখতে পারবে
    public function index()
    {
        return response()->json(
            Category::withCount('news')->orderBy('order')->get()
        );
    }

    // নিচেরগুলো শুধু super_admin — route middleware দিয়ে প্রোটেক্টেড
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
        ]);

        $category = Category::create([
            'name' => $data['name'],
            'slug' => SlugHelper::make($data['name']),
            'icon' => $data['icon'] ?? null,
            'order' => $data['order'] ?? 0,
            'is_active' => true,
        ]);

        ActivityLog::record($request->user(), 'category_created', $category, "নতুন ক্যাটাগরি তৈরি: {$category->name}");

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = SlugHelper::make($data['name']);
        }

        $category->update($data);

        ActivityLog::record($request->user(), 'category_updated', $category, "ক্যাটাগরি আপডেট: {$category->name}");

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->news()->exists()) {
            abort(422, 'এই ক্যাটাগরিতে নিউজ আছে, তাই ডিলিট করা যাবে না। আগে নিউজগুলো অন্য ক্যাটাগরিতে সরান।');
        }

        $name = $category->name;
        $category->delete();

        ActivityLog::record($request->user(), 'category_deleted', null, "ক্যাটাগরি ডিলিট: {$name}");

        return response()->json(['message' => 'ক্যাটাগরি ডিলিট করা হয়েছে']);
    }
}