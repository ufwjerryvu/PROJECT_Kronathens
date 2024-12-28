import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/navigation/Navigation.tsx';

/* Interface for storing signin credentials */
interface LoginCredentials {
    email: string;
    password: string;
    rememberMe: boolean;
}

/* Interface for form validation errors */
interface ValidationErrors {
    email?: string;
    password?: string;
}

const Login: React.FC = () => {
    /* Form state management for signin credentials */
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
        rememberMe: false
    });

    const navigate = useNavigate();

    /* State for handling validation errors */
    const [errors, setErrors] = useState<ValidationErrors>({});

    /* Handles input changes for the form fields */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setCredentials(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    /* Form submission handler with validation */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        /* Validate form before submission */
        const newErrors: ValidationErrors = {};

        if (!credentials.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                console.log('Attempting sign in with:', credentials);
                // Add your authentication logic here
            } catch (error) {
                console.error('Sign in failed:', error);
            }
        }
    };

    /* Navigate to sign up page */
    const handleNavigateToRegister = () => {
        navigate('/register');
    }

    return (
        <>
            <Navigation />
            <div className='container mx-auto pt-12 pb-12 px-4'>
                <div className='max-w-md mx-auto rounded-3xl bg-base-200 p-8'>
                    {/* Header section */}
                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold text-base-content mb-2'>Welcome back</h2>
                        <p className='text-base-content/70 text-sm'>
                            Please sign in to your account
                        </p>
                    </div>

                    {/* Sign in form */}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Email input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-base-content/70 px-2'>
                                Email address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Mail className='h-5 w-5 text-base-content/50' />
                                </div>
                                <input
                                    type='email'
                                    name='email'
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    className={`input w-full pl-11 rounded-full bg-base-300 border-base-300 
                                    focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20
                                    ${errors.email ? 'border-error' : ''}`}
                                    placeholder='Enter your email'
                                />
                            </div>
                            {errors.email && (
                                <p className='text-xs text-error px-2'>{errors.email}</p>
                            )}
                        </div>

                        {/* Password input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-base-content/70 px-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-base-content/50' />
                                </div>
                                <input
                                    type='password'
                                    name='password'
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    className={`input w-full pl-11 rounded-full bg-base-300 border-base-300 
                                    focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20
                                    ${errors.password ? 'border-error' : ''}`}
                                    placeholder='Enter your password'
                                />
                            </div>
                            {errors.password && (
                                <p className='text-xs text-error px-2'>{errors.password}</p>
                            )}
                        </div>

                        {/* Remember me and Forgot password */}
                        <div className='flex items-center justify-between px-2'>
                            <label className='flex items-center space-x-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    name='rememberMe'
                                    checked={credentials.rememberMe}
                                    onChange={handleInputChange}
                                    className='checkbox checkbox-sm checkbox-secondary'
                                />
                                <span className='text-sm text-base-content/70'>Remember me</span>
                            </label>
                            <button
                                type='button'
                                className='text-sm text-secondary hover:text-secondary/80 transition-colors'
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit button */}
                        <button
                            type='submit'
                            className='w-full px-4 py-2.5 bg-secondary text-secondary-content rounded-full
                            transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60
                            font-medium text-sm'
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Sign up link */}
                    <div className='text-center mt-6'>
                        <span className='text-sm text-base-content/70'>Don't have an account? </span>
                        <button
                            type='button'
                            onClick={handleNavigateToRegister}
                            className='text-sm font-medium text-secondary hover:text-secondary/80 transition-colors'
                        >
                            Sign up now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;