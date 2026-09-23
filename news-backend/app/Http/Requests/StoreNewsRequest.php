<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // controller-এ Policy দিয়ে আসল অনুমতি চেক হবে
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:10240'], // ১০MB পর্যন্ত, প্রসেসিং-এর পর অনেক ছোট হয়ে যাবে
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', 'in:draft,published,scheduled'],
            'published_at' => ['nullable', 'date'],
            'is_breaking' => ['boolean'],
            'is_featured' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}