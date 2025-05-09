<?php

use App\Events\MessageSent;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    // Create a temporary message for broadcasting test
    $message = new Message([
        'user_id' => $request->input('user_id', 1),
        'recipient_id' => $request->input('recipient_id', 'general'),
        'recipient_type' => $request->input('recipient_type', 'channel'),
        'content' => $request->input('message', 'Hello, world!'),
    ]);
    
    // Set ID for non-persisted message
    $message->id = 0;
    
    broadcast(new MessageSent($message));
    
    return response()->json(['message' => 'Message broadcasted successfully']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/search', [UserController::class, 'search']);
    Route::get('/users/online', [UserController::class, 'online']);
    Route::post('/users/status', [UserController::class, 'updateStatus']);
    
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);
    
    // Message routes
    Route::apiResource('messages', MessageController::class);
    Route::get('/invitations', [MessageController::class, 'getInvitations']);
    Route::post('/invitations/{id}/respond', [MessageController::class, 'respondToInvitation']);
    
    // Additional message routes
    Route::post('/messages/{id}/read', [MessageController::class, 'markAsRead']);
    Route::get('/messages/unread', [MessageController::class, 'index'])->defaults('unread', true);

    // Room routes
    Route::apiResource('rooms', RoomController::class);
    Route::get('/rooms/{id}/members', [RoomController::class, 'getMembers']);
    Route::put('/rooms/{id}/members/{userId}', [RoomController::class, 'updateMemberPermissions']);
    Route::post('/rooms/{id}/invite', [RoomController::class, 'invite']);
    Route::post('/rooms/{id}/leave', [RoomController::class, 'leave']);
    Route::post('/rooms/{id}/read', [RoomController::class, 'markAsRead']);
    Route::get('/rooms/{id}/messages', [RoomController::class, 'messages']);
    Route::post('/rooms/{id}/typing', [RoomController::class, 'updateTypingStatus']);
    Route::post('/direct-messages', [RoomController::class, 'createDirectMessage']);
    
    // Additional room management routes
    Route::post('/rooms/{id}/members', [RoomController::class, 'addMembers']);
    Route::delete('/rooms/{id}/members', [RoomController::class, 'removeMembers']);
});