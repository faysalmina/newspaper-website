<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Daily News BD — API Backend',
        'status' => 'running',
        'message' => 'This is the API server. Use /api/* routes.',
    ]);
});