<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Colors\Rgb\Color;
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

        // যেকোনো ফরম্যাট (PNG, JPG, GIF, WebP, BMP...) স্বয়ংক্রিয়ভাবে detect করে decode করে
        $image = static::manager()->decodePath($file->getRealPath());

        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        // PNG-এর মতো transparent ছবিকে সাদা ব্যাকগ্রাউন্ডে বসিয়ে দিচ্ছি,
        // কারণ JPEG ফরম্যাট transparency সাপোর্ট করে না — এটা ছাড়া PNG এনকোড করতে গেলে এরর হতে পারে
        $canvas = static::manager()->create($image->width(), $image->height())->fill('ffffff');
        $canvas->place($image, 'top-left', 0, 0);

        $encoded = $canvas->toJpeg(quality: 82);

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