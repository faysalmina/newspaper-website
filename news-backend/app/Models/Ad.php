<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $fillable = [
        'title', 'ad_type', 'image', 'video_url', 'target_url', 'position',
        'width', 'height', 'is_active', 'start_date', 'end_date', 'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    // এই মুহূর্তে অ্যাডটা দেখানোর উপযুক্ত কিনা (active + তারিখ রেঞ্জের মধ্যে)
    public function scopeCurrentlyActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')->orWhereDate('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhereDate('end_date', '>=', now());
            });
    }
}