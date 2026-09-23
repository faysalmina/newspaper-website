<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Epaper extends Model
{
    protected $fillable = ['publish_date', 'title', 'pdf_file', 'cover_image', 'uploaded_by', 'downloads_count'];

    protected function casts(): array
    {
        return ['publish_date' => 'date'];
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}