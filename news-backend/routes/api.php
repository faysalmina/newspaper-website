<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

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
    });
});