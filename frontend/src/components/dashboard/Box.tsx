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
      title: 'Event Marketing',
      dateCreated: new Date('2024-11-14'),
      dateModified: new Date('2024-11-18'),
      completionPercentage: 30,
      taskCount: 5
    },
    {
      title: 'Entertainment & Activities',
      dateCreated: new Date('2024-11-08'),
      dateModified: new Date('2024-11-22'),
      completionPercentage: 50,
      taskCount: 7
    },
    {
      title: 'Transportation & Logistics',
      dateCreated: new Date('2024-11-05'),
      dateModified: new Date('2024-11-20'),
      completionPercentage: 60,
      taskCount: 9
    },
    {
      title: 'Event Photography & Videography',
      dateCreated: new Date('2024-11-07'),
      dateModified: new Date('2024-11-21'),
      completionPercentage: 80,
      taskCount: 3
    },
    {
      title: 'Security & Safety Measures',
      dateCreated: new Date('2024-11-09'),
      dateModified: new Date('2024-11-23'),
      completionPercentage: 20,
      taskCount: 6
    },
    {
      title: 'Event Registration & Ticketing',
      dateCreated: new Date('2024-11-10'),
      dateModified: new Date('2024-11-19'),
      completionPercentage: 90,
      taskCount: 4
    },
    {
      title: 'Audio/Visual Setup',
      dateCreated: new Date('2024-11-06'),
      dateModified: new Date('2024-11-17'),
      completionPercentage: 65,
      taskCount: 5
    },
    {
      title: 'Sponsorships & Partnerships',
      dateCreated: new Date('2024-11-03'),
      dateModified: new Date('2024-11-20'),
      completionPercentage: 45,
      taskCount: 6
    },
    {
      title: 'Budget Management',
      dateCreated: new Date('2024-11-04'),
      dateModified: new Date('2024-11-21'),
      completionPercentage: 55,
      taskCount: 5
    },
    {
      title: 'Staffing & Volunteers',
      dateCreated: new Date('2024-11-02'),
      dateModified: new Date('2024-11-19'),
      completionPercentage: 70,
      taskCount: 8
    },
    {
      title: 'Event Schedule Creation',
      dateCreated: new Date('2024-11-11'),
      dateModified: new Date('2024-11-22'),
      completionPercentage: 30,
      taskCount: 4
    },
    {
      title: 'Event Branding & Signage',
      dateCreated: new Date('2024-11-16'),
      dateModified: new Date('2024-11-22'),
      completionPercentage: 50,
      taskCount: 7
    },
    {
      title: 'Transportation Coordination for Guests',
      dateCreated: new Date('2024-11-17'),
      dateModified: new Date('2024-11-21'),
      completionPercentage: 60,
      taskCount: 3
    },
    {
      title: 'Post-Event Survey & Feedback',
      dateCreated: new Date('2024-11-13'),
      dateModified: new Date('2024-11-19'),
      completionPercentage: 85,
      taskCount: 2
    },
    {
      title: 'Clean-Up Crew Coordination',
      dateCreated: new Date('2024-11-01'),
      dateModified: new Date('2024-11-20'),
      completionPercentage: 40,
      taskCount: 6
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
          <div className='w-full bg-base-200 pb-3'>
            <Header name={'Office Christmas Barbecue'} viewType={viewType} onViewSwitch={handleViewSwitch}/>
          </div>
          <div className='flex-1 overflow-auto auto-hide-scrollbar'>
            {renderChecklists()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Box;