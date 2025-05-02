import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { useAuth } from '@/Context/AuthContext';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { token } = useAuth();

    // Redirect if authenticated
    useEffect(() => {
        if (token) {
            window.location.href = '/dashboard';
        }
    }, [token]);

    return (
        <>
            <Head title="Welcome to Authentication System" />
            <div className="bg-gray-50 min-h-screen text-black/90 dark:bg-gray-900 dark:text-white/90">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 py-12 lg:max-w-4xl">
                        <header className="flex justify-between items-center mb-10">
                            <div className="flex items-center">
                                <svg
                                    className="h-12 w-auto text-[#FF2D20]"
                                    viewBox="0 0 62 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <h1 className="ml-3 text-xl font-semibold">Authentication System</h1>
                            </div>
                            <nav className="flex space-x-4">
                                <Link
                                    href={route('login')}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#FF2D20] hover:bg-[#FF2D20]/90"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    Register
                                </Link>
                            </nav>
                        </header>

                        <main>
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                                    Secure Authentication System
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                    Welcome to our enhanced security and user management system featuring Laravel Sanctum for API authentication, user registration & login, and protected routes.
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF2D20]/10 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF2D20]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Secure Authentication</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Leveraging Laravel Sanctum for token-based API authentication with advanced security features.
                                    </p>
                                </div>

                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF2D20]/10 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF2D20]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">User Management</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Simple yet powerful user registration, profile management, and account control.
                                    </p>
                                </div>

                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF2D20]/10 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF2D20]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Protected Routes</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Route protection with middleware ensures only authenticated users can access restricted content.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Link
                                    href={route('register')}
                                    className="px-6 py-3 bg-[#FF2D20] text-white font-medium rounded-md hover:bg-[#FF2D20]/90"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </main>

                        <footer className="mt-16 py-8 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
                            <p>Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                            <p className="mt-2">© {new Date().getFullYear()} Authentication System. All rights reserved.</p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
