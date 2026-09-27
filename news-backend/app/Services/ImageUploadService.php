<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
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

        $image->fillTransparentAreas('ffffff');

        // toJpeg() শর্টকাট এই ভার্সনে নেই — encodeUsingFormat() ব্যবহার করছি,
        // এটাই সেই পদ্ধতি যা আগে WEBP এর ক্ষেত্রে সফলভাবে GD পর্যন্ত পৌঁছেছিল
        $encoded = $image->encodeUsingFormat(Format::JPEG, quality: 82);

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