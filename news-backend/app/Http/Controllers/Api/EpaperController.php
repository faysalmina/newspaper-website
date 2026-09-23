<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Epaper;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EpaperController extends Controller
{
    public function index()
    {
        return response()->json(
            Epaper::with('uploader')->orderByDesc('publish_date')->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'publish_date' => ['required', 'date', 'unique:epapers,publish_date'],
            'title' => ['nullable', 'string', 'max:255'],
            'pdf_file' => ['required', 'file', 'mimes:pdf', 'max:20480'], // ২০MB পর্যন্ত
            'cover_image' => ['nullable', 'image', 'max:5120'],
        ]);

        $data['pdf_file'] = $request->file('pdf_file')->store('epapers', 'public');
        $data['uploaded_by'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = ImageUploadService::processAndStore($request->file('cover_image'), 'epapers/covers', 600);
        }

        $epaper = Epaper::create($data);

        ActivityLog::record($request->user(), 'epaper_uploaded', $epaper, "{$data['publish_date']} তারিখের ই-পেপার আপলোড করেছেন");

        return response()->json($epaper->load('uploader'), 201);
    }

    public function destroy(Request $request, Epaper $epaper)
    {
        if (!$request->user()->isSuperAdmin() && $epaper->uploaded_by !== $request->user()->id) {
            abort(403, 'শুধু আপনার নিজের আপলোড করা ই-পেপার অথবা Super Admin ডিলিট করতে পারবেন।');
        }

        Storage::disk('public')->delete($epaper->pdf_file);
        ImageUploadService::delete($epaper->cover_image);

        $date = $epaper->publish_date->format('Y-m-d');
        $epaper->delete();

        ActivityLog::record($request->user(), 'epaper_deleted', null, "{$date} তারিখের ই-পেপার ডিলিট করেছেন");

        return response()->json(['message' => 'ই-পেপার ডিলিট করা হয়েছে']);
    }
}