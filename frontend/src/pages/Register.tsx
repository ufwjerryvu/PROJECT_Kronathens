import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/navigation/Navigation';

/* Interface for storing signup form data */
interface RegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

/* Interface for form validation errors */
interface ValidationErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
}

const Register: React.FC = () => {
    /* Form state management for signup data */
    const [formData, setFormData] = useState<RegisterFormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    /* Navigation hook for redirecting to login page */
    const navigate = useNavigate();

    /* State for handling validation errors */
    const [errors, setErrors] = useState<ValidationErrors>({});

    /* Handles input changes for the form fields */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    /* Validates the form data */
    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        /* Validate full name */
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.length < 2) {
            newErrors.fullName = 'Name is too short';
        }

        /* Validate email */
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        /* Validate password */
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }

        /* Validate password confirmation */
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        /* Validate terms acceptance */
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        return newErrors;
    };

    /* Form submission handler with validation */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                console.log('Attempting to create account with:', formData);
                // Add your signup logic here
            } catch (error) {
                console.error('Sign up failed:', error);
            }
        }
    };

    /* Renders a form input field with consistent styling */
    const renderInput = (
        name: keyof RegisterFormData,
        label: string,
        type: string,
        placeholder: string,
        icon: React.ReactNode
    ) => (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-base-content/70 px-2'>
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    {icon}
                </div>
                <input
                    type={type}
                    name={name}
                    value={formData[name].toString()}
                    onChange={handleInputChange}
                    className={`input w-full pl-11 rounded-full bg-base-300 border-base-300 
                        focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20
                        ${errors[name] ? 'border-error' : ''}`}
                    placeholder={placeholder}
                />
            </div>
            {errors[name] && (
                <p className='text-xs text-error px-2 flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors[name]}
                </p>
            )}
        </div>
    );

    /* Navigate to login page */
    const handleNavigateToLogin = () => {
        navigate('/login');
    }

    return (
        <>
            <Navigation />
            <div className='container mx-auto pt-12 pb-12 px-4'>
                <div className='max-w-md mx-auto rounded-3xl bg-base-200 p-8'>
                    {/* Header section */}
                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold text-base-content mb-2'>Create an account</h2>
                        <p className='text-base-content/70 text-sm'>
                            Join us today and get started
                        </p>
                    </div>

                    {/* Sign up form */}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {renderInput(
                            'fullName',
                            'Full Name',
                            'text',
                            'Enter your full name',
                            <User className='h-5 w-5 text-base-content/50' />
                        )}

                        {renderInput(
                            'email',
                            'Email address',
                            'email',
                            'Enter your email',
                            <Mail className='h-5 w-5 text-base-content/50' />
                        )}

                        {renderInput(
                            'password',
                            'Password',
                            'password',
                            'Create a password',
                            <Lock className='h-5 w-5 text-base-content/50' />
                        )}

                        {renderInput(
                            'confirmPassword',
                            'Confirm Password',
                            'password',
                            'Confirm your password',
                            <Lock className='h-5 w-5 text-base-content/50' />
                        )}

                        {/* Terms and conditions checkbox */}
                        <div className='space-y-2 px-2'>
                            <label className='flex items-center space-x-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    name='acceptTerms'
                                    checked={formData.acceptTerms}
                                    onChange={handleInputChange}
                                    className='checkbox checkbox-sm checkbox-secondary'
                                />
                                <span className='text-sm text-base-content/70'>
                                    I accept the terms and conditions
                                </span>
                            </label>
                            {errors.acceptTerms && (
                                <p className='text-xs text-error flex items-center gap-1'>
                                    <AlertCircle className='h-3 w-3' />
                                    {errors.acceptTerms}
                                </p>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type='submit'
                            className='w-full px-4 py-2.5 bg-secondary text-secondary-content rounded-full
                            transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60
                            font-medium text-sm'
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Sign in link */}
                    <div className='text-center mt-6'>
                        <span className='text-sm text-base-content/70'>Already have an account? </span>
                        <button
                            type='button'
                            onClick={handleNavigateToLogin}
                            className='text-sm font-medium text-secondary hover:text-secondary/80 transition-colors'
                        >
                            Sign in instead
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;