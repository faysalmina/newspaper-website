<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Comment::with('news:id,title,slug,author_id')->latest();

        // Admin শুধু নিজের নিউজের কমেন্ট দেখবে, Super Admin সব
        if (!$user->isSuperAdmin()) {
            $query->whereHas('news', fn($q) => $q->where('author_id', $user->id));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    public function approve(Request $request, Comment $comment)
    {
        $this->authorize('moderate', $comment);

        $comment->update(['status' => 'approved']);

        ActivityLog::record($request->user(), 'comment_approved', $comment, "একটি কমেন্ট অনুমোদন করেছেন");

        return response()->json($comment);
    }

    public function destroy(Request $request, Comment $comment)
    {
        $this->authorize('moderate', $comment);

        $comment->delete();

        ActivityLog::record($request->user(), 'comment_deleted', null, "একটি কমেন্ট ডিলিট করেছেন");

        return response()->json(['message' => 'কমেন্ট ডিলিট করা হয়েছে']);
    }
}