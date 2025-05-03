import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import RichTextEditor from '@/Components/RichTextEditor';

export default function Edit({ auth, post }) {
  const { data, setData, put, processing, errors } = useForm({
    title: post.title || '',
    content: post.content || '',
    excerpt: post.excerpt || '',
    featured_image: post.featured_image || '',
    is_published: post.is_published,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('posts.update', post.id));
  };

  return (
    <AppLayout
      auth={auth}
      header={<h2 className="text-2xl font-semibold text-gray-800 leading-tight">Edit Post</h2>}
    >
      <Head title={`Edit Post: ${post.title}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <InputLabel htmlFor="title" value="Post Title" />
                <TextInput
                  id="title"
                  type="text"
                  name="title"
                  value={data.title}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('title', e.target.value)}
                  required
                />
                <InputError message={errors.title} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="featured_image" value="Featured Image URL (optional)" />
                <TextInput
                  id="featured_image"
                  type="text"
                  name="featured_image"
                  value={data.featured_image}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('featured_image', e.target.value)}
                />
                <InputError message={errors.featured_image} className="mt-2" />
                {data.featured_image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img 
                      src={data.featured_image} 
                      alt="Preview" 
                      className="w-full max-w-md h-40 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <InputLabel htmlFor="excerpt" value="Excerpt (optional)" />
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={data.excerpt}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  onChange={(e) => setData('excerpt', e.target.value)}
                  rows={2}
                  placeholder="A brief description of your post"
                />
                <InputError message={errors.excerpt} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="content" value="Content" />
                <div className="mt-1">
                  <RichTextEditor
                    content={data.content}
                    onChange={content => setData('content', content)}
                  />
                </div>
                <InputError message={errors.content} className="mt-2" />
              </div>

              <div className="flex items-center">
                <input
                  id="is_published"
                  name="is_published"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={data.is_published}
                  onChange={(e) => setData('is_published', e.target.checked)}
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                  {data.is_published ? 'Published' : 'Save as draft'}
                </label>
              </div>

              <div className="flex items-center justify-end mt-6">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 mr-2"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Update Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}