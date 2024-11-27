import React, { ChangeEvent, useState, useEffect } from 'react';

import { GroupInformation } from '../../interfaces/dashboard/GroupInformation.ts';
// import { CardInformation } from '../../interfaces/dashboard/CardInformation.ts';

interface SidebarProps {
    groups: GroupInformation[],
    onAddGroup: (name: string, description: string) => void,
    onGroupSelect: (groupdId: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ groups, onAddGroup, onGroupSelect }) => {
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');

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
            const lastGroup = groups[groups.length - 1];
            setSelectedGroupId(lastGroup.id);
            onGroupSelect(lastGroup.id);
        }
    }, [groups]);

    return (
        <div className='h-full flex flex-col p-2 pt-4'>
            {/* Header of the sidebar */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold px-2'>All Groups</h2>
                <button
                    onClick={handleAddGroupButton}
                    className='h-9 px-2.5 bg-secondary text-secondary-content rounded-full flex items-center gap-1.5 text-sm 
                        font-medium whitespace-nowrap transition-all duration-200 hover:opacity-80 active:opacity-60'
                >
                    <i className='bi bi-plus-lg text-base'></i>
                    <span className='hidden sm:inline'>Add</span>
                </button>
            </div>

            {/* Create group modal */}
            <div className='relative'>
                <dialog id='create_group_form' className='modal'>
                    <div className='modal-box max-w-sm md:max-w-md'>
                        <form method='dialog'>
                            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
                        </form>
                        <h3 className='font-bold text-lg pb-6 text-center'>Create a new group</h3>
                        <div className='space-y-4 pb-8'>
                            <input
                                type='text'
                                placeholder='Enter your group name here'
                                className='input input-bordered w-full rounded-3xl'
                                onChange={handleNameChange}
                                value={name}
                            />
                            <textarea
                                placeholder='Optional: enter a short description of the group (less than 80 characters).'
                                className='textarea textarea-bordered textarea-md w-full rounded-3xl text-md h-32'
                                onChange={handleDescriptionChange}
                                value={description}
                            >
                            </textarea>
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2'>
                            <div className='flex justify-start'>
                                <form method='dialog'>
                                    <button className='px-4 py-2 bg-neutral-500 text-sm text-white rounded-full
                                    duration-200 hover:bg-opacity-80 active:bg-opacity-60'>Close</button>
                                </form>
                            </div>
                            <div className='flex justify-end'>
                                <form method='dialog'>
                                    <button className='px-3 py-2 bg-green-600 text-sm text-white rounded-full transition-all
                                    duration-200 hover:bg-opacity-80 active:bg-opacity-60'
                                        onClick={() => {
                                            onAddGroup(name, description);
                                            clearForm();
                                        }}
                                    >Confirm</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <form method='dialog' className='modal-backdrop'>
                        <button></button>
                    </form>
                </dialog>
            </div>

            {/* Display all groups */}
            <div className='overflow-y-auto pt-3 auto-hide-scrollbar'>
                <ul>
                    {groups.map((group) => (
                        <li key={group.id} className='mb-1'>
                            <button
                                onClick={() => { setSelectedGroupId(group.id); onGroupSelect(group.id); }}
                                className={`w-full rounded-full py-2 pl-2 flex items-center gap-3 transition-colors duration-200
                                ${selectedGroupId === group.id ? 'bg-neutral text-neutral-content' : 'hover:bg-neutral/10'}`}
                            >
                                <div className={`w-8 h-8 ${selectedGroupId === group.id ? 'bg-neutral-400' : 'bg-neutral'} 
                                        rounded-full flex items-center 
                                        justify-center text-neutral-content font-medium text-sm`}>
                                    {parseInitials(group.name)}
                                </div>
                                <span className='text-sm font-medium truncate'>
                                    {group.name}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;