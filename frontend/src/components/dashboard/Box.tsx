import React, { useState } from 'react';
import Header from './Header.tsx';
import Card from './Card.tsx';
import ListItem from './ListItem.tsx';
import Sidebar from './Sidebar.tsx';

interface CardInformation {
  title: string,
  dateCreated: Date,
  dateModified: Date,
  completionPercentage: number,
  taskCount: number
};

const Box: React.FC = () => {
  type ViewType = 'card' | 'list';

  const [viewType, setViewType] = useState<ViewType>('card');

  const cards: CardInformation[] = [
    {
      title: 'Food & Drinks Planning',
      dateCreated: new Date('2024-11-15'),
      dateModified: new Date('2024-11-20'),
      completionPercentage: 40,
      taskCount: 6
    },
    {
      title: 'Venue Decoration',
      dateCreated: new Date('2024-11-10'),
      dateModified: new Date('2024-11-21'),
      completionPercentage: 25,
      taskCount: 8
    },
    {
      title: 'Guest List & Invitations',
      dateCreated: new Date('2024-11-12'),
      dateModified: new Date('2024-11-19'),
      completionPercentage: 75,
      taskCount: 4
    }
  ];

  const handleEdit = (id: string) => {
    console.log('Edit card:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete card:', id);
  };

  const handleAddCollaborator = (id: string) => {
    console.log('Add collaborator to card:', id);
  };

  const handleViewSwitch = () => {
    setViewType(viewType === 'card' ? 'list' : 'card');
  };

  const renderChecklists = () => {
    if (viewType === 'list') {
      return (
        <div className='space-y-2 p-2 pt-4 overflow-auto'>
          {cards.map((item, index) => (
            <ListItem
              key={index}
              id={index.toString()}
              title={item.title}
              taskCount={item.taskCount}
              completionPercentage={item.completionPercentage}
              dateCreated={item.dateCreated}
              dateModified={item.dateModified}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddCollaborator={handleAddCollaborator}
            />
          ))}
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 sm:p-4 overflow-auto'>
        {cards.map((card, index) => (
          <Card
            key={index}
            id={index.toString()}
            title={card.title}
            taskCount={card.taskCount}
            completionPercentage={card.completionPercentage}
            dateCreated={card.dateCreated}
            dateModified={card.dateModified}
            onEdit={handleEdit}
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
          <Sidebar/>
        </div>

        <div className='flex-[0.75] bg-base-200 p-4 rounded-xl overflow-hidden flex flex-col'>
          <Header name={'Office Christmas Barbecue'} viewType={viewType} onViewSwitch={handleViewSwitch}/>
          <div className='flex-1 overflow-auto auto-hide-scrollbar'>
            {renderChecklists()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Box;