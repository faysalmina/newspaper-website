<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageUploadService
{
    protected static function manager(): ImageManager
    {
        return ImageManager::usingDriver(Driver::class);
    }

    public static function processAndStore(UploadedFile $file, string $folder = 'news', int $maxWidth = 1200): string
    {
        $filename = Str::random(20) . '.jpg';
        $relativePath = "{$folder}/{$filename}";

        $image = static::manager()->decodePath($file->getRealPath());

        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        // WebP এর বদলে JPEG — GD-তে সবসময় built-in সাপোর্ট থাকে, কোনো এক্সট্রা কম্পাইল ফ্ল্যাগ লাগে না
        $encoded = $image->toJpeg(quality: 82);

        Storage::disk('public')->put($relativePath, (string) $encoded);

        return $relativePath;
    }

    public static function delete(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}