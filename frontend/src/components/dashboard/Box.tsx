import React, { useState } from 'react';
import Header from './Header.tsx';
import Card from './Card.tsx';
import ListItem from './ListItem.tsx';

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
  ]

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
    if(viewType === 'card'){
      setViewType('list');
    }else if(viewType === 'list'){
      setViewType('card');
    }
  };

  const renderChecklists = () => {
    if (viewType === 'list') {

      return (
        <div className="space-y-2 p-2 pt-4 rounded-lg overflow-hidden">
          {
            cards.map((item, index) => (
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
      )
    } else if (viewType === 'card') {

      return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 sm:p-4 min-w-0'>
          {
            cards.map((card, index) => (
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
            ))
          }
        </div>
      )
    }
  };

  return (
    <>
      <div className='container pt-12 pb-12'>
        <div className='flex h-[100vh] rounded-3xl h-96 bg-base-200'>
          <ul className='menu bg-base-300 w-56 w-1/5 p-4 rounded-l-3xl'>

          </ul>

          <div className='w-4/5 bg-base-200 p-4 rounded-xl'>
            <Header name={'Office Christmas Barbecue'} viewType={viewType} onViewSwitch={handleViewSwitch}/>
            {renderChecklists()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Box;