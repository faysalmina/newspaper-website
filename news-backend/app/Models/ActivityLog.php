<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 'action', 'subject_type', 'subject_id', 'description', 'ip_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // সহজে লগ করার জন্য static helper — পরের ফেজগুলোতে এভাবে কল করব:
    // ActivityLog::record($request->user(), 'banned_admin', $targetUser, "Banned {$targetUser->name}");
    public static function record($user, string $action, $subject = null, ?string $description = null): void
    {
        static::create([
            'user_id' => $user->id,
            'action' => $action,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->id,
            'description' => $description,
            'ip_address' => request()->ip(),
        ]);
    }
}