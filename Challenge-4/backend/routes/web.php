<?php

use Illuminate\Support\Facades\Route;
use App\Events\MessageSent;
use App\Models\Message;

Route::get('/', function () {
    return view('welcome');
});

// Test route for WebSocket broadcasting
Route::get('/test-websocket', function () {
    // Create and SAVE the message to the database to get a valid ID
    $message = Message::create([
        'user_id' => 1, // Sample user ID
        'recipient_id' => 'general',
        'recipient_type' => 'channel',
        'content' => 'Test message from WebSocket at ' . now()->toDateTimeString(),
    ]);

    // Fire the event with the saved message
    event(new MessageSent($message));

    return response()->json([
        'status' => 'success',
        'message' => 'WebSocket test message has been broadcasted',
        'data' => $message
    ]);
});
