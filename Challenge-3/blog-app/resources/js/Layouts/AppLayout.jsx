import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function AppLayout({ auth, header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold text-blue-600">Blog</span>
                </Link>
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                  All Posts
                </NavLink>
                
                {auth.user && (
                  <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                    Dashboard
                  </NavLink>
                )}
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ml-6">
              {auth.user ? (
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="font-medium text-base text-gray-800 mr-4">
                      {auth.user.name}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={route('profile.edit')}
                        className="text-sm text-gray-700 dark:text-gray-500 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Profile
                      </Link>
                      
                      <span className="text-gray-300">|</span>
                      
                      <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-gray-700 dark:text-gray-500 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Log Out
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href={route('login')}
                    className="text-sm text-gray-700 dark:text-gray-500 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Log in
                  </Link>

                  <Link
                    href={route('register')}
                    className="ml-4 px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink href={route('posts.index')} active={route().current('posts.index')}>
              All Posts
            </ResponsiveNavLink>
            {auth.user && (
              <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                Dashboard
              </ResponsiveNavLink>
            )}
          </div>

          {auth.user && (
            <div className="pt-4 pb-1 border-t border-gray-200">
              <div className="px-4">
                <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
              </div>

              <div className="mt-3 space-y-1">
                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                  Log Out
                </ResponsiveNavLink>
              </div>
            </div>
          )}

          {!auth.user && (
            <div className="pt-4 pb-1 border-t border-gray-200">
              <div className="mt-3 space-y-1">
                <ResponsiveNavLink href={route('login')}>Log in</ResponsiveNavLink>
                <ResponsiveNavLink href={route('register')}>Register</ResponsiveNavLink>
              </div>
            </div>
          )}
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-100 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-lg font-medium text-blue-600">Blog</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-500">
                &copy; {new Date().getFullYear()} Blog App. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
        active
          ? 'border-blue-500 text-gray-900 focus:border-blue-700'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );
}

function ResponsiveNavLink({ method = 'get', as = 'a', href, active = false, children }) {
  return (
    <Link
      method={method}
      as={as}
      href={href}
      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
        active
          ? 'border-blue-400 text-blue-700 bg-blue-50 focus:text-blue-800 focus:bg-blue-100 focus:border-blue-700'
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );
}