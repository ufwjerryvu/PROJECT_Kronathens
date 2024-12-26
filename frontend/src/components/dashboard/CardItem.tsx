import React from 'react';

interface CardProps {
    id: string;
    title: string;
    dateCreated: Date;
    dateModified: Date;
    completionPercentage: number;
    taskCount: number;
    
    onCardClick: (id: string) => void;  // New handler for card click
    onEdit: (id: string) => void;       // Existing edit handler
    onDelete: (id: string) => void;
    onAddCollaborator: (id: string) => void;
}

const CardItem = ({
    id,
    title,
    dateCreated,
    dateModified,
    completionPercentage,
    taskCount,
    onCardClick,
    onEdit,
    onDelete,
    onAddCollaborator
}: CardProps) => {
    const handleCardClick = () => {
        onCardClick(id);
    };

    /* Edits the information of the card */ 
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        onEdit(id);
    };

    /* Delete the checklist item/card and everything related to it */
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        onDelete(id);
    };

    /* Add a collaborator */
    const handleAddCollaborator = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        onAddCollaborator(id);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div 
            className='card bg-base-100 hover:shadow-md transition-all duration-200 cursor-pointer min-w-0'
            onClick={handleCardClick}
        >
            <div className='card-body p-4'>
                <div className='space-y-3 min-w-0'>
                    <div className='flex items-start justify-between gap-2 min-w-0'>
                        <div className='flex flex-col min-w-0'>
                            <h3 className='card-title text-base font-medium truncate'>
                                {title}
                            </h3>
                            <div className='text-sm text-base-content/70 truncate'>
                                {taskCount} tasks • {completionPercentage}% complete
                            </div>
                        </div>

                        <div className='flex gap-1 shrink-0'>
                            <button
                                onClick={handleAddCollaborator}
                                className='btn btn-ghost btn-sm p-1 h-8 min-h-0 hover:bg-base-200'
                                aria-label='Add collaborator'
                            >
                                <i className='bi bi-person-plus text-base'></i>
                            </button>
                            <button
                                onClick={handleEdit}
                                className='btn btn-ghost btn-sm p-1 h-8 min-h-0 hover:bg-base-200'
                                aria-label='Edit card'
                            >
                                <i className='bi bi-pencil text-base'></i>
                            </button>
                            <button
                                onClick={handleDelete}
                                className='btn btn-ghost btn-sm p-1 h-8 min-h-0 hover:bg-base-200'
                                aria-label='Delete card'
                            >
                                <i className='bi bi-trash text-base'></i>
                            </button>
                        </div>
                    </div>

                    <div className='w-full bg-base-200 rounded-full h-2'>
                        <div
                            className='bg-secondary h-2 rounded-full transition-all duration-300'
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    <div className='flex justify-between text-xs text-base-content/50 pt-1'>
                        <div className='flex items-center gap-1'>
                            <i className='bi bi-calendar-plus text-xs'></i>
                            <span>{formatDate(dateCreated)}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <i className='bi bi-calendar-check text-xs'></i>
                            <span>{formatDate(dateModified)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardItem;