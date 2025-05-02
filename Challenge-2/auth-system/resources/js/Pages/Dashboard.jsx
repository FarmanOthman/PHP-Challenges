import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useAuth } from '@/Context/AuthContext';

export default function Dashboard() {
    const { user, loading } = useAuth();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {loading ? (
                                <p>Loading user information...</p>
                            ) : (
                                <>
                                    <h3 className="text-lg font-medium">Welcome, {user?.name}!</h3>
                                    <p className="mt-2">You're logged in!</p>
                                    <div className="mt-4">
                                        <h4 className="text-md font-medium">Your Account Details:</h4>
                                        <ul className="list-disc pl-5 mt-2">
                                            <li>Name: {user?.name}</li>
                                            <li>Email: {user?.email}</li>
                                            <li>Joined: {new Date(user?.created_at).toLocaleDateString()}</li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
