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

    // সাধারণ resize (অনুপাত ঠিক রেখে, শুধু প্রস্থ কমায়) — অ্যাড, ভিডিও থাম্বনেইল, ই-পেপার কভারের জন্য
    public static function processAndStore(UploadedFile $file, string $folder = 'news', int $maxWidth = 1200): string
    {
        $filename = Str::random(20) . '.jpg';
        $relativePath = "{$folder}/{$filename}";

        $image = static::manager()->decodePath($file->getRealPath());

        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        $image->fillTransparentAreas('ffffff');
        $encoded = $image->encodeUsingFormat(Format::JPEG, quality: 82);

        Storage::disk('public')->put($relativePath, (string) $encoded);

        return $relativePath;
    }

    // 🔑 নতুন — exact ডাইমেনশনে crop+resize করে (অনুপাত ভেঙে হলেও ফ্রেমটা পুরোপুরি ভরবে)
    // নিউজের ফিচার্ড ইমেজের জন্য — সবসময় 1080x560 হবে, যেকোনো ইনপুট সাইজ/অনুপাত থেকেই
    public static function processAndStoreCover(UploadedFile $file, string $folder, int $width, int $height): string
    {
        $filename = Str::random(20) . '.jpg';
        $relativePath = "{$folder}/{$filename}";

        $image = static::manager()->decodePath($file->getRealPath());
        $image->cover($width, $height);
        $image->fillTransparentAreas('ffffff');

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