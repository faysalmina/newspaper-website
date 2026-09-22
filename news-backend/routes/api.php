<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PublicNewsController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/public-settings', [SettingController::class, 'index']);

// 🌐 পাবলিক নিউজ API — কোনো লগইন লাগবে না, Next.js এখান থেকে ডেটা নেবে
Route::prefix('public')->group(function () {
    Route::get('/news/featured', [PublicNewsController::class, 'featured']);
    Route::get('/news/feed', [PublicNewsController::class, 'feed']);
    Route::get('/news/sitemap-data', [PublicNewsController::class, 'sitemapData']);
    Route::get('/news/category/{slug}', [PublicNewsController::class, 'byCategory']);
    Route::get('/news/{slug}', [PublicNewsController::class, 'show']);
    Route::get('/news', [PublicNewsController::class, 'index']);
    Route::get('/categories', [PublicNewsController::class, 'categories']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/tags', [TagController::class, 'index']);

    Route::apiResource('news', NewsController::class);

    Route::middleware('role:super_admin')->prefix('super-admin')->group(function () {
        Route::get('/admins', [AdminController::class, 'index']);
        Route::post('/admins', [AdminController::class, 'store']);
        Route::put('/admins/{admin}', [AdminController::class, 'update']);
        Route::post('/admins/{admin}/toggle-status', [AdminController::class, 'toggleStatus']);
        Route::delete('/admins/{admin}', [AdminController::class, 'destroy']);

        Route::get('/activity-logs', [ActivityLogController::class, 'index']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
    });
});