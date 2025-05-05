<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return User::where('id', '!=', $request->user()->id)
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Get list of online users
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function online(Request $request)
    {
        $rooms = app('pusher')->presence_channels();
        $online_users = [];
        
        foreach ($rooms as $room => $presence) {
            if (strpos($room, 'presence-room.') === 0) {
                foreach ($presence->users as $user) {
                    $online_users[$user->id] = $user;
                }
            }
        }
        
        return response()->json(array_values($online_users));
    }

    /**
     * Update user's status
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $user->status = $validated['status'];
        $user->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'status' => $user->status
        ]);
    }

    /**
     * Search for users
     */
    public function search(Request $request)
    {
        $query = $request->get('query');
        
        if (!$query) {
            return response()->json([
                'users' => []
            ]);
        }
        
        $users = User::where('id', '!=', $request->user()->id)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%")
                  ->orWhere('status', 'like', "%{$query}%");
            })
            ->get(['id', 'name', 'email', 'status']);
            
        return response()->json([
            'users' => $users
        ]);
    }
}
