<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Epaper;

class PublicEpaperController extends Controller
{
    public function index()
    {
        $epapers = Epaper::orderByDesc('publish_date')->paginate(20);
        return response()->json($epapers);
    }

    public function latest()
    {
        $epaper = Epaper::orderByDesc('publish_date')->first();
        return response()->json($epaper);
    }

    public function show(string $date)
    {
        $epaper = Epaper::where('publish_date', $date)->firstOrFail();
        $epaper->increment('downloads_count');
        return response()->json($epaper);
    }
}