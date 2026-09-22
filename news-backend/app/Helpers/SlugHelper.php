<?php

namespace App\Helpers;

class SlugHelper
{
    // বাংলা টাইটেল থেকে SEO-friendly slug বানায় (বাংলা অক্ষর রেখেই — daily-bangladesh.com এর মতো)
    public static function make(string $text): string
    {
        $slug = trim($text);
        $slug = preg_replace('/\s+/u', '-', $slug);
        $slug = preg_replace('/[^\p{L}\p{N}\-]+/u', '', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        $slug = mb_strtolower($slug);

        return $slug !== '' ? $slug : 'news-' . uniqid();
    }
}