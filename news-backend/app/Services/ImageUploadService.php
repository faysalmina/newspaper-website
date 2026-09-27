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

        // যেকোনো ফরম্যাট (PNG, JPG, GIF, WebP, BMP...) স্বয়ংক্রিয়ভাবে detect করে decode করে
        $image = static::manager()->decodePath($file->getRealPath());

        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        // PNG/GIF এর মতো transparent এলাকা থাকলে সাদা রঙে ভরে দিচ্ছে —
        // এটা v4-এর নিজস্ব built-in মেথড, JPEG-এ transparency সাপোর্ট নেই বলে এটা দরকার
        $image->fillTransparentAreas('ffffff');

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