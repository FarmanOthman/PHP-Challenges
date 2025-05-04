<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Public chat channel - no authorization needed
Broadcast::channel('chat', function () {
    return true;
});

// Private user-specific channel example
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channel messages
Broadcast::channel('channel.{channelId}', function () {
    // All authenticated users can listen to public channels
    return true;
});

// Presence channel for rooms (shows who's online)
Broadcast::channel('room.{roomId}', function ($user) {
    // Return user information that will be visible to others in the room
    if ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name
        ];
    }
    return false;
});