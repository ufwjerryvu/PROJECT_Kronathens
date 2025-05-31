import React, { ChangeEvent, useEffect, useState } from 'react';

import Header from './Header';
import Card from './CardItem';
import ListItem from './ListItem';
import Sidebar from './Sidebar';
import EmptyState from './EmptyState';
import sortCards from './Sorter';
import Workspace from '../workspace/Workspace';

import { GroupInformation } from '../../interfaces/dashboard/GroupInformation';
import { CardInformation } from '../../interfaces/dashboard/CardInformation';
import { Task } from '../../interfaces/workspace/Task';
import { useAuth } from '../../services/authentication/AuthContext';


const Box: React.FC = () => {
    const { isLoggedIn } = useAuth();
    type ViewType = 'card' | 'list';

    /* Set box view type either as card or list for now, might add more later. Who knows? */
    const [viewType, setViewType] = useState<ViewType>('card');

    /* Groups will happen to store card/list items and their meta information */
    const [groups, setGroups] = useState<GroupInformation[]>([]);
    const [currentGroup, setCurrentGroup] = useState<GroupInformation>();

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    /* Selected card for the workspace. The current card being opened. */
    const [selectedCard, setSelectedCard] = useState<CardInformation | null>(null);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    useEffect(() => {
        const fetchAllGroups = async () => {
            if (isLoggedIn) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/collaboration/groups/all/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        const mappedGroups: GroupInformation[] = data.map((group: any) => ({
                            id: group.id,
                            name: group.name,
                            description: group.description,
                            cards: []
                        }))

                        setGroups(mappedGroups);
                    }
                } catch (error) {
                    console.error("Cannot load groups/collections.")
                }
            }
        }

        fetchAllGroups();
    }, [isLoggedIn])

    useEffect(() => {
        if (groups.length > 0) {
            setCurrentGroup(groups[0]);
        }
    }, [groups]);

    /* Edit the card */
    const handleChecklistItemEdit = (id: string) => {
        if (currentGroup?.cards) {
            const card = currentGroup.cards[parseInt(id)];
            if (card) {
                setSelectedCard(card);
                setIsWorkspaceOpen(true);
            }
        }
    };

    /* Handles when card is clicked on. If cards exist, get the index of the ID. */
    const handleCardClick = (id: string) => {
        if (currentGroup?.cards) {
            const card = currentGroup.cards[parseInt(id)];
            if (card) {
                setSelectedCard(card);
                setIsWorkspaceOpen(true);
            }
        }
    };

    /* Handles when the user presses on the button to go back. */
    const handleWorkspaceClose = () => {
        setIsWorkspaceOpen(false);

        /* Clear after animation */
        setTimeout(() => setSelectedCard(null), 300);
    };

    /* Delete the card */
    const handleDelete = (id: string) => {
        console.log('Delete card:', id);
    };

    /* Add a collaborator to the space */
    const handleAddCollaborator = (id: string) => {
        console.log('Add collaborator to card:', id);
    };

    /* Switching the view type: can be a list or card form */
    const handleViewSwitch = () => {
        setViewType(viewType === 'card' ? 'list' : 'card');
    };

    /* Changing the current title */
    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    /* Gets the sorted option from the title bar */
    const handleSort = (option: string) => {
        if (!currentGroup) {
            return;
        }

        setCurrentGroup(current => ({
            ...current,
            cards: sortCards(current?.cards || [], option)
        }));

        setGroups(currentGroups =>
            currentGroups.map(group =>
                group.id === currentGroup.id ? {
                    ...group, cards: sortCards(
                        group.cards || [], option
                    )
                } : group
            )
        );
    };

    /* Add a new group to the existing list */
    const handleConfirmGroupCreation = async (name: string, description: string) => {
        /* Sign in required */
        if (isLoggedIn) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/collaboration/groups/create/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description
                    })
                });

                if (response.ok) {
                    const data = await response.json()
                    const newGroup: GroupInformation = {
                        id: data.id,
                        name: name,
                        description: description,
                        cards: []
                    };

                    setGroups(prevGroups => [...prevGroups, newGroup]);
                }
            } catch (error) {
                console.error('Unable to create group')
            }
        } else {
            /* No sign in required */
            const newGroup: GroupInformation = {
                id: Date.now(),
                name: name,
                description: description,
                cards: []
            };

            setGroups(prevGroups => [...prevGroups, newGroup]);
        }

    }

    /* Selecting the group and setting the state */
    const handleGroupSelection = (id: number) => {
        console.log('Group selection called with id:', id);
        const selectedGroup = groups.find(group => group.id === id);
        console.log('Selected group:', selectedGroup);
        setCurrentGroup(selectedGroup);
    }

    /* Render based on the view type variable */
    const renderChecklists = () => {
        if (viewType === 'list') {
            return (
                <div className='space-y-2 p-2 pt-4 overflow-auto'>
                    {currentGroup?.cards?.map((item, index) => (
                        <ListItem
                            key={index}
                            id={index.toString()}
                            title={item.title}
                            taskCount={item.taskCount}
                            completionPercentage={item.completionPercentage}
                            dateCreated={item.dateCreated}
                            dateModified={item.dateModified}
                            onCardClick={handleCardClick}
                            onEdit={handleChecklistItemEdit}
                            onDelete={handleDelete}
                            onAddCollaborator={handleAddCollaborator}
                        />
                    ))}
                </div>
            );
        }

        /* This one is card type selected */
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 sm:p-4 overflow-auto'>
                {currentGroup?.cards?.map((card, index) => (
                    <Card
                        key={index}
                        id={index.toString()}
                        title={card.title}
                        taskCount={card.taskCount}
                        completionPercentage={card.completionPercentage}
                        dateCreated={card.dateCreated}
                        dateModified={card.dateModified}
                        onCardClick={handleCardClick}
                        onEdit={handleChecklistItemEdit}
                        onDelete={handleDelete}
                        onAddCollaborator={handleAddCollaborator}
                    />
                ))}
            </div>
        );
    };

    /* Clears the form */
    const clearForm = () => {
        setTitle('');
        setDescription('');
    };

    /* Adds a checklist, or a workspace, if you prefer to call it that instead */
    const handleAddChecklist = (title: string, description: string) => {
        /* If the title is empty then we give a nice looking format of the
            date today as the title */
        const newTitle = title === '' ? new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : title;

        setDescription(description);

        /* Creating a new card/checklist item */
        const newCardItem: CardInformation = {
            /* Hard coding the ID for now */
            id: Date.now(),
            title: newTitle,
            dateCreated: new Date(),
            dateModified: new Date(),
            taskCount: 0,
            completionPercentage: 0,
            tasks: []
        }

        const updatedCurrentGroup: GroupInformation = {
            ...currentGroup,
            cards: [...currentGroup?.cards || [], newCardItem]
        }

        setCurrentGroup(updatedCurrentGroup);
        const updatedGroups = groups.map(group =>
            group.id === currentGroup?.id ? updatedCurrentGroup : group
        )
        setGroups(updatedGroups);
    }

    /* Handle card updates from the Workspace component */
    const handleUpdateCard = (updatedCard: CardInformation) => {
        /* Update the card in the current group */
        if (currentGroup && currentGroup.cards) {
            /* Create a new array of cards with the updated card */
            const updatedCards = currentGroup.cards.map(card =>
                card.id === updatedCard.id ? updatedCard : card
            );

            /* Update the current group with the new cards array */
            const updatedGroup = {
                ...currentGroup,
                cards: updatedCards
            };

            /* Set the current group to the updated group */
            setCurrentGroup(updatedGroup);

            /* Also update the group in the groups array */
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
        }
    };

    return (
        <div className='container mx-auto pt-12 pb-12 px-4'>
            <style>{`
        .auto-hide-scrollbar::-webkit-scrollbar {
          width: 6px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .auto-hide-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        
        .auto-hide-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--bc) / 0.2);
          border-radius: 10px;
        }
        
        .auto-hide-scrollbar:hover::-webkit-scrollbar-thumb {
          opacity: 1;
        }
        
        .auto-hide-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.2s;
        }
        
        .auto-hide-scrollbar:hover {
          scrollbar-color: hsl(var(--bc) / 0.2) transparent;
        }
      `}</style>
            <div className='flex h-[calc(100vh-6rem)] rounded-3xl bg-base-200'>
                <div className='flex-[0.25] min-w-[200px] bg-base-300 p-4 rounded-l-3xl overflow-hidden'>
                    <Sidebar groups={groups} onAddGroup={handleConfirmGroupCreation} onGroupSelect={handleGroupSelection} />
                </div>

                {/* Added relative positioning */}
                <div className='flex-[0.75] bg-base-200 p-4 rounded-xl overflow-hidden flex flex-col relative'>
                    {groups.length > 0 ? (
                        <>
                            <div className='w-full bg-base-200 pb-3'>
                                <Header
                                    name={currentGroup?.name || ''}
                                    viewType={viewType}
                                    onViewSwitch={handleViewSwitch}
                                    onSortSelection={handleSort}
                                />
                            </div>
                            <div className='flex-1 overflow-auto auto-hide-scrollbar'>
                                {renderChecklists()}
                            </div>
                            <Workspace
                                isOpen={isWorkspaceOpen}
                                onClose={handleWorkspaceClose}
                                card={selectedCard}
                                onUpdateCard={handleUpdateCard}
                            />
                        </>
                    ) : (
                        <div className='flex flex-cols h-full items-center justify-center'>
                            <EmptyState />
                        </div>
                    )}
                </div>

                {/* Modal to create a checklist card. */}
                <div className='relative'>
                    <dialog id='create_checklist_form' className='modal'>
                        <div className='modal-box max-w-sm md:max-w-md'>
                            <form method='dialog'>
                                <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
                            </form>
                            <h3 className='font-bold text-lg mb-6 text-center'>Create a new checklist</h3>
                            <div className='space-y-4 mb-8'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-base-content/70 px-2'>Name</label>
                                    <input
                                        type='text'
                                        placeholder='Enter your checklist name'
                                        className='input input-bordered w-full rounded-full bg-base-200 border-base-300 
                                                focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20'
                                        value={title}
                                        onChange={handleTitleChange}
                                    />
                                    <p className='text-xs text-base-content/50 px-2'>
                                        If no name is provided, today's date will be used
                                    </p>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-base-content/70 px-2'>Description</label>
                                    <textarea
                                        placeholder='Optional: Brief description of the checklist'
                                        className='textarea textarea-bordered w-full rounded-3xl bg-base-200 border-base-300 
                                            focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20 min-h-[120px] px-4'
                                    />
                                    <p className='text-xs text-base-content/50 px-2'>
                                        Keep it short - less than 80 characters
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-between gap-4'>
                                <form method='dialog'>
                                    <button className='px-4 py-2 bg-base-300 text-sm font-medium text-base-content/70 rounded-full
                                        transition-all duration-200 hover:bg-base-300/80 active:bg-base-300/60'>
                                        Cancel
                                    </button>
                                </form>
                                <form method='dialog'>
                                    <button
                                        className='px-4 py-2 bg-secondary text-sm font-medium text-secondary-content rounded-full
                                            transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60'
                                        onClick={() => {
                                            handleAddChecklist(title, description);
                                            clearForm();
                                            const dialog = document.getElementById('create_checklist_form') as HTMLDialogElement;
                                            dialog.close();
                                        }}
                                    >
                                        Create Checklist
                                    </button>
                                </form>
                            </div>
                        </div>
                        <form method='dialog' className='modal-backdrop'>
                            <button>Close</button>
                        </form>
                    </dialog>
                </div>

            </div>
        </div>
    );
};

export default Box;