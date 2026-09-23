<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    // Admin শুধু নিজের নিউজের কমেন্ট moderate করতে পারবে, Super Admin সব
    public function moderate(User $user, Comment $comment): bool
    {
        return $user->isSuperAdmin() || $comment->news->author_id === $user->id;
    }
}