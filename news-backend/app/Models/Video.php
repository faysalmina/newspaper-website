<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'video_type', 'video_url', 'video_file',
        'thumbnail', 'category_id', 'author_id', 'status', 'published_at', 'views_count',
    ];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function canBeEditedBy(User $user): bool
    {
        return $user->isSuperAdmin() || $this->author_id === $user->id;
    }

    // YouTube লিংক (যেকোনো ফরম্যাট) থেকে embed URL বের করে — প্লেয়ারে বসানোর জন্য
    public function getEmbedUrlAttribute(): ?string
    {
        if ($this->video_type === 'upload') {
            return null;
        }

        $url = $this->video_url ?? '';
        preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/', $url, $matches);

        return isset($matches[1]) ? "https://www.youtube.com/embed/{$matches[1]}" : $url;
    }
}