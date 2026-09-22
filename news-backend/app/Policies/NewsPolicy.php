<?php

namespace App\Policies;

use App\Models\News;
use App\Models\User;

class NewsPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // যেকোনো লগইন করা admin/super_admin লিস্ট দেখতে পারবে
    }

    public function view(User $user, News $news): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true; // admin এবং super_admin দুজনেই নিউজ পোস্ট করতে পারবে
    }

    // 🔑 মূল রুল: নিজের পোস্ট অথবা super_admin হলেই এডিট করা যাবে
    public function update(User $user, News $news): bool
    {
        return $user->isSuperAdmin() || $news->author_id === $user->id;
    }

    public function delete(User $user, News $news): bool
    {
        return $user->isSuperAdmin() || $news->author_id === $user->id;
    }
}