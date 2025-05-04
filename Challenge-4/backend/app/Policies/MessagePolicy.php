<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MessagePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Everyone can view messages
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Message $message): bool
    {
        // Users can view messages they sent or received
        return $user->id === $message->user_id || 
               ($message->recipient_type === 'user' && $message->recipient_id == $user->id) ||
               $message->recipient_type !== 'user'; // Public messages in channels/rooms
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create messages
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Message $message): bool
    {
        // Only the recipient can mark a message as read
        if ($message->recipient_type === 'user' && $message->recipient_id == $user->id) {
            return true;
        }

        // Message owners can edit their messages
        return $user->id === $message->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Message $message): bool
    {
        // Only the sender can delete their own message
        return $user->id === $message->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Message $message): bool
    {
        // Only the sender can restore deleted messages
        return $user->id === $message->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Message $message): bool
    {
        // Only admins or the sender can permanently delete messages
        return $user->id === $message->user_id || $user->isAdmin();
    }
}
