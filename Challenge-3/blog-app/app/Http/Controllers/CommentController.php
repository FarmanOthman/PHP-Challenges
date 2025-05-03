<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request, Post $post)
    {
        // Ensure user is authenticated to comment
        $this->middleware('auth');
        
        $validated = $request->validate([
            'content' => 'required|string|min:2',
        ]);
        
        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'is_approved' => true, // Auto-approve comments by default
        ]);
        
        // Clear post cache when a new comment is added
        Cache::forget('post_' . $post->slug);
        
        return back()->with('success', 'Comment added successfully!');
    }
    
    /**
     * Update the specified comment in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        // Ensure only the comment author can edit
        $this->authorize('update', $comment);
        
        $validated = $request->validate([
            'content' => 'required|string|min:2',
        ]);
        
        $comment->update([
            'content' => $validated['content'],
        ]);
        
        // Clear post cache when a comment is updated
        Cache::forget('post_' . $comment->post->slug);
        
        return back()->with('success', 'Comment updated successfully!');
    }
    
    /**
     * Remove the specified comment from storage.
     */
    public function destroy(Comment $comment)
    {
        // Ensure only the comment author or post author can delete
        $this->authorize('delete', $comment);
        
        $post = $comment->post;
        
        $comment->delete();
        
        // Clear post cache when a comment is deleted
        Cache::forget('post_' . $post->slug);
        
        return back()->with('success', 'Comment deleted successfully!');
    }
    
    /**
     * Toggle the approval status of a comment (Admin only).
     */
    public function toggleApproval(Comment $comment)
    {
        // Only admins can approve/disapprove comments
        $this->authorize('moderate', $comment);
        
        $comment->is_approved = !$comment->is_approved;
        $comment->save();
        
        // Clear post cache when a comment approval status changes
        Cache::forget('post_' . $comment->post->slug);
        
        $status = $comment->is_approved ? 'approved' : 'unapproved';
        return back()->with('success', "Comment {$status} successfully!");
    }
}
