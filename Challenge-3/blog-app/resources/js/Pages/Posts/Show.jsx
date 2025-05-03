import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistance } from 'date-fns';
import parse from 'html-react-parser';

export default function Show({ post, auth }) {
  const [isReplying, setIsReplying] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  return (
    <AppLayout
      auth={auth}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 leading-tight">{post.title}</h2>
          <div className="flex items-center space-x-2">
            <Link
              href={route('posts.index')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Back to Blog
            </Link>
            {auth.user && auth.user.id === post.user_id && (
              <>
                <Link
                  href={route('posts.edit', post.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this post?')) {
                      router.delete(route('posts.destroy', post.id));
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      <Head title={post.title} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Post content */}
          <article className="bg-white overflow-hidden shadow-md rounded-lg">
            {post.featured_image && (
              <div className="relative">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-64 sm:h-80 object-cover object-center"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-700">
                      {post.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{post.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistance(new Date(post.published_at), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="ml-auto flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {post.comments.length} comments
                </div>
              </div>
              
              <div className="prose max-w-none">
                {parse(post.content)}
              </div>
            </div>
          </article>

          {/* Comments section */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
            
            {/* New comment form */}
            {auth.user && !isReplying && (
              <button
                onClick={() => setIsReplying(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Comment
              </button>
            )}
            
            {auth.user && isReplying && (
              <CommentForm
                postId={post.id}
                onCancel={() => setIsReplying(false)}
                buttonText="Post Comment"
              />
            )}
            
            {!auth.user && (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="text-blue-700">
                  <Link href={route('login')} className="font-medium underline">Sign in</Link> to leave a comment
                </p>
              </div>
            )}
            
            {/* Comments list */}
            {post.comments.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map(comment => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    currentUser={auth.user}
                    postAuthorId={post.user_id}
                    onEditStart={() => setEditingComment(comment.id)}
                    onEditEnd={() => setEditingComment(null)}
                    isEditing={editingComment === comment.id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

// Comment component
function Comment({ comment, currentUser, postAuthorId, onEditStart, onEditEnd, isEditing }) {
  const canEdit = currentUser && currentUser.id === comment.user_id;
  const canDelete = currentUser && (currentUser.id === comment.user_id || currentUser.id === postAuthorId);
  
  const { delete: destroyComment } = useForm();
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      destroyComment(route('comments.destroy', comment.id));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {!isEditing ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-sm">{comment.user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {(canEdit || canDelete) && (
              <div className="flex space-x-2">
                {canEdit && (
                  <button
                    onClick={onEditStart}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="prose prose-sm max-w-none">
            {parse(comment.content)}
          </div>
        </>
      ) : (
        <CommentForm
          commentId={comment.id}
          initialContent={comment.content}
          onCancel={onEditEnd}
          buttonText="Update"
          isEditing={true}
        />
      )}
    </div>
  );
}

// Comment form component for creating/editing comments
function CommentForm({ postId = null, commentId = null, initialContent = '', onCancel, buttonText, isEditing = false }) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    content: initialContent,
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      put(route('comments.update', commentId), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          onCancel();
        },
      });
    } else {
      post(route('comments.store', postId), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          onCancel();
        },
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <textarea
          value={data.content}
          onChange={e => setData('content', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          rows={4}
          placeholder="Write your comment..."
          disabled={processing}
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
          disabled={processing}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          disabled={processing}
        >
          {processing ? 'Processing...' : buttonText}
        </button>
      </div>
    </form>
  );
}