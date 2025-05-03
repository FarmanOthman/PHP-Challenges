import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistance } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { router } from '@inertiajs/react';

export default function Index({ posts, auth }) {
  const [allPosts, setAllPosts] = useState(posts.data || []);
  const [nextPage, setNextPage] = useState(posts.current_page + 1);
  const [hasMorePosts, setHasMorePosts] = useState(posts.current_page < posts.last_page);
  const [isLoading, setIsLoading] = useState(false);
  
  // Setup the intersection observer for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Load more posts when the user scrolls to the bottom
  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && hasMorePosts && !isLoading) {
        setIsLoading(true);
        
        try {
          // Fetch the next page of posts
          const response = await fetch(`/blog?page=${nextPage}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
            },
          });
          
          const data = await response.json();
          
          setAllPosts(prev => [...prev, ...data.posts.data]);
          setNextPage(data.posts.current_page + 1);
          setHasMorePosts(data.posts.current_page < data.posts.last_page);
        } catch (error) {
          console.error("Error loading more posts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadMorePosts();
  }, [inView, hasMorePosts, nextPage]);

  return (
    <AppLayout
      auth={auth}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 leading-tight">Blog</h2>
          {auth.user && (
            <Link 
              href={route('posts.create')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              New Post
            </Link>
          )}
        </div>
      }
    >
      <Head title="Blog" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Loading indicator */}
          <div ref={ref} className="flex justify-center mt-8">
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-75"></div>
                <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-150"></div>
              </div>
            )}
          </div>
          
          {!hasMorePosts && allPosts.length > 0 && (
            <p className="text-center mt-8 text-gray-500">You've reached the end!</p>
          )}
          
          {allPosts.length === 0 && (
            <div className="text-center p-12 rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">No posts yet</h3>
              <p className="text-gray-500 mt-2">Be the first to create a post!</p>
              {auth.user && (
                <Link 
                  href={route('posts.create')}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Create Post
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Post card component
function PostCard({ post }) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform hover:scale-[1.02] duration-300">
      {post.featured_image && (
        <img 
          src={post.featured_image} 
          alt={post.title} 
          className="w-full h-48 object-cover object-center"
        />
      )}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
          </span>
          <span className="ml-auto text-gray-400 text-sm">
            {formatDistance(new Date(post.published_at), new Date(), { addSuffix: true })}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          <Link href={route('posts.show', post.slug)} className="hover:text-blue-600 transition duration-300">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-sm">{post.user.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="ml-2 text-sm text-gray-700">{post.user.name}</span>
          </div>
          <Link 
            href={route('posts.show', post.slug)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-300"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}