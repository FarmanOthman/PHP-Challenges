<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     */
    public function index(Request $request)
    {
        // Get user for member filtering
        $user = Auth::user();
        
        // Start query
        $query = Room::query();
        
        // Filter by membership if requested
        if ($request->has('member') && $request->boolean('member')) {
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        
        // Filter by room type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        // Handle private rooms - only show if user is a member
        $query->where(function ($q) use ($user) {
            $q->where('is_private', false)
              ->orWhereHas('members', function ($q) use ($user) {
                  $q->where('users.id', $user->id);
              });
        });
        
        // Get paginated results with relationships
        $rooms = $query->with(['creator:id,name,email', 'members:id,name,email'])
                       ->paginate($request->input('per_page', 15));
        
        return response()->json(['rooms' => $rooms]);
    }

    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', 'string', Rule::in(['public', 'private', 'direct'])],
            'is_private' => 'boolean',
            'members' => 'nullable|array',
            'members.*' => 'exists:users,id',
        ]);
        
        // Get current user
        $user = Auth::user();
        
        // Create the room
        $room = Room::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'created_by' => $user->id,
            'is_private' => $validated['is_private'] ?? false,
        ]);
        
        // Add the creator as a member and admin
        $room->members()->attach($user->id, ['is_admin' => true]);
        
        // Add members if provided
        if (!empty($validated['members'])) {
            $memberIds = array_diff($validated['members'], [$user->id]);
            if (!empty($memberIds)) {
                $room->members()->attach($memberIds, ['is_admin' => false]);
            }
        }
        
        // Load relationships
        $room->load(['creator:id,name,email', 'members:id,name,email']);
        
        return response()->json([
            'room' => $room,
            'message' => 'Room created successfully'
        ], 201);
    }

    /**
     * Display the specified room.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        
        // Find the room with relationships
        $room = Room::with(['creator:id,name,email', 'members:id,name,email'])
                    ->findOrFail($id);
        
        // Check if room is private and user is not a member
        if ($room->is_private && !$room->members()->where('users.id', $user->id)->exists()) {
            return response()->json(['message' => 'You do not have access to this room'], 403);
        }
        
        return response()->json(['room' => $room]);
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if user is authorized to update (admin or creator)
        $isAdmin = $room->members()->where('users.id', $user->id)
                        ->wherePivot('is_admin', true)
                        ->exists();
        
        if (!$isAdmin && $room->created_by !== $user->id) {
            return response()->json(['message' => 'You are not authorized to update this room'], 403);
        }
        
        // Validate request data
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['sometimes', 'required', 'string', Rule::in(['public', 'private', 'direct'])],
            'is_private' => 'sometimes|boolean',
        ]);
        
        // Update the room
        $room->update($validated);
        
        // Reload relationships
        $room->load(['creator:id,name,email', 'members:id,name,email']);
        
        return response()->json([
            'room' => $room,
            'message' => 'Room updated successfully'
        ]);
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if user is authorized to delete (creator or admin)
        if ($room->created_by !== $user->id && !$user->is_admin) {
            return response()->json(['message' => 'You are not authorized to delete this room'], 403);
        }
        
        // Delete the room (soft delete)
        $room->delete();
        
        return response()->json(['message' => 'Room deleted successfully']);
    }
    
    /**
     * Add members to a room.
     */
    public function addMembers(Request $request, string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if user is authorized (admin or creator)
        $isAdmin = $room->members()->where('users.id', $user->id)
                        ->wherePivot('is_admin', true)
                        ->exists();
        
        if (!$isAdmin && $room->created_by !== $user->id) {
            return response()->json(['message' => 'You are not authorized to add members to this room'], 403);
        }
        
        // Validate request data
        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:users,id',
            'is_admin' => 'boolean',
        ]);
        
        // Add members
        $memberData = array_fill_keys($validated['member_ids'], [
            'is_admin' => $validated['is_admin'] ?? false,
        ]);
        $room->members()->attach($memberData);
        
        // Reload members
        $room->load('members:id,name,email');
        
        return response()->json([
            'room' => $room,
            'message' => 'Members added successfully'
        ]);
    }
    
    /**
     * Remove members from a room.
     */
    public function removeMembers(Request $request, string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if user is authorized (admin or creator)
        $isAdmin = $room->members()->where('users.id', $user->id)
                        ->wherePivot('is_admin', true)
                        ->exists();
        
        if (!$isAdmin && $room->created_by !== $user->id) {
            return response()->json(['message' => 'You are not authorized to remove members from this room'], 403);
        }
        
        // Validate request data
        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:users,id',
        ]);
        
        // Cannot remove creator
        if (in_array($room->created_by, $validated['member_ids'])) {
            return response()->json(['message' => 'Cannot remove the room creator'], 400);
        }
        
        // Remove members
        $room->members()->detach($validated['member_ids']);
        
        // Reload members
        $room->load('members:id,name,email');
        
        return response()->json([
            'room' => $room,
            'message' => 'Members removed successfully'
        ]);
    }

    /**
     * Update typing status for a room
     */
    public function updateTypingStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'is_typing' => 'required|boolean'
        ]);

        $user = $request->user();
        $room = Room::findOrFail($id);

        if (!$user->isMemberOfRoom($room->id)) {
            return response()->json(['message' => 'You are not a member of this room'], 403);
        }

        broadcast(new UserTyping(
            $room->id,
            ['id' => $user->id, 'name' => $user->name],
            $validated['is_typing']
        ))->toOthers();

        return response()->json(['message' => 'Typing status updated']);
    }

    /**
     * Get messages for a specific room.
     */
    public function messages(Request $request, string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if room is private and user is not a member
        if ($room->is_private && !$room->members()->where('users.id', $user->id)->exists()) {
            return response()->json(['message' => 'You do not have access to this room'], 403);
        }
        
        // Get paginated messages
        $messages = Message::with('user')
            ->where('recipient_id', $id)
            ->where('recipient_type', 'room')
            ->latest()
            ->paginate($request->input('limit', 20));
        
        return response()->json(['messages' => $messages]);
    }

    /**
     * Leave the specified room.
     */
    public function leave(string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Cannot leave if you're the creator
        if ($room->created_by === $user->id) {
            return response()->json(['message' => 'Room creator cannot leave the room'], 400);
        }
        
        // Check if user is actually a member
        if (!$user->isMemberOfRoom($room->id)) {
            return response()->json(['message' => 'You are not a member of this room'], 404);
        }
        
        // Remove the user from the room
        $room->members()->detach($user->id);
        
        // Reload members
        $room->load('members:id,name,email');
        
        return response()->json([
            'room' => $room,
            'message' => 'Successfully left the room'
        ]);
    }

    /**
     * Get the members of a room.
     */
    public function getMembers(string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if room is private and user is not a member
        if ($room->is_private && !$room->members()->where('users.id', $user->id)->exists()) {
            return response()->json(['message' => 'You do not have access to this room'], 403);
        }
        
        // Get members with their roles
        $members = $room->members()
            ->select('users.id', 'users.name', 'users.email', 'users.status', 'room_user.is_admin')
            ->with(['unreadMessages' => function($query) use ($room) {
                $query->where('recipient_type', 'room')
                      ->where('recipient_id', $room->id);
            }])
            ->get();
        
        return response()->json([
            'members' => $members,
            'total' => $members->count()
        ]);
    }

    /**
     * Update member permissions in a room.
     */
    public function updateMemberPermissions(Request $request, string $id, string $userId)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if user is authorized (admin or creator)
        $isAdmin = $room->members()->where('users.id', $user->id)
                       ->wherePivot('is_admin', true)
                       ->exists();
        
        if (!$isAdmin && $room->created_by !== $user->id) {
            return response()->json(['message' => 'You are not authorized to update member permissions'], 403);
        }
        
        // Validate request data
        $validated = $request->validate([
            'is_admin' => 'required|boolean'
        ]);
        
        // Cannot modify creator's permissions
        if ((int)$userId === $room->created_by) {
            return response()->json(['message' => 'Cannot modify room creator\'s permissions'], 400);
        }
        
        // Check if target user is a member
        if (!$room->members()->where('users.id', $userId)->exists()) {
            return response()->json(['message' => 'User is not a member of this room'], 404);
        }
        
        // Update member's admin status
        $room->members()->updateExistingPivot($userId, [
            'is_admin' => $validated['is_admin']
        ]);
        
        // Reload members for response
        $room->load('members:id,name,email');
        
        return response()->json([
            'room' => $room,
            'message' => 'Member permissions updated successfully'
        ]);
    }

    /**
     * Invite users to a room.
     */
    public function invite(Request $request, string $id)
    {
        $user = Auth::user();
        
        // Find the room
        $room = Room::findOrFail($id);
        
        // Check if user is authorized (admin or creator)
        $isAdmin = $room->members()->where('users.id', $user->id)
                       ->wherePivot('is_admin', true)
                       ->exists();
        
        if (!$isAdmin && $room->created_by !== $user->id) {
            return response()->json(['message' => 'You are not authorized to invite users to this room'], 403);
        }
        
        // Validate request data
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);
        
        // Filter out users who are already members
        $existingMembers = $room->members()->whereIn('users.id', $validated['user_ids'])->pluck('users.id')->toArray();
        $newUserIds = array_diff($validated['user_ids'], $existingMembers);
        
        if (empty($newUserIds)) {
            return response()->json(['message' => 'All users are already members of this room'], 400);
        }
        
        // Add the new members (non-admin by default)
        $memberData = array_fill_keys($newUserIds, ['is_admin' => false]);
        $room->members()->attach($memberData);
        
        // Send invitation notifications
        $invitedUsers = User::whereIn('id', $newUserIds)->get();
        foreach ($invitedUsers as $invitedUser) {
            // Create a system message for the invitation
            Message::create([
                'user_id' => $user->id,
                'recipient_id' => $invitedUser->id,
                'recipient_type' => 'user',
                'content' => "You have been invited to join the room: {$room->name}"
            ]);
        }
        
        // Reload members for response
        $room->load('members:id,name,email');
        
        return response()->json([
            'room' => $room,
            'invited_users' => $invitedUsers,
            'message' => 'Users invited successfully'
        ]);
    }
}
