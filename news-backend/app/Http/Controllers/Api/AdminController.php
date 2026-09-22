<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        $admins = User::where('role', 'admin')
            ->withCount('news')
            ->latest()
            ->get();

        return response()->json($admins);
    }

    public function store(StoreAdminRequest $request)
    {
        $data = $request->validated();

        $admin = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'admin',
            'status' => 'active',
        ]);

        ActivityLog::record($request->user(), 'admin_created', $admin, "নতুন Admin তৈরি করেছেন: {$admin->name}");

        return response()->json($admin, 201);
    }

    public function update(UpdateAdminRequest $request, User $admin)
    {
        $this->ensureIsAdmin($admin);

        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $admin->update($data);

        ActivityLog::record($request->user(), 'admin_updated', $admin, "Admin তথ্য আপডেট করেছেন: {$admin->name}");

        return response()->json($admin);
    }

    // 🔑 এটাই Ban/Activate টগল — মূল রিকোয়ারমেন্ট
    public function toggleStatus(Request $request, User $admin)
    {
        $this->ensureIsAdmin($admin);

        $admin->status = $admin->status === 'active' ? 'banned' : 'active';
        $admin->save();

        if ($admin->status === 'banned') {
            $admin->tokens()->delete(); // ব্যান হলে সাথে সাথে সব ডিভাইস থেকে লগআউট হয়ে যাবে
        }

        $action = $admin->status === 'banned' ? 'admin_banned' : 'admin_activated';
        $desc = $admin->status === 'banned'
            ? "{$admin->name} কে ব্যান করেছেন"
            : "{$admin->name} কে সক্রিয় করেছেন";

        ActivityLog::record($request->user(), $action, $admin, $desc);

        return response()->json($admin);
    }

    public function destroy(Request $request, User $admin)
    {
        $this->ensureIsAdmin($admin);

        $name = $admin->name;
        $admin->delete();

        ActivityLog::record($request->user(), 'admin_deleted', null, "Admin ডিলিট করেছেন: {$name}");

        return response()->json(['message' => 'Admin ডিলিট করা হয়েছে']);
    }

    private function ensureIsAdmin(User $admin): void
    {
        if ($admin->role !== 'admin') {
            abort(403, 'শুধুমাত্র Admin ইউজার ম্যানেজ করা যাবে, Super Admin না।');
        }
    }
}