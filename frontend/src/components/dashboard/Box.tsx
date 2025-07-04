import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    /* Card to delete confirmation */
    const [cardToDeleteId, setCardToDeleteId] = useState<string>('');

    useEffect(() => {
        const fetchAllGroups = async () => {
            await new Promise(resolve => setTimeout(resolve, 0));

            try {
                /* GET method */
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/collaboration/groups/all/`);

                const data = response.data;

                const mappedGroups: GroupInformation[] = data.map((group: any) => ({
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    cards: []
                }))

                setGroups(mappedGroups);
            } catch (error) {
                console.error("Cannot load groups/collections.")
            }
        }

        if (isLoggedIn) {
            fetchAllGroups();
        }
    }, [isLoggedIn])

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
        setCardToDeleteId(id);
        const modal = document.getElementById('delete_card_confirmation_form') as HTMLDialogElement;
        modal?.showModal();
    };

    /* Confirm deletion */
    const handleConfirmDelete = async () => {
        if (!currentGroup?.cards || !cardToDeleteId) return;
        
        const cardIndex = parseInt(cardToDeleteId);
        const card = currentGroup.cards[cardIndex];
        
        if (!card) return;
        
        if (isLoggedIn) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/checklists/workspace/delete/${card.id}/`);
            } catch (error) {
                console.error('Unable to delete card');
                return;
            }
        }
        
        // Remove card from current group
        const updatedCards = currentGroup.cards.filter((_, index) => index !== cardIndex);
        const updatedGroup = { ...currentGroup, cards: updatedCards };
        
        setCurrentGroup(updatedGroup);
        setGroups(prevGroups =>
            prevGroups.map(group =>
                group.id === currentGroup.id ? updatedGroup : group
            )
        );
        
        setCardToDeleteId('');
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
                /* POST method */
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/collaboration/groups/create/`, {
                    name: name,
                    description: description
                });

                const data = response.data;

                const newGroup: GroupInformation = {
                    id: data.id,
                    name: name,
                    description: description,
                    cards: []
                };

                setGroups(prevGroups => [...prevGroups, newGroup]);
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
    const handleGroupSelection = async (id: number) => {
        const selectedGroup = groups.find(group => group.id === id);
        if (!selectedGroup) return;

        setCurrentGroup(selectedGroup);
        setIsSidebarOpen(false);

        if (isLoggedIn) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/checklists/workspace/all/${selectedGroup.id}`);

                /* Map API response to CardInformation interface and calculate progress */
                const mappedCards: CardInformation[] = await Promise.all(
                    (response.data || []).map(async (apiCard: any) => {
                        try {
                            /* Fetch tasks for this workspace */
                            const tasksResponse = await axios.get(`${process.env.REACT_APP_API_URL}/checklists/workspace/item/all/${apiCard.id}/`);
                            
                            /* Fetch subtasks for each task and calculate progress */
                            let totalWeight = 0;
                            let completedWeight = 0;
                            let taskCount = 0;

                            const tasksWithSubtasks = await Promise.all(
                                tasksResponse.data.map(async (task: any) => {
                                    try {
                                        const subtasksResponse = await axios.get(`${process.env.REACT_APP_API_URL}/checklists/workspace/subitem/all/${task.id}/`);
                                        
                                        /* Calculate progress for this task */
                                        subtasksResponse.data.forEach((subtask: any) => {
                                            const weight = subtask.weight || 1;
                                            totalWeight += weight;
                                            if (subtask.completion_status) {
                                                completedWeight += weight;
                                            }
                                            taskCount++;
                                        });

                                        return {
                                            id: task.id.toString(),
                                            name: task.heading || 'Untitled Task',
                                            tasks: subtasksResponse.data.map((subtask: any) => ({
                                                id: subtask.id.toString(),
                                                text: subtask.content || 'Untitled Item',
                                                completed: subtask.completion_status || false,
                                                weight: subtask.weight || 1
                                            }))
                                        };
                                    } catch (error) {
                                        console.error(`Failed to fetch subtasks for task ${task.id}:`, error);
                                        return {
                                            id: task.id.toString(),
                                            name: task.heading || 'Untitled Task',
                                            tasks: []
                                        };
                                    }
                                })
                            );

                            /* Calculate completion percentage */
                            const completionPercentage = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;

                            return {
                                id: apiCard.id,
                                title: apiCard.name || apiCard.title || 'Untitled',
                                dateCreated: apiCard.dateCreated ? new Date(apiCard.dateCreated) : new Date(),
                                dateModified: apiCard.dateModified ? new Date(apiCard.dateModified) : new Date(),
                                completionPercentage: completionPercentage,
                                taskCount: taskCount,
                                tasks: tasksWithSubtasks
                            };
                        } catch (error) {
                            console.error(`Failed to fetch tasks for workspace ${apiCard.id}:`, error);
                            /* Fallback to basic card info if task fetching fails */
                            return {
                                id: apiCard.id,
                                title: apiCard.name || apiCard.title || 'Untitled',
                                dateCreated: apiCard.dateCreated ? new Date(apiCard.dateCreated) : new Date(),
                                dateModified: apiCard.dateModified ? new Date(apiCard.dateModified) : new Date(),
                                completionPercentage: 0,
                                taskCount: 0,
                                tasks: []
                            };
                        }
                    })
                );

                /* Update the selected group with mapped cards */
                const updatedGroup = {
                    ...selectedGroup,
                    cards: mappedCards
                };

                /* Update current group state */
                setCurrentGroup(updatedGroup);

                /* Update the group in the groups array as well */
                setGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.id === selectedGroup.id ? updatedGroup : group
                    )
                );
            } catch (error) {
                console.error('Failed to fetch group cards:', error);
            }
        }
    };

    const handleGroupEditing = (id: number) => {

    }

    /* Deletes a group but divides into two modes logged in and not */
    const handleGroupDeletion = async (id: number) => {
        console.log('Group confirmed to delete: ', id);

        if (isLoggedIn) {
            try {
                /* DELETE method */
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/collaboration/groups/delete/${id}/`);

            } catch (error) {
                console.error('Unable to delete group');
            }
        }

        setGroups(groups.filter(group => group.id !== id));
    }

    /* Render based on the view type variable */
    const renderChecklists = () => {
        if (viewType === 'list') {
            return (
                <div className='space-y-2 p-2 sm:p-4 pt-4 overflow-auto'>
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
            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-2 sm:p-4 overflow-auto'>
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
    const handleAddChecklist = async (title: string, description: string) => {
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

        if (isLoggedIn) {
            try {
                /* POST method */
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/checklists/workspace/create/${currentGroup.id}/`, {
                    name: newCardItem.title,
                    description: description === '' ? "Placeholder" : description
                });
            } catch (error) {
                console.log(error.response?.data)
            }
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
        <div className='container mx-auto min-h-screen px-2 sm:px-4 pt-4 sm:pt-12 pb-4 sm:pb-12'>
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

            <div className='flex flex-col md:flex-row h-[calc(100vh-2rem)] sm:h-[calc(100vh-6rem)] rounded-2xl sm:rounded-3xl bg-base-200 overflow-hidden'>

                {/* Mobile sidebar overlay */}
                <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsSidebarOpen(false)} />

                {/* Sidebar */}
                <div className={`
                    fixed md:relative top-16 md:top-auto bottom-0 md:bottom-auto left-0 z-40 md:z-auto
                    w-full md:w-auto md:flex-[0_0_280px] lg:flex-[0_0_320px]
                    bg-base-300 transform transition-transform duration-300 md:transform-none
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    md:rounded-l-3xl overflow-hidden
                `}>
                    <div className='h-full p-3 sm:p-4'>
                        <Sidebar
                            groups={groups}
                            onAddGroup={handleConfirmGroupCreation}
                            onGroupSelect={handleGroupSelection}
                            onDeleteGroup={handleGroupDeletion}
                            onEditGroup={handleGroupEditing}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>

                {/* Main content area */}
                <div className='flex-1 bg-base-200 overflow-hidden flex flex-col relative'>
                    {groups.length > 0 ? (
                        <>
                            <div className='w-full bg-base-200 p-3 sm:p-4 border-b border-base-300 md:border-none'>
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
                        <div className='flex flex-col h-full items-center justify-center p-4'>
                            <EmptyState />
                        </div>
                    )}
                </div>

                {/* Mobile hamburger button - bottom left */}
                {!isSidebarOpen && (
                    <button
                        className='fixed bottom-6 left-6 md:hidden w-12 h-12 rounded-full bg-base-300 text-base-content/70 hover:bg-base-300/80 active:bg-base-300/60 transition-colors shadow-lg z-30 flex items-center justify-center'
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <i className='bi bi-list text-xl' />
                    </button>
                )}

                {/* Create checklist FAB for mobile - only show when group is selected */}
                {currentGroup && (
                    <button
                        className='fixed bottom-6 right-6 md:hidden w-14 h-14 bg-secondary text-secondary-content rounded-full shadow-lg flex items-center justify-center z-30 active:scale-95 transition-transform'
                        onClick={() => {
                            const dialog = document.getElementById('create_checklist_form') as HTMLDialogElement;
                            dialog?.showModal();
                        }}
                    >
                        <i className='bi bi-plus-lg text-xl' />
                    </button>
                )}

                {/* Modal to create a checklist card. */}
                <div className='relative'>
                    <dialog id='create_checklist_form' className='modal'>
                        <div className='modal-box w-11/12 max-w-sm sm:max-w-md mx-4'>
                            <form method='dialog'>
                                <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 w-8 h-8 min-h-8'>✕</button>
                            </form>
                            <h3 className='font-bold text-lg mb-6 text-center'>Create a new checklist</h3>
                            <div className='space-y-4 mb-8'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-base-content/70 px-2'>Name</label>
                                    <input
                                        type='text'
                                        placeholder='Enter your checklist name'
                                        className='input input-bordered w-full rounded-full bg-base-200 border-base-300 
                                                focus:border-secondary/30 focus:ring-2 focus:ring-secondary/20 h-12'
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
                            <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
                                <form method='dialog' className='order-2 sm:order-1'>
                                    <button className='py-2 px-4 bg-base-300 text-sm font-medium text-base-content/70 rounded-full
                                        transition-all duration-200 hover:bg-base-300/80 active:bg-base-300/60'>
                                        Cancel
                                    </button>
                                </form>
                                <form method='dialog' className='order-1 sm:order-2'>
                                    <button
                                        className='py-2 px-4 bg-secondary text-sm font-medium text-secondary-content rounded-full
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

                {/* Delete card confirmation modal */}
                <dialog id='delete_card_confirmation_form' className='modal'>
                    <div className='modal-box max-w-sm md:max-w-md'>
                        <form method='dialog'>
                            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
                        </form>

                        <h3 className="flex justify-center py-8">Are you sure you want to delete this checklist?</h3>

                        <div className='flex justify-center gap-4'>
                            <form method='dialog'>
                                <button
                                    className='px-4 py-2 bg-red-700 text-sm font-medium text-white rounded-full
                                            transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60'
                                    onClick={() => {
                                        handleConfirmDelete();
                                        setCardToDeleteId('');
                                    }}
                                >
                                    Delete
                                </button>
                            </form>

                            <form method='dialog'>
                                <button 
                                    className='px-4 py-2 bg-base-300 text-sm font-medium text-base-content/70 rounded-full
                                             transition-all duration-200 hover:bg-base-300/80 active:bg-base-300/60'
                                    onClick={() => {
                                        setCardToDeleteId('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>

                        <form method='dialog' className='modal-backdrop'>
                            <button>Close</button>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default Box;