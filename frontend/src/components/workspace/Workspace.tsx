import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';

import { Task } from '../../interfaces/workspace/Task.tsx';
import { CardInformation } from '../../interfaces/dashboard/CardInformation';

/* Props interface defining the workspace component's configuration options */
interface WorkspaceProps {
    isOpen: boolean;
    onClose: () => void;
    card: CardInformation | null;
}

/* Main workspace component for managing task tasks and individual tasks with progress tracking */
const Workspace = ({ isOpen, onClose, card }: WorkspaceProps) => {
    /* Stores all task tasks and their subtasks */
    const [tasks, setTasks] = useState<Task[]>([]);

    /* Tracks currently edited item's ID */
    const [editingId, setEditingId] = useState<string | null>(null);

    /* Temporary storage for item being edited */
    const [newName, setNewName] = useState('');

    /* Reference for auto-focusing input fields */
    const inputRef = useRef<HTMLInputElement>(null);

    /* Toggles completion status of a specific task within a Task */
    const toggleTask = (TaskId: string, taskId: string) => {
        setTasks(tasks.map(Task =>
            Task.id === TaskId
                ? {
                    ...Task,
                    tasks: Task.tasks.map(task =>
                        task.id === taskId
                            ? { ...task, completed: !task.completed }
                            : task
                    )
                }
                : Task
        ));
    };

    /* Creates a new empty task Task and enters edit mode */
    const addTask = () => {
        const id = Date.now().toString();
        const newTask: Task = {
            id,
            name: '',
            tasks: []
        };
        setTasks([...tasks, newTask]);
        setEditingId(id);
        setNewName('');
    };

    /* Adds a new task to specified Task and enters edit mode */
    const addItem = (TaskId: string) => {
        const id = Date.now().toString();
        setTasks(tasks.map(Task =>
            Task.id === TaskId
                ? {
                    ...Task,
                    tasks: [...Task.tasks, {
                        id,
                        text: '',
                        completed: false,
                        weight: 1
                    }]
                }
                : Task
        ));
        setEditingId(id);
        setNewName('');
    };

    /* Removes specified Task and all its tasks */
    const removeTask = (TaskId: string) => {
        setTasks(tasks.filter(Task => Task.id !== TaskId));
    };

    /* Removes a specific task from its parent Task */
    const removeItem = (TaskId: string, taskId: string) => {
        setTasks(tasks.map(Task =>
            Task.id === TaskId
                ? {
                    ...Task,
                    tasks: Task.tasks.filter(task => task.id !== taskId)
                }
                : Task
        ));
    };

    /* Initiates edit mode for a Task or task */
    const startEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setNewName(currentName);
    };

    /* Updates the newName state as user types in edit field */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    /* Saves current edit and creates new item - used for quick sequential additions */
    const saveCurrentAndAddNew = (editId: string, text: string) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(Task => {
                if (Task.id === editId) {
                    return { ...Task, name: text || 'New Task' };
                }
                return {
                    ...Task,
                    tasks: Task.tasks.map(task =>
                        task.id === editId
                            ? { ...task, text: text || 'New Item' }
                            : task
                    )
                };
            });

            /* Check if editing task within Task or Task itself */
            const Task = updatedTasks.find(g => g.tasks.some(t => t.id === editId));

            if (Task) {
                const newId = Date.now().toString();
                return updatedTasks.map(g =>
                    g.id === Task.id
                        ? {
                            ...g,
                            tasks: [...g.tasks, { id: newId, text: '', completed: false, weight: 1 }]
                        }
                        : g
                );
            }

            const newId = Date.now().toString();
            return [...updatedTasks, { id: newId, name: '', tasks: [] }];
        });

        setTimeout(() => {
            const newId = Date.now().toString();
            setEditingId(newId);
            setNewName('');
        }, 0);
    };

    /* Handles keyboard events for saving and creating new items */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && editingId) {
            e.preventDefault();
            saveCurrentAndAddNew(editingId, newName.trim());
        } else if (e.key === 'Enter' && editingId) {
            e.preventDefault();
            const currentValue = newName.trim();
            const newId = Date.now().toString();

            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(Task => {
                    if (Task.id === editingId) {
                        return { ...Task, name: currentValue || 'New Task' };
                    }
                    return {
                        ...Task,
                        tasks: Task.tasks.map(task =>
                            task.id === editingId
                                ? { ...task, text: currentValue || 'New Item' }
                                : task
                        )
                    };
                });

                const Task = updatedTasks.find(g => g.tasks.some(t => t.id === editingId));

                if (Task) {
                    return updatedTasks.map(g =>
                        g.id === Task.id
                            ? {
                                ...g,
                                tasks: [...g.tasks, { id: newId, text: '', completed: false, weight: 1 }]
                            }
                            : g
                    );
                }

                return [...updatedTasks, { id: newId, name: '', tasks: [] }];
            });

            setEditingId(newId);
            setNewName('');
        }
    };

    /* Saves current edit when input loses focus */
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!editingId) return;

        const value = newName.trim();
        setTasks(tasks.map(Task => {
            if (Task.id === editingId) {
                return { ...Task, name: value || 'New Task' };
            }
            return {
                ...Task,
                tasks: Task.tasks.map(task =>
                    task.id === editingId
                        ? { ...task, text: value || 'New Item' }
                        : task
                )
            };
        }));

        setEditingId(null);
        setNewName('');
    };

    /* Auto-focus input field when entering edit mode */
    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    /* Calculate completion statistics based on task weights */
    const totalWeight = tasks.reduce((acc, Task) =>
        acc + Task.tasks.reduce((sum, task) => sum + task.weight, 0), 0);
    const completedWeight = tasks.reduce((acc, Task) =>
        acc + Task.tasks.filter(t => t.completed).reduce((sum, task) => sum + task.weight, 0), 0);
    const completionPercentage = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;

    return (
        <div
            className={`absolute inset-0 bg-base-200 rounded-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Header section with back button and title */}
                <div className="p-4 border-b border-base-300">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm gap-2 text-sm"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-xl font-medium hidden sm:inline">{card?.title}</span>
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Progress bar section */}
                        <div className="pb-6 border-b-2 border-base-300 mb-6">
                            <div className="text-xs text-base-content/70">
                                Progress: {completedWeight}/{totalWeight} completed
                            </div>
                            <div className="mt-2 w-full bg-blue-100 rounded-full h-1.5">
                                <div
                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <div className="text-xs mt-1">{completionPercentage}% Complete</div>
                        </div>

                        {/* Task tasks section */}
                        <div className="space-y-4">
                            {tasks.map(Task => (
                                <div key={Task.id} className="space-y-2">
                                    {/* Task header with edit/remove controls */}
                                    <div className="flex items-center justify-between pl-2 mb-2">
                                        {editingId === Task.id ? (
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={newName}
                                                placeholder="Enter task name"
                                                onChange={handleNameChange}
                                                onBlur={handleBlur}
                                                onKeyDown={handleKeyDown}
                                                className="w-full text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                                            />
                                        ) : (
                                            <div
                                                className="text-lg font-medium cursor-pointer break-words"
                                                onClick={() => startEdit(Task.id, Task.name)}
                                            >
                                                {Task.name}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeTask(Task.id)}
                                            className="p-1 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Tasks list with completion toggles and weight controls */}
                                    {Task.tasks.map(task => (
                                        <div
                                            key={task.id}
                                            className="group"
                                        >
                                            <div className="flex flex-wrap items-center gap-2 py-0 pl-5">
                                                <div
                                                    className={`w-5 h-5 rounded-full cursor-pointer ${task.completed
                                                            ? 'bg-green-500'
                                                            : 'border-2 border-base-300'
                                                        } flex items-center justify-center transition-colors duration-200`}
                                                    onClick={() => toggleTask(Task.id, task.id)}
                                                >
                                                    {task.completed && (
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {editingId === task.id ? (
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={newName}
                                                        placeholder="Enter task name"
                                                        onChange={handleNameChange}
                                                        onBlur={handleBlur}
                                                        onKeyDown={handleKeyDown}
                                                        className="flex-1 min-w-0 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
                                                    />
                                                ) : (
                                                    <span
                                                        className={`flex-1 min-w-0 text-sm cursor-pointer break-all ${task.completed
                                                                ? 'line-through text-base-content/50'
                                                                : ''
                                                            } transition-all duration-200`}
                                                        onClick={() => startEdit(task.id, task.text)}
                                                    >
                                                        {task.text}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setTasks(tasks.map(g =>
                                                            g.id === Task.id
                                                                ? {
                                                                    ...g,
                                                                    tasks: g.tasks.map(t =>
                                                                        t.id === task.id
                                                                            ? { ...t, weight: Math.max(0, t.weight - 1) }
                                                                            : t
                                                                    )
                                                                }
                                                                : g
                                                        ))}
                                                        className="p-1 hover:bg-base-300/20 rounded"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs w-6 text-center">{task.weight}</span>
                                                    <button
                                                        onClick={() => setTasks(tasks.map(g =>
                                                            g.id === Task.id
                                                                ? {
                                                                    ...g,
                                                                    tasks: g.tasks.map(t =>
                                                                        t.id === task.id
                                                                            ? { ...t, weight: t.weight + 1 }
                                                                            : t
                                                                    )
                                                                }
                                                                : g
                                                        ))}
                                                        className="p-1 hover:bg-base-300/20 rounded"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(Task.id, task.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add new task button */}
                                    <button
                                        onClick={() => addItem(Task.id)}
                                        className="w-full text-left py-1.5 pl-16 text-xs text-base-content/50 hover:bg-base-300/20 rounded-lg"
                                    >
                                        + Add item
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add new Task button */}
                        <button
                            onClick={addTask}
                            className="w-full text-left py-1.5 pl-2 text-xs text-base-content/50 hover:bg-base-300/20 rounded-lg"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;