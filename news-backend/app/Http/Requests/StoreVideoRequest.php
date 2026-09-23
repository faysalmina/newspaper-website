<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_type' => ['required', 'in:youtube,upload'],
            'video_url' => ['required_if:video_type,youtube', 'nullable', 'string', 'max:500'],
            'video_file' => ['required_if:video_type,upload', 'nullable', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            'thumbnail' => ['nullable', 'image', 'max:10240'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}