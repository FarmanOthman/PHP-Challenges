<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
    /**
     * Determine whether the user can view any comments.
     */
    public function viewAny(?User $user): bool
    {
        // Anyone can view comments
        return true;
    }

    /**
     * Determine whether the user can view the comment.
     */
    public function view(?User $user, Comment $comment): bool
    {
        // Anyone can view approved comments
        if ($comment->is_approved) {
            return true;
        }
        
        // If unapproved, only the comment author, post author, or admin can view
        if (!$user) {
            return false;
        }
        
        return $user->id === $comment->user_id || 
               $user->id === $comment->post->user_id;
    }

    /**
     * Determine whether the user can create comments.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create comments
        return true;
    }

    /**
     * Determine whether the user can update the comment.
     */
    public function update(User $user, Comment $comment): bool
    {
        // Only the comment author can update it
        return $user->id === $comment->user_id;
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, Comment $comment): bool
    {
        // Both the comment author and post author can delete comments
        return $user->id === $comment->user_id || 
               $user->id === $comment->post->user_id;
    }

    /**
     * Determine whether the user can moderate (approve/disapprove) comments.
     */
    public function moderate(User $user, Comment $comment): bool
    {
        // Only the post owner can moderate comments
        return $user->id === $comment->post->user_id;
    }
}