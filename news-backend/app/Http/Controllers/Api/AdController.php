<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Ad;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class AdController extends Controller
{
    public function index()
    {
        return response()->json(Ad::orderBy('position')->orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'ad_type' => ['required', 'in:image,video'],
            'image' => ['required_if:ad_type,image', 'nullable', 'image', 'max:5120'],
            'video_url' => ['required_if:ad_type,video', 'nullable', 'string', 'max:500'],
            'target_url' => ['nullable', 'string', 'max:500'],
            'position' => ['required', 'in:header,sidebar,in_article,homepage_top,footer'],
            'width' => ['nullable', 'integer', 'min:1'],
            'height' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'order' => ['nullable', 'integer'],
        ]);

        if ($request->hasFile('image')) {
            // অ্যাড ইমেজ resize না করে প্রায় অরিজিনাল কোয়ালিটি রাখছি (compress শুধু), কারণ অ্যাডের exact সাইজ গুরুত্বপূর্ণ
            $data['image'] = ImageUploadService::processAndStore($request->file('image'), 'ads', 1000);
        }

        $ad = Ad::create($data);

        ActivityLog::record($request->user(), 'ad_created', $ad, "\"{$ad->title}\" বিজ্ঞাপন তৈরি করেছেন");

        return response()->json($ad, 201);
    }

    public function update(Request $request, Ad $ad)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'ad_type' => ['sometimes', 'required', 'in:image,video'],
            'image' => ['nullable', 'image', 'max:5120'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'target_url' => ['nullable', 'string', 'max:500'],
            'position' => ['sometimes', 'required', 'in:header,sidebar,in_article,homepage_top,footer'],
            'width' => ['nullable', 'integer', 'min:1'],
            'height' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'order' => ['nullable', 'integer'],
        ]);

        if ($request->hasFile('image')) {
            ImageUploadService::delete($ad->image);
            $data['image'] = ImageUploadService::processAndStore($request->file('image'), 'ads', 1000);
        }

        $ad->update($data);

        ActivityLog::record($request->user(), 'ad_updated', $ad, "\"{$ad->title}\" বিজ্ঞাপন আপডেট করেছেন");

        return response()->json($ad);
    }

    public function destroy(Request $request, Ad $ad)
    {
        ImageUploadService::delete($ad->image);

        $title = $ad->title;
        $ad->delete();

        ActivityLog::record($request->user(), 'ad_deleted', null, "\"{$title}\" বিজ্ঞাপন ডিলিট করেছেন");

        return response()->json(['message' => 'বিজ্ঞাপন ডিলিট করা হয়েছে']);
    }

    public function toggleActive(Request $request, Ad $ad)
    {
        $ad->update(['is_active' => !$ad->is_active]);

        ActivityLog::record(
            $request->user(),
            $ad->is_active ? 'ad_activated' : 'ad_deactivated',
            $ad,
            "\"{$ad->title}\" বিজ্ঞাপন " . ($ad->is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়') . ' করেছেন'
        );

        return response()->json($ad);
    }
}