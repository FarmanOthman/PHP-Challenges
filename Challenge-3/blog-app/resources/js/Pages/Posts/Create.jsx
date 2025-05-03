import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        azure_blob_name: '',
    });

    const [uploadStatus, setUploadStatus] = useState({
        uploading: false,
        progress: 0,
        error: null,
        imageUrl: null
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData(name, value);
    }

    async function uploadImage(file) {
        if (!file) return;

        setUploadStatus({
            uploading: true,
            progress: 0,
            error: null,
            imageUrl: null
        });

        try {
            // Initialize the Azure Uploader
            const uploader = new window.AzureUploader({
                onProgress: (progress) => {
                    setUploadStatus(prev => ({
                        ...prev, 
                        progress
                    }));
                },
                onError: (error) => {
                    console.error('Upload error:', error);
                    setUploadStatus(prev => ({
                        ...prev,
                        error: 'Error uploading image: ' + error.message,
                        uploading: false
                    }));
                }
            });

            // Upload the file directly to Azure
            const result = await uploader.uploadFile(file);
            
            // Update the form with the blob name
            setData('azure_blob_name', result.blobName);
            
            // Show preview
            setUploadStatus({
                uploading: false,
                progress: 100,
                error: null,
                imageUrl: result.url
            });
            
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus({
                uploading: false,
                progress: 0,
                error: 'Failed to upload image: ' + error.message,
                imageUrl: null
            });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('posts.store'));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Post" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                        Featured Image
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => uploadImage(e.target.files[0])}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    
                                    {/* Image upload status */}
                                    {uploadStatus.uploading && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadStatus.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Uploading: {uploadStatus.progress}%
                                            </p>
                                        </div>
                                    )}
                                    
                                    {uploadStatus.error && (
                                        <div className="text-red-500 text-sm mt-1">{uploadStatus.error}</div>
                                    )}
                                    
                                    {/* Preview image */}
                                    {uploadStatus.imageUrl && (
                                        <div className="mt-2">
                                            <img 
                                                src={uploadStatus.imageUrl}
                                                alt="Preview" 
                                                className="max-w-xs rounded-md shadow-sm"
                                            />
                                        </div>
                                    )}
                                    
                                    {errors.azure_blob_name && (
                                        <div className="text-red-500 text-sm mt-1">
                                            Please upload an image for your post
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                        Content
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={data.content}
                                        onChange={handleInputChange}
                                        rows="10"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    ></textarea>
                                    {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">
                                        Excerpt (optional)
                                    </label>
                                    <textarea
                                        id="excerpt"
                                        name="excerpt"
                                        value={data.excerpt}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Leave blank to auto-generate from content"
                                    ></textarea>
                                    {errors.excerpt && <div className="text-red-500 text-sm mt-1">{errors.excerpt}</div>}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing || uploadStatus.uploading}
                                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                            (processing || uploadStatus.uploading) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {processing ? 'Publishing...' : 'Publish Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}