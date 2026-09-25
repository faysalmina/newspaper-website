<?php

namespace App\Services;

use HTMLPurifier;
use HTMLPurifier_Config;

class ContentSanitizer
{
    public static function clean(string $html): string
    {
        $config = HTMLPurifier_Config::createDefault();

        // নিউজ কনটেন্টে যা যা লাগবে তার একটা নিরাপদ whitelist — <script>, <iframe onerror>, onclick ইত্যাদি সব বাদ পড়ে যাবে
        $config->set('HTML.Allowed', 'p,br,strong,b,em,i,u,ul,ol,li,a[href],h1,h2,h3,h4,blockquote,img[src|alt|width|height]');
        $config->set('HTML.TargetBlank', true);
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true]);
        $config->set('Cache.SerializerPath', storage_path('app/purifier-cache'));

        if (!is_dir(storage_path('app/purifier-cache'))) {
            mkdir(storage_path('app/purifier-cache'), 0755, true);
        }

        $purifier = new HTMLPurifier($config);

        return $purifier->purify($html);
    }
}