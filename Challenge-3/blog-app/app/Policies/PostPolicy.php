<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any posts.
     */
    public function viewAny(?User $user): bool
    {
        // Anyone can view posts
        return true;
    }

    /**
     * Determine whether the user can view the post.
     */
    public function view(?User $user, Post $post): bool
    {
        // Anyone can view published posts
        if ($post->is_published) {
            return true;
        }
        
        // Only the author can view unpublished posts
        return $user && $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can create posts.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create posts
        return true;
    }

    /**
     * Determine whether the user can update the post.
     */
    public function update(User $user, Post $post): bool
    {
        // Only the post author can update it
        return $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        // Only the post author can delete it
        return $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can restore the post.
     */
    public function restore(User $user, Post $post): bool
    {
        // Only the post author can restore it
        return $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can permanently delete the post.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        // Only the post author can force delete it
        return $user->id === $post->user_id;
    }
}