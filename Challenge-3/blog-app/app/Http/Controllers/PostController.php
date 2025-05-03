<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the posts with pagination.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 10;
        
        // Cache posts by page for efficient data loading
        $posts = Cache::remember('posts_page_' . $page, 600, function () use ($perPage) {
            return Post::where('is_published', true)
                ->with('user:id,name')
                ->withCount('comments')
                ->orderByDesc('published_at')
                ->paginate($perPage);
        });
        
        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        // Ensure only authenticated users can create posts
        $this->authorize('create', Post::class);
        
        return Inertia::render('Posts/Create');
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        // Ensure only authenticated users can store posts
        $this->authorize('create', Post::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'is_published' => 'boolean',
        ]);
        
        // Generate slug from title
        $slug = Str::slug($validated['title']);
        $baseSlug = $slug;
        $count = 1;
        
        // Ensure the slug is unique
        while (Post::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $count++;
        }
        
        $post = Auth::user()->posts()->create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $validated['content'],
            'excerpt' => $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150),
            'featured_image' => $validated['featured_image'] ?? null,
            'is_published' => $validated['is_published'] ?? true,
            'published_at' => $validated['is_published'] ?? true ? now() : null,
        ]);
        
        // Clear the posts cache
        Cache::forget('posts_page_1');
        
        return redirect()->route('posts.show', $post->slug)
            ->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post.
     */
    public function show(string $slug)
    {
        // Cache individual post data with comments
        $post = Cache::remember('post_' . $slug, 600, function () use ($slug) {
            return Post::where('slug', $slug)
                ->with(['user:id,name', 'comments' => function ($query) {
                    $query->where('is_approved', true)
                        ->with('user:id,name')
                        ->orderByDesc('created_at');
                }])
                ->firstOrFail();
        });
        
        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        // Ensure only the post author or admin can edit
        $this->authorize('update', $post);
        
        return Inertia::render('Posts/Edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, Post $post)
    {
        // Ensure only the post author or admin can update
        $this->authorize('update', $post);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'is_published' => 'boolean',
        ]);
        
        // Update slug if title changed
        if ($post->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $baseSlug = $slug;
            $count = 1;
            
            while (Post::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }
            
            $post->slug = $slug;
        }
        
        $post->title = $validated['title'];
        $post->content = $validated['content'];
        $post->excerpt = $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150);
        $post->featured_image = $validated['featured_image'] ?? $post->featured_image;
        
        // Handle publishing status changes
        $wasPublished = $post->is_published;
        $post->is_published = $validated['is_published'] ?? $post->is_published;
        
        // Set published_at timestamp if post is being published for the first time
        if (!$wasPublished && $post->is_published) {
            $post->published_at = now();
        }
        
        $post->save();
        
        // Clear post caches
        Cache::forget('posts_page_1');
        Cache::forget('post_' . $post->slug);
        
        return redirect()->route('posts.show', $post->slug)
            ->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        // Ensure only the post author or admin can delete
        $this->authorize('delete', $post);
        
        $post->delete();
        
        // Clear post caches
        Cache::forget('posts_page_1');
        Cache::forget('post_' . $post->slug);
        
        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully!');
    }
}
