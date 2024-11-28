import React, { useEffect, useState } from 'react';
import Header from './Header.tsx';
import Card from './CardItem.tsx';
import ListItem from './ListItem.tsx';
import Sidebar from './Sidebar.tsx';
import EmptyState from './EmptyState.tsx';

import { GroupInformation } from '../../interfaces/dashboard/GroupInformation.ts';
// import { CardInformation } from '../../interfaces/dashboard/CardInformation.ts';

const Box: React.FC = () => {
    type ViewType = 'card' | 'list';
    
    /* Set box view type either as card or list for now, might add more later. Who knows? */
    const [viewType, setViewType] = useState<ViewType>('card');
    
    /* Groups will happen to store card/list items and their meta information */
    const [groups, setGroups] = useState<GroupInformation[]>([]);
    const [currentGroup, setCurrentGroup] = useState<GroupInformation>();

    /* On mount, pick the first group */
    useEffect(() => {
        const FIRST = 0;
        if(groups.length > 0){
            setCurrentGroup(groups[FIRST]);
        }
    }, [])

    /* Edit the card */
    const handleChecklistItemEdit = (id: string) => {
        console.log('Edit card:', id);
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

    /* Add a new group to the existing list */
    const handleConfirmGroupCreation = (name: string, description: string) => {
        const newGroup : GroupInformation = {
            id: Date.now().toString(),
            name: name,
            description: description,
            cards: []
        };

        setGroups(prevGroups => [...prevGroups, newGroup]);
    }

    /* Selecting the group and setting the state */
    const handleGroupSelection = (id: string) => {
        const selectedGroup = groups.find(group => group.id === id);
        setCurrentGroup(selectedGroup);
    }

    /* Render based on the view type variable */
    const renderChecklists = () => {
        if (viewType === 'list') {
            return (
                <div className='space-y-2 p-2 pt-4 overflow-auto'>
                    {currentGroup?.cards.map((item, index) => (
                        <ListItem
                            key={index}
                            id={index.toString()}
                            title={item.title}
                            taskCount={item.taskCount}
                            completionPercentage={item.completionPercentage}
                            dateCreated={item.dateCreated}
                            dateModified={item.dateModified}
                            onEdit={handleChecklistItemEdit}
                            onDelete={handleDelete}
                            onAddCollaborator={handleAddCollaborator}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 sm:p-4 overflow-auto'>
                {currentGroup?.cards.map((card, index) => (
                    <Card
                        key={index}
                        id={index.toString()}
                        title={card.title}
                        taskCount={card.taskCount}
                        completionPercentage={card.completionPercentage}
                        dateCreated={card.dateCreated}
                        dateModified={card.dateModified}
                        onEdit={handleChecklistItemEdit}
                        onDelete={handleDelete}
                        onAddCollaborator={handleAddCollaborator}
                    />
                ))}
            </div>
        );
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
                    <Sidebar groups={groups} onAddGroup={handleConfirmGroupCreation} onGroupSelect={handleGroupSelection}/>
                </div>

                <div className='flex-[0.75] bg-base-200 p-4 rounded-xl overflow-hidden flex flex-col'>
                    {groups.length > 0 ? (
                        <div>
                            <div className='w-full bg-base-200 pb-3'>
                                <Header name={currentGroup?.name || ''} viewType={viewType} onViewSwitch={handleViewSwitch} />
                            </div>
                            <div className='flex-1 overflow-auto auto-hide-scrollbar'>
                                {renderChecklists()}
                            </div>
                        </div>) : (
                        <div className='flex flex-cols h-full items-center justify-center'>
                            <EmptyState />
                        </div>)}
                </div>
            </div>
        </div>
    );
};

export default Box;