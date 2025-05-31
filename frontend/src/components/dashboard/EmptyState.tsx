import React from 'react';

import { useAuth } from '../../services/authentication/AuthContext';

const EmptyState = () => {
    const {isLoggedIn} = useAuth();

    /* Gives you a modal to create your group */
    const handleAddGroupButton = () => {
        const modal = document.getElementById('create_group_form') as HTMLDialogElement | null;

        if (modal) {
            modal.showModal();
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='bg-base-300 rounded-full p-6 mb-4'>
                <svg
                    className='w-8 h-8 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4v16m8-8H4'
                    />
                </svg>
            </div>

            <p className='text-xl text-gray-600 font-medium mb-2 text-center px-4 sm:px-0'>
                Create your first group to get
            </p>
            <p className='text-xl text-gray-600 font-medium mb-2 text-center px-4 sm:px-0 pb-3'>
                 started with Kronathens.
            </p>

            {
                isLoggedIn ? (<></>) : (
                    <p className="text-md text-gray-600 pb-5">
                    Your data won't be saved unless you log in.
                    </p>
                )
            }

            <button
                className='px-6 py-2 bg-secondary text-secondary-content rounded-full 
                    flex items-center gap-1.5 text-sm font-medium whitespace-nowrap
                    transition-all duration-200 hover:opacity-80 active:opacity-60'
                onClick={handleAddGroupButton}
            >
                <i className='bi bi-plus-lg text-base'></i> Create Group
            </button>
            
        </div>
    );
};

export default EmptyState;