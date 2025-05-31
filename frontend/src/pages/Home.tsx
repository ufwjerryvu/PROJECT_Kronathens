import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/navigation/Navigation';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/');
    };

    return (
        <>
            <Navigation />
            <div className='min-h-screen bg-base-200'>
                <div className='container mx-auto px-4'>
                    <div className='max-w-4xl mx-auto'>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Gloock&display=swap');
                        </style>
                        
                        {/* Hero section */}
                        <div className='text-center py-32'>
                            <h1 className='text-7xl font-bold text-base-content mb-8' style={{ fontFamily: 'Gloock, serif' }}>
                                Kronathens
                            </h1>
                            <p className='text-3xl text-base-content mb-6'>
                                Finally, a completely free collaborative checklist app that gets out of your way.
                            </p>
                            <p className='text-xl text-base-content/60 mb-16 max-w-2xl mx-auto'>
                                Other apps overwhelm you with features you don't need. 
                                We give you exactly what you need to collaborate and get things done.
                            </p>
                            
                            <button 
                                onClick={handleGetStarted}
                                className='btn btn-secondary btn-lg rounded-full px-12 gap-2'
                            >
                                Get Started
                                <ArrowRight className='w-5 h-5' />
                            </button>
                        </div>

                        {/* Simple demo section */}
                        <div className='py-20 border-t border-base-content/10'>
                            <div className='text-center mb-16'>
                                <h2 className='text-4xl font-bold text-base-content mb-4'>
                                    How it works
                                </h2>
                                <p className='text-xl text-base-content/60'>
                                    Three steps. That's it.
                                </p>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                                <div className='text-center'>
                                    <div className='w-16 h-16 bg-primary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold'>
                                        1
                                    </div>
                                    <h3 className='text-xl font-semibold text-base-content mb-3'>Write it down</h3>
                                    <p className='text-base-content/60'>
                                        There isn't much complexity to it. 
                                    </p>
                                </div>

                                <div className='text-center'>
                                    <div className='w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold'>
                                        2
                                    </div>
                                    <h3 className='text-xl font-semibold text-base-content mb-3'>Collaborate</h3>
                                    <p className='text-base-content/60'>
                                        Share with your team. Work together seamlessly.
                                    </p>
                                </div>

                                <div className='text-center'>
                                    <div className='w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-6'>
                                        <CheckCircle className='w-8 h-8' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-base-content mb-3'>Get it done</h3>
                                    <p className='text-base-content/60'>
                                        Focus on what matters. Check off completed tasks.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Final CTA */}
                        <div className='text-center py-20 border-t border-base-content/10'>
                            <h2 className='text-4xl font-bold text-base-content mb-6'>
                                Ready to simplify?
                            </h2>
                            <p className='text-xl text-base-content/60 mb-12'>
                                Join people who've rediscovered the joy of simple productivity.
                            </p>
                            
                            <button 
                                onClick={handleGetStarted}
                                className='btn btn-secondary btn-lg rounded-full px-12 gap-2'
                            >
                                Start Today
                                <ArrowRight className='w-5 h-5' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;