<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicAdController extends Controller
{
    // একটা নির্দিষ্ট পজিশনের সব সক্রিয় অ্যাড দেখায় (impression কাউন্ট বাড়িয়ে দেয়)
    public function byPosition(Request $request, string $position)
    {
        $ads = Ad::currentlyActive()
            ->where('position', $position)
            ->orderBy('order')
            ->get();

        // impression কাউন্ট — একসাথে সব কটা বাড়িয়ে দিচ্ছি (perf-friendly bulk update)
        if ($ads->isNotEmpty()) {
            Ad::whereIn('id', $ads->pluck('id'))->increment('impressions_count');
        }

        return response()->json($ads->map(fn($ad) => [
            'id' => $ad->id,
            'ad_type' => $ad->ad_type,
            'image' => $ad->image,
            'video_url' => $ad->video_url,
            'target_url' => $ad->target_url,
            'width' => $ad->width,
            'height' => $ad->height,
        ]));
    }

    // ইউজার অ্যাডে ক্লিক করলে এটা কল হয় (ক্লিক কাউন্ট বাড়িয়ে target_url এ রিডাইরেক্ট করে)
    public function click(Ad $ad)
    {
        $ad->increment('clicks_count');

        $url = $ad->target_url ?: '/';

        return redirect()->away($url);
    }
}