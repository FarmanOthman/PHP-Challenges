import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useAuth } from '@/Context/AuthContext';

export default function Register() {
    const { register: contextRegister, token } = useAuth();
    const [apiError, setApiError] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // If we have a token from context, redirect to dashboard
    useEffect(() => {
        if (token) {
            window.location.href = '/dashboard';
        }
    }, [token]);

    const submit = async (e) => {
        e.preventDefault();
        setApiError(null);

        try {
            // First use Inertia form submission
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
                onError: (errors) => {
                    // If Inertia has validation errors, don't proceed with API registration
                    if (Object.keys(errors).length > 0) {
                        return;
                    }
                }
            });

            // Also update our auth context
            await contextRegister({
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation
            });
        } catch (error) {
            const errorMessage = error.response?.data?.errors || error.response?.data?.message || 'Registration failed';
            setApiError(typeof errorMessage === 'object' ? Object.values(errorMessage).flat().join(', ') : errorMessage);
            reset('password', 'password_confirmation');
        }
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {apiError && (
                <div className="mb-4 text-sm font-medium text-red-600">
                    {apiError}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
