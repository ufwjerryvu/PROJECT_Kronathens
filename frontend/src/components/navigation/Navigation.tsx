import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';

import { useAuth } from '../../services/authentication/AuthContext';
import ThemeToggler from './ThemeToggler';

const Navigation: React.FC = () => {
    const {isLoggedIn, setIsLoggedIn} = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    
    const handleNavigateToLogin = () => {
        navigate('/login');
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/login')
    }

    const handleProfileAction = (action: string) => {
        setIsProfileDropdownOpen(false);
        switch(action) {
            case 'profile':
                navigate('/profile');
                break;
            case 'settings':
                navigate('/settings');
                break;
            case 'logout':
                handleLogout();
                break;
        }
    }

    const handleNavigation = (path: string) => {
        setTimeout(() => {
            navigate(path);
            setIsMobileMenuOpen(false);
        }, 0);
    }

    return (
        <>
            <header className='sticky top-0 z-50 w-full bg-base-100 shadow-sm'>
                <div className='container mx-auto px-4'>
                    <div className='navbar bg-base-100 py-2 sm:py-4'>
                        <div className='navbar-start'>
                            <div className='relative lg:hidden'>
                                <button 
                                    className='btn btn-primary btn-circle mr-2 w-10 h-10 min-h-10'
                                    onClick={toggleMobileMenu}
                                >
                                    <Menu className='w-6 h-6' />
                                </button>
                                {isMobileMenuOpen && (
                                    <>
                                        <div 
                                            className='fixed inset-0 z-10' 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        ></div>
                                        <div className='absolute left-0 top-full mt-1 w-52 bg-base-200 shadow-lg rounded-box z-20 p-2'>
                                            <a 
                                                href="/home" 
                                                className='block px-4 py-2 hover:bg-base-300 rounded transition-colors text-sm'
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Home
                                            </a>
                                            <a 
                                                href="/" 
                                                className='block px-4 py-2 hover:bg-base-300 rounded transition-colors text-sm'
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </a>
                                            <a 
                                                href="/about" 
                                                className='block px-4 py-2 hover:bg-base-300 rounded transition-colors text-sm'
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                About
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Gloock&display=swap');
                            </style>

                            <button 
                                onClick={() => navigate('/')}
                                className='text-xl sm:text-2xl lg:text-3xl font-semibold truncate max-w-[150px] sm:max-w-none bg-transparent border-none p-0' 
                                style={{ fontFamily: 'Gloock, serif' }}
                            >
                                Kronathens
                            </button>
                        </div>
                        
                        <div className='navbar-center hidden lg:flex'>
                            <ul className='menu menu-horizontal px-1 font-medium space-x-1'>
                                <li>
                                    <button 
                                        type="button"
                                        className='rounded-full hover:bg-base-200 active:!bg-primary focus:!bg-base-200 px-4 py-2 transition-colors' 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate('/home');
                                        }}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button"
                                        className='rounded-full hover:bg-base-200 active:!bg-primary focus:!bg-base-200 px-4 py-2 transition-colors' 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate('/');
                                        }}
                                    >
                                        Dashboard
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button"
                                        className='rounded-full hover:bg-base-200 active:!bg-primary focus:!bg-base-200 px-4 py-2 transition-colors' 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate('/about');
                                        }}
                                    >
                                        About
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <div className='navbar-end'>
                            <div className='flex items-center gap-2'>
                                <ThemeToggler />
                                {
                                    !isLoggedIn ? (
                                        <button 
                                            className='btn btn-sm h-9 min-h-9 normal-case rounded-full 
                                            px-4 text-sm
                                            bg-primary hover:bg-primary/80 
                                            text-primary-content border-none
                                            transition-all duration-200'
                                            onClick={handleNavigateToLogin}
                                        >
                                            Login
                                        </button>
                                    ) : (
                                        <div className='flex items-center gap-1'>
                                            <button className='btn btn-ghost btn-sm btn-circle h-9 w-9 min-h-9'>
                                                <Bell className='w-4 h-4' />
                                            </button>
                                            
                                            <div className='dropdown dropdown-end'>
                                                <div 
                                                    tabIndex={0} 
                                                    role='button' 
                                                    className='btn btn-ghost btn-sm btn-circle h-9 w-9 min-h-9'
                                                    onClick={toggleProfileDropdown}
                                                >
                                                    <User className='w-4 h-4' />
                                                </div>
                                                {isProfileDropdownOpen && (
                                                    <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-200 rounded-box w-48 z-[1] mt-2'>
                                                        <li>
                                                            <button 
                                                                className='flex items-center gap-3 px-3 py-2 text-sm hover:bg-base-300 transition-colors rounded-lg'
                                                                onClick={() => handleProfileAction('profile')}
                                                            >
                                                                <User className='w-4 h-4' />
                                                                Profile
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                className='flex items-center gap-3 px-3 py-2 text-sm hover:bg-base-300 transition-colors rounded-lg'
                                                                onClick={() => handleProfileAction('settings')}
                                                            >
                                                                <Settings className='w-4 h-4' />
                                                                Settings
                                                            </button>
                                                        </li>
                                                        <div className='divider my-1'></div>
                                                        <li>
                                                            <button 
                                                                className='flex items-center gap-3 px-3 py-2 text-sm hover:bg-error hover:text-error-content transition-colors rounded-lg'
                                                                onClick={() => handleProfileAction('logout')}
                                                            >
                                                                <LogOut className='w-4 h-4' />
                                                                Logout
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
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