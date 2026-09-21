<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'featured_image',
        'category_id', 'author_id', 'status', 'published_at',
        'views_count', 'is_breaking', 'is_featured',
        'meta_title', 'meta_description', 'meta_keywords', 'og_image',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_breaking' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'news_tag');
    }

    // শুধু owner অথবা super_admin এডিট করতে পারবে কিনা - helper
    public function canBeEditedBy(User $user): bool
    {
        return $user->isSuperAdmin() || $this->author_id === $user->id;
    }
}