import { useState } from 'react';
import React from 'react';
import ThemeToggler from './ThemeToggler.tsx';

const Navigation: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return (
        <>
            <header className='sticky top-0 z-50 py-2'>
                <div className='container'>
                    <div className='navbar px-0'>
                        <div className='navbar-start'>
                            <div className='dropdown'>
                                <div tabIndex={0} role='button' className='btn btn-primary btn-circle lg:hidden mr-1'>
                                    <i className='bi bi-list text-2xl'></i>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className='menu menu-sm dropdown-content mt-1 p-2 shadow bg-base-200 rounded-box z-[1] w-52 p-2 shadow'>
                                    <li><a href='#!'>Dashboard</a></li>
                                    <li><a href='.'>Home</a></li>
                                    <li><a href='#!'>About</a></li>
                                </ul>
                            </div>
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Gloock&display=swap');
                            </style>

                            <a href='.' className='text-3xl font-semibold' style={{ fontFamily: 'Gloock, serif' }}>
                                Krothena
                            </a>
                        </div>
                        <div className='navbar-center hidden lg:flex'>
                            <ul className='menu menu-horizontal px-1 font-medium'>
                                <li><a className='rounded-full hover:bg-rose-200 active:!bg-rose-700 focus:!bg-rose-200 focus:!text-white' href='.'>Home</a></li>
                                <li><a className='rounded-full hover:bg-rose-200 active:!bg-rose-700 focus:!bg-rose-200 focus:!text-white' href='#!'>Dashboard</a></li>
                                <li><a className='rounded-full hover:bg-rose-200 active:!bg-rose-700 focus:!bg-rose-200 focus:!text-white' href='#!'>About</a></li>
                            </ul>
                        </div>
                        <div className='navbar-end'>
                            <div className='flex items-center gap-5'>
                                <ThemeToggler />
                                {
                                    !isLoggedIn ? (
                                        <button className="btn h-11 min-h-[2rem] normal-case rounded-full px-6
                                        bg-primary hover:bg-primary/80 
                                        text-primary-content border-none">
                                            Sign in
                                        </button>
                                    ) : (
                                        <button className="h-9 w-9 flex items-center justify-center">
                                            <i className="bi bi-person text-[37px]"></i>
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navigation;