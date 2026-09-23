<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['news_id', 'name', 'email', 'comment', 'status', 'ip_address'];

    public function news()
    {
        return $this->belongsTo(News::class);
    }
}