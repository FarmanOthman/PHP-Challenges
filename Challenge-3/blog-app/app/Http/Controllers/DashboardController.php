<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all posts for the authenticated user
        $userPosts = $user->posts()
            ->withCount('comments')
            ->orderByDesc('created_at')
            ->get();
        
        return Inertia::render('Dashboard', [
            'userPosts' => $userPosts,
        ]);
    }
}