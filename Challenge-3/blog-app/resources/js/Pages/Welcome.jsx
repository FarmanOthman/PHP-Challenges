import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion, canLogin, canRegister }) {
  return (
    <>
      <Head title="Welcome" />
      <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 selection:bg-blue-500 selection:text-white">
        <div className="relative">
          {/* Hero section */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pt-10 pb-20 sm:pt-16 sm:pb-32">
                <div className="text-center">
                  <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">Welcome to our</span>
                    <span className="block mt-1">Modern Blog Platform</span>
                  </h1>
                  <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Explore insightful articles, share your thoughts, and connect with a vibrant community of writers and readers.
                  </p>
                  <div className="mt-8 sm:flex sm:justify-center">
                    <div className="rounded-md shadow">
                      <Link
                        href={route('posts.index')}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        Explore Posts
                      </Link>
                    </div>
                    {canLogin && auth.user ? (
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          href={route('posts.create')}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                        >
                          Create Post
                        </Link>
                      </div>
                    ) : (
                      canRegister && (
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                          <Link
                            href={route('register')}
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                          >
                            Sign up
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <svg className="absolute inset-x-0 bottom-0 text-white" viewBox="0 0 1160 163" fill="currentColor" preserveAspectRatio="none">
              <path d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z" />
            </svg>
          </div>

          <div className="relative bg-white overflow-hidden py-16">
            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  A better way to blog
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  Our platform offers everything you need to create, manage, and share your thoughts with the world.
                </p>
              </div>

              <div className="mt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Feature 1 */}
                  <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Rich Text Editor</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Create beautiful content with our powerful Markdown and rich text editor.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Commenting System</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Engage with readers through our interactive commenting system.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Blazing Fast</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Built with React and Laravel's powerful caching for optimal performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 overflow-hidden sm:px-6 lg:px-8">
              <div className="mt-8 flex justify-center space-x-6">
                {canLogin && !auth.user ? (
                  <Link
                    href={route('login')}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    Log in
                  </Link>
                ) : (
                  auth.user && (
                    <Link
                      href={route('dashboard')}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                  )
                )}

                {canRegister && !auth.user && (
                  <Link
                    href={route('register')}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    Register
                  </Link>
                )}
              </div>
              <p className="mt-8 text-center text-base text-gray-500">
                &copy; {new Date().getFullYear()} Blog App. Built with Laravel v{laravelVersion} and PHP v{phpVersion}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
