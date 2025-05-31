import React from 'react';
import { CheckCircle, Zap, Target } from 'lucide-react';

import Navigation from '../components/navigation/Navigation';

const About: React.FC = () => {
    return (
        <>
            <Navigation />
            <div className='min-h-screen bg-base-200'>
                <div className='container mx-auto px-4 py-16'>
                    <div className='max-w-3xl mx-auto'>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Gloock&display=swap');
                        </style>
                        
                        {/* Hero section */}
                        <div className='text-center mb-20'>
                            <h1 className='text-6xl font-bold text-base-content mb-6' style={{ fontFamily: 'Gloock, serif' }}>
                                Kronathens
                            </h1>
                            <p className='text-2xl text-base-content mb-12'>
                                Other to-do apps are too complex.
                            </p>
                            <div className='text-lg text-base-content/60'>
                                Let's bring simplicity back to productivity.
                            </div>
                        </div>

                        {/* Core principles */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
                            <div className='text-center'>
                                <div className='w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
                                    <Zap className='w-8 h-8 text-base-content' />
                                </div>
                                <h3 className='text-xl font-semibold text-base-content mb-2'>Fast</h3>
                                <p className='text-base-content/60'>
                                    Add tasks instantly. No friction.
                                </p>
                            </div>

                            <div className='text-center'>
                                <div className='w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
                                    <Target className='w-8 h-8 text-base-content' />
                                </div>
                                <h3 className='text-xl font-semibold text-base-content mb-2'>Focused</h3>
                                <p className='text-base-content/60'>
                                    Clean interface. Zero distractions.
                                </p>
                            </div>

                            <div className='text-center'>
                                <div className='w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
                                    <CheckCircle className='w-8 h-8 text-base-content' />
                                </div>
                                <h3 className='text-xl font-semibold text-base-content mb-2'>Simple</h3>
                                <p className='text-base-content/60'>
                                    Does one thing incredibly well.
                                </p>
                            </div>
                        </div>

                        {/* Creator section */}
                        <div className='text-center'>
                            <div className='text-base-content/40 text-sm'>
                                Made by Jerry Vu
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;