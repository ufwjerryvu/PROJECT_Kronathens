import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../services/authentication/AuthContext';
import axios from 'axios';

interface LoginCredentials {
    username: string;
    password: string;
    rememberMe: boolean;
}

interface ValidationErrors {
    username?: string;
    password?: string;
}

const Login: React.FC = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: '',
        rememberMe: false
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState<ValidationErrors>({});

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setCredentials(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: ValidationErrors = {};

        if (!credentials.username) {
            newErrors.username = 'Username is required';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                /* POST method */
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login/`, {
                    username: credentials.username,
                    password: credentials.password
                });

                const data = response.data;

                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                setIsLoggedIn(true);

                navigate('/');
            } catch (error) {
                console.error('Sign in failed:', error);
            }
        }
    };

    const handleNavigateToRegister = () => {
        navigate('/register');
    }

    return (
        <>
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
                        {/* Username input */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-base-content/70 px-2'>
                                Username
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <User className='h-5 w-5 text-base-content/50' />
                                </div>
                                <input
                                    type='text'
                                    name='username'
                                    value={credentials.username}
                                    onChange={handleInputChange}
                                    className={`input w-full pl-11 rounded-full bg-base-300 border-base-300 
                                    focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20
                                    ${errors.username ? 'border-error' : ''}`}
                                    placeholder='Enter your username'
                                />
                            </div>
                            {errors.username && (
                                <p className='text-xs text-error px-2'>{errors.username}</p>
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