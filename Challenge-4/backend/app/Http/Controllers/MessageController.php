<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Display a listing of the messages.
     */
    public function index(Request $request)
    {
        $query = Message::with('user');
        
        // Filter by recipient if specified
        if ($request->has('recipient_id') && $request->has('recipient_type')) {
            $query->where('recipient_id', $request->recipient_id)
                  ->where('recipient_type', $request->recipient_type);
        }
        
        // Filter by sender if specified
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Filter by current user's received messages
        if ($request->has('received') && $request->received) {
            $query->where('recipient_id', Auth::id())
                  ->where('recipient_type', 'user');
        }
        
        // Filter unread messages only
        if ($request->has('unread') && $request->unread) {
            $query->unread();
        }
        
        $messages = $query->latest()->paginate(20);
        
        return response()->json([
            'messages' => $messages
        ]);
    }

    /**
     * Store a newly created message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|string',
            'recipient_type' => 'required|string|in:user,channel,room',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        
        // Check if recipient exists if it's a user
        if ($request->recipient_type === 'user') {
            $recipient = User::find($request->recipient_id);
            if (!$recipient) {
                return response()->json([
                    'message' => 'Recipient user not found'
                ], Response::HTTP_NOT_FOUND);
            }
        }
        
        $message = Message::create([
            'user_id' => Auth::id(),
            'recipient_id' => $request->recipient_id,
            'recipient_type' => $request->recipient_type,
            'content' => $request->content,
        ]);
        
        // Load the user relationship for broadcasting
        $message->load('user');
        
        // Broadcast the message
        broadcast(new MessageSent($message))->toOthers();
        
        return response()->json([
            'message' => $message,
            'status' => 'Message sent successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified message.
     */
    public function show(string $id)
    {
        $message = Message::with('user')->findOrFail($id);
        
        // Check if user has permission to view this message
        $this->authorize('view', $message);
        
        return response()->json(['message' => $message]);
    }

    /**
     * Update the specified message.
     */
    public function update(Request $request, string $id)
    {
        $message = Message::findOrFail($id);
        
        // Check if user has permission to update this message
        $this->authorize('update', $message);
        
        $validated = $request->validate([
            'content' => 'required|string'
        ]);
        
        $message->update([
            'content' => $validated['content']
        ]);
        
        // Load the user relationship for complete message data
        $message->load('user');
        
        return response()->json([
            'message' => $message,
            'status' => 'Message updated successfully'
        ]);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(string $id)
    {
        $message = Message::findOrFail($id);
        
        // Check if user has permission to update this message
        $this->authorize('update', $message);
        
        $message->markAsRead();
        
        return response()->json([
            'message' => 'Message marked as read',
            'read_at' => $message->read_at
        ]);
    }

    /**
     * Remove the specified message.
     */
    public function destroy(string $id)
    {
        $message = Message::findOrFail($id);
        
        // Check if user has permission to delete this message
        $this->authorize('delete', $message);
        
        $message->delete();
        
        return response()->json([
            'message' => 'Message deleted successfully'
        ]);
    }

    /**
     * Get room invitations for the current user.
     */
    public function getInvitations(Request $request)
    {
        $user = Auth::user();
        
        // Get messages that are room invitations
        $invitations = Message::with('user')
            ->where('recipient_id', $user->id)
            ->where('recipient_type', 'user')
            ->where('content', 'like', '%You have been invited to join the room:%')
            ->latest()
            ->paginate($request->input('per_page', 15));
        
        return response()->json([
            'invitations' => $invitations,
            'total' => $invitations->total()
        ]);
    }
}
