<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\MessageSent;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [\App\Http\Controllers\Auth\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login']);

// Test broadcasting route
Route::post('/broadcast', function (Request $request) {
    broadcast(new MessageSent([
        'user' => $request->input('user', 'Anonymous'),
        'message' => $request->input('message', 'Hello, world!'),
        'timestamp' => now()->toIso8601String()
    ]));
    
    return response()->json(['message' => 'Message broadcasted successfully']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);
});