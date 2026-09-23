<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVideoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_type' => ['sometimes', 'required', 'in:youtube,upload'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            'thumbnail' => ['nullable', 'image', 'max:10240'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'status' => ['sometimes', 'required', 'in:draft,published'],
        ];
    }
}