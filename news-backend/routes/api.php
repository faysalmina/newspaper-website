<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EpaperController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PublicAdController;
use App\Http\Controllers\Api\PublicEpaperController;
use App\Http\Controllers\Api\PublicNewsController;
use App\Http\Controllers\Api\PublicVideoController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\VideoController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/public-settings', [SettingController::class, 'index']);

Route::prefix('public')->group(function () {
    Route::get('/news/featured', [PublicNewsController::class, 'featured']);
    Route::get('/news/home-sections', [PublicNewsController::class, 'homeSections']);
    Route::get('/news/feed', [PublicNewsController::class, 'feed']);
    Route::get('/news/sitemap-data', [PublicNewsController::class, 'sitemapData']);
    Route::get('/news/category/{slug}', [PublicNewsController::class, 'byCategory']);
    Route::get('/news/{slug}', [PublicNewsController::class, 'show']);
    Route::get('/news', [PublicNewsController::class, 'index']);
    Route::get('/categories', [PublicNewsController::class, 'categories']);

    Route::get('/videos/latest', [PublicVideoController::class, 'latest']);
    Route::get('/videos/{slug}', [PublicVideoController::class, 'show']);
    Route::get('/videos', [PublicVideoController::class, 'index']);

    Route::get('/ads/{position}', [PublicAdController::class, 'byPosition']);

    Route::get('/epapers/latest', [PublicEpaperController::class, 'latest']);
    Route::get('/epapers/{date}', [PublicEpaperController::class, 'show']);
    Route::get('/epapers', [PublicEpaperController::class, 'index']);
});

Route::get('/ads/{ad}/click', [PublicAdController::class, 'click'])->name('ads.click');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/tags', [TagController::class, 'index']);

    Route::apiResource('news', NewsController::class);
    Route::apiResource('videos', VideoController::class);

    Route::get('/epapers', [EpaperController::class, 'index']);
    Route::post('/epapers', [EpaperController::class, 'store']);
    Route::delete('/epapers/{epaper}', [EpaperController::class, 'destroy']);

    Route::middleware('role:super_admin')->prefix('super-admin')->group(function () {
        Route::get('/admins', [AdminController::class, 'index']);
        Route::post('/admins', [AdminController::class, 'store']);
        Route::put('/admins/{admin}', [AdminController::class, 'update']);
        Route::post('/admins/{admin}/toggle-status', [AdminController::class, 'toggleStatus']);
        Route::post('/admins/{admin}/reset-password', [AdminController::class, 'resetPassword']);
        Route::delete('/admins/{admin}', [AdminController::class, 'destroy']);

        Route::get('/activity-logs', [ActivityLogController::class, 'index']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);

        Route::get('/ads', [AdController::class, 'index']);
        Route::post('/ads', [AdController::class, 'store']);
        Route::put('/ads/{ad}', [AdController::class, 'update']);
        Route::post('/ads/{ad}/toggle-active', [AdController::class, 'toggleActive']);
        Route::delete('/ads/{ad}', [AdController::class, 'destroy']);
    });
});