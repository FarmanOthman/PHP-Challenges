<?php

namespace App\Listeners;

use App\Events\MessageSent;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessMessageNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        // Log the message
        Log::info('New message sent', [
            'message_id' => $event->message->id,
            'from' => $event->message->user_id,
            'to' => $event->message->recipient_id,
            'type' => $event->message->recipient_type,
        ]);

        // Send notifications only for user-to-user messages
        if ($event->message->recipient_type === 'user') {
            $recipient = User::find($event->message->recipient_id);
            
            if ($recipient) {
                // Here you could send email notifications, push notifications, etc.
                // $recipient->notify(new NewMessageNotification($event->message));
                
                // For now, just log that we would send a notification
                Log::info('Would send notification to user', [
                    'user_id' => $recipient->id,
                    'user_email' => $recipient->email
                ]);
            }
        }
    }
}
