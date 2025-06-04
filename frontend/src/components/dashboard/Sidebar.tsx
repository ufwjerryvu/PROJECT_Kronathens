import React, { ChangeEvent, useState, useEffect } from 'react';

import { GroupInformation } from '../../interfaces/dashboard/GroupInformation';
import { CardInformation } from '../../interfaces/dashboard/CardInformation';

interface SidebarProps {
    groups: GroupInformation[];
    onAddGroup: (name: string, description: string) => void;
    onGroupSelect: (groupId: number) => void;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ groups, onAddGroup, onGroupSelect, onClose }) => {
    const [selectedGroupId, setSelectedGroupId] = useState<number>(0);

    /* Set to the first group on mount */
    useEffect(() => {
        const FIRST = 0;
        if (groups.length > 0) {
            setSelectedGroupId(groups[FIRST].id || 0);
        }
    }, [])

    /* Gets the intials of the group name */
    const parseInitials = (name: string) => {
        let separated = name.split(' ');

        const MAX_LENGTH = 2, INIT_INDEX = 0, ZERO = 0, ONE = 1;

        if (separated.length >= MAX_LENGTH) {
            return (separated[ZERO][INIT_INDEX] + separated[ONE][INIT_INDEX]).toUpperCase();
        } else {
            if (separated[ZERO].length < MAX_LENGTH) {
                return (separated[ZERO][INIT_INDEX]).toUpperCase();
            }

            return (separated[ZERO][INIT_INDEX] + separated[ZERO][ONE]).toUpperCase();
        }
    }

    /* Gives you a modal to create your group */
    const handleAddGroupButton = () => {
        const modal = document.getElementById('create_group_form') as HTMLDialogElement | null;

        if (modal) {
            modal.showModal();
        }
    };

    /* Gets information out of the modal forms to add a group object */
    const [name, setName] = useState('');
    const [description, setDescription] = useState('')

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    }

    /* Clear the form of the value and clear the states as well */
    const clearForm = () => {
        setName('');
        setDescription('');
    };

    /* Selecting the group and passing information back to the parent based on changes in the list */
    useEffect(() => {
        if (groups.length > 0) {
            const FIRST = 0;
            const lastGroup = groups[FIRST];
            setSelectedGroupId(lastGroup.id || 0);
            onGroupSelect(lastGroup.id || 0);
        }
        /* The dependency was just `groups` now changed to `groups.length` so it doesn't jump. */
    }, [groups.length]);

    const handleGroupClick = (groupId: number) => {
        setSelectedGroupId(groupId);
        onGroupSelect(groupId);
        onClose?.();
    };

    return (
        <div className='h-full flex flex-col'>
            {/* Close button for mobile - always visible on mobile */}
            <div className='md:hidden flex justify-end mb-4 px-2'>
                <button
                    onClick={onClose}
                    className='w-10 h-10 rounded-full bg-base-200 text-base-content/70 hover:bg-base-200/80 active:bg-base-200/60 transition-colors flex items-center justify-center'
                >
                    <i className='bi bi-x-lg text-lg' />
                </button>
            </div>

            {/* Header */}
            <div className='flex items-center justify-between mb-6 px-2'>
                <h2 className='text-lg font-semibold text-base-content/80 truncate'>Collections</h2>
                <button
                    onClick={handleAddGroupButton}
                    className='w-10 h-10 bg-secondary text-secondary-content rounded-full flex items-center justify-center text-sm 
                            font-medium transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60 flex-shrink-0'
                >
                    <i className='bi bi-plus-lg text-base' />
                </button>
            </div>

            {/* Groups List */}
            <div className='overflow-y-auto flex-1 -mx-2 px-2 auto-hide-scrollbar'>
                <ul className='space-y-2'>
                    {groups.map((group) => (
                        <li key={group.id}>
                            <div
                                className={`group/item w-full rounded-full py-2 pl-2 pr-2 flex items-center gap-2 transition-all duration-200
                                    ${selectedGroupId === group.id
                                        ? 'bg-neutral rounded-full'
                                        : 'hover:bg-base-200 rounded-full'
                                    }`}
                            >
                                <button
                                    onClick={() => handleGroupClick(group.id || 0)}
                                    className='flex-1 flex items-center gap-2 min-w-0'
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                        ${selectedGroupId === group.id
                                            ? 'bg-neutral-400/30 text-neutral-content'
                                            : 'bg-neutral/10 text-neutral-content/70'
                                        }`}
                                    >
                                        <span className='text-sm font-medium'>
                                            {parseInitials(group.name || '')}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-medium truncate
                                        ${selectedGroupId === group.id
                                            ? 'text-neutral-content'
                                            : 'text-base-content/70'
                                        }`}
                                    >
                                        {group.name}
                                    </span>
                                </button>
                                <div className='flex items-center gap-1'>
                                    <button 
                                        className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-base-200/50 transition-colors' 
                                        onClick={() => console.log(`Edit button clicked for group: ${group.name}`)}
                                    >
                                        <i className='bi bi-pencil text-base text-base-content/50 hover:text-blue-300 active:text-blue-400 transition-colors duration-200' />
                                    </button>
                                    <button 
                                        className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-base-200/50 transition-colors' 
                                        onClick={() => console.log(`Delete button clicked for group: ${group.name}`)}
                                    >
                                        <i className='bi bi-trash text-base text-base-content/50 hover:text-red-600 active:text-red-700 transition-colors duration-200' />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Create Group Modal */}
            <dialog id='create_group_form' className='modal'>
                <div className='modal-box w-11/12 max-w-sm sm:max-w-md mx-4'>
                    <form method='dialog'>
                        <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 w-8 h-8 min-h-8'>✕</button>
                    </form>
                    <h3 className='font-bold text-lg mb-6 text-center'>Create a new group</h3>
                    <div className='space-y-4 mb-8'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-base-content/70 px-2'>Name</label>
                            <input
                                type='text'
                                placeholder='Enter your group name'
                                className='input input-bordered w-full rounded-full bg-base-200 border-base-300 
                                    focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20 h-12'
                                onChange={handleNameChange}
                                value={name}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-base-content/70 px-2'>Description</label>
                            <textarea
                                placeholder='Optional: Brief description of the group'
                                className='textarea textarea-bordered w-full rounded-3xl bg-base-200 border-base-300 
                                        focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20 min-h-[120px] px-4'
                                onChange={handleDescriptionChange}
                                value={description}
                            />
                            <p className='text-xs text-base-content/50 px-2'>
                                Keep it short - less than 80 characters
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
                        <form method='dialog' className='order-1 sm:order-2'>
                            <button
                                className='w-full sm:w-auto h-12 px-6 sm:px-8 bg-secondary text-sm font-medium text-secondary-content rounded-full
                                        transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60 disabled:opacity-50'
                                onClick={() => {
                                    onAddGroup(name, description);
                                    clearForm();
                                    const dialog = document.getElementById('create_group_form');
                                    if (dialog instanceof HTMLDialogElement) {
                                        dialog.close();
                                    }
                                }}
                                disabled={!name.trim()}
                            >
                                Create Group
                            </button>
                        </form>
                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button>Close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Sidebar;