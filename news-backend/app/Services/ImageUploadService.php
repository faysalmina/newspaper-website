<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ImageUploadService
{
    // আপলোড হওয়া ইমেজকে resize + compress + WebP এ কনভার্ট করে স্টোর করে
    // একটা 3-4MB এর ছবিও এটার পর সাধারণত 100-200KB হয়ে যায়, মান প্রায় অপরিবর্তিত থাকে
    public static function processAndStore(UploadedFile $file, string $folder = 'news', int $maxWidth = 1200): string
    {
        $filename = Str::random(20) . '.webp';
        $relativePath = "{$folder}/{$filename}";

        $image = Image::read($file);

        // অনুপাত ঠিক রেখে সর্বোচ্চ প্রস্থ (ছোট ছবিকে বড় করবে না, শুধু বড়টাকে ছোট করবে)
        if ($image->width() > $maxWidth) {
            $image->scale(width: $maxWidth);
        }

        $encoded = $image->toWebp(quality: 80);

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