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
        try {
            // Log the message
            Log::info('New message received for processing', [
                'message_id' => $event->message->id ?? 'unknown',
                'from' => $event->message->user_id ?? 'unknown',
                'to' => $event->message->recipient_id ?? 'unknown',
                'type' => $event->message->recipient_type ?? 'unknown',
                'content' => substr($event->message->content ?? '', 0, 30) . '...'
            ]);

            // Send notifications only for user-to-user messages
            if ($event->message->recipient_type === 'user') {
                // Make sure recipient_id is numeric for user lookups
                if (!is_numeric($event->message->recipient_id)) {
                    Log::warning('Invalid recipient ID for user notification', [
                        'recipient_id' => $event->message->recipient_id
                    ]);
                    return;
                }
                
                $recipient = User::find($event->message->recipient_id);
                
                if ($recipient) {
                    // Here you could send email notifications, push notifications, etc.
                    // $recipient->notify(new NewMessageNotification($event->message));
                    
                    // For now, just log that we would send a notification
                    Log::info('Would send notification to user', [
                        'user_id' => $recipient->id,
                        'user_email' => $recipient->email
                    ]);
                } else {
                    Log::warning('Recipient user not found', [
                        'recipient_id' => $event->message->recipient_id
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error processing message notification: ' . $e->getMessage(), [
                'exception' => $e,
                'message' => $event->message ?? 'No message data'
            ]);
            
            // Optionally retry the job
            if ($this->attempts() < 3) {
                $this->release(30); // retry after 30 seconds
            } else {
                $this->fail($e);
            }
        }
    }
}
