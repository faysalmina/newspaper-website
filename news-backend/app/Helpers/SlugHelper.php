<?php

namespace App\Helpers;

class SlugHelper
{
    public static function make(string $text): string
    {
        $slug = trim($text);
        $slug = preg_replace('/\s+/u', '-', $slug);
        $slug = preg_replace('/[^\p{L}\p{N}\-]+/u', '', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = mb_strtolower(trim($slug, '-'));

        return $slug !== '' ? $slug : 'item-' . uniqid();
    }

    public static function unique(string $text, string $modelClass, ?int $ignoreId = null): string
    {
        $base = static::make($text);
        $slug = $base;
        $suffix = 2;

        while (
            $modelClass::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}