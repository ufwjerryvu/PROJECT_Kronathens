import React from 'react';

interface ListItemProps {
  id: string;
  title: string;
  taskCount: number;
  completionPercentage: number;
  dateCreated: Date;
  dateModified: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddCollaborator: (id: string) => void;
}

const ListItem = ({ 
  id,
  title, 
  taskCount, 
  completionPercentage,
  dateCreated,
  dateModified,
  onEdit,
  onDelete,
  onAddCollaborator,
}: ListItemProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleAddCollaborator = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      className="flex items-center w-full bg-base-100 hover:bg-base-200/50 active:bg-base-200 px-6 py-4 rounded-2xl hover:shadow-md active:shadow-sm transition-all duration-200 cursor-pointer select-none"
      role="button"
      tabIndex={0}
    >

      <div className="flex-1 min-w-0 mr-4">
        <h3 className="font-medium truncate">{title}</h3>
        <div className="hidden md:block text-sm text-base-content/70">
          {taskCount} tasks • {completionPercentage}% complete
        </div>
      </div>

      <div className="w-20 md:w-48 bg-base-200 rounded-full h-2 mr-4">
        <div 
          className="bg-secondary h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <div className="hidden md:flex flex-col text-xs text-base-content/50 items-end mr-4 shrink-0">
        <div className="flex items-center gap-1">
          <i className="bi bi-calendar-plus text-xs"></i>
          <span>{formatDate(dateCreated)}</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="bi bi-calendar-check text-xs"></i>
          <span>{formatDate(dateModified)}</span>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button 
          onClick={handleAddCollaborator}
          className="btn btn-ghost btn-sm p-1 h-8 min-h-0 hover:bg-base-200 rounded-xl"
          aria-label="Add collaborator"
        >
          <i className="bi bi-person-plus text-base"></i>
        </button>
        <button 
          onClick={handleEdit}
          className="btn btn-ghost btn-sm p-1 h-8 min-h-0 hover:bg-base-200 rounded-xl"
          aria-label="Edit item"
        >
          <i className="bi bi-pencil text-base"></i>
        </button>
        <button 
          onClick={handleDelete}
          className="btn btn-ghost btn-sm p-1 h-8 min-h-0 hover:bg-base-200 rounded-xl"
          aria-label="Delete item"
        >
          <i className="bi bi-trash text-base"></i>
        </button>
      </div>
    </div>
  );
};

export default ListItem;