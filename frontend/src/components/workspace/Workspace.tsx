import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import axios from 'axios';

import { Task } from '../../interfaces/workspace/Task';
import { CardInformation } from '../../interfaces/dashboard/CardInformation';
import { useAuth } from '../../services/authentication/AuthContext';

interface WorkspaceProps {
    isOpen: boolean;
    onClose: () => void;
    card: CardInformation | null;
    onUpdateCard?: (updatedCard: CardInformation) => void;
}

const Workspace = ({ isOpen, onClose, card, onUpdateCard }: WorkspaceProps) => {
    const { isLoggedIn } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingUpdates, setPendingUpdates] = useState<Map<string, any>>(new Map());
    const inputRef = useRef<HTMLInputElement>(null);
    const prevCardRef = useRef<CardInformation | null>(null);
    const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    /* Debounced API update function */
    const debouncedUpdate = useCallback((key: string, updateFn: () => Promise<void>) => {
        if (!isLoggedIn) return;
        
        /* Clear existing timer for this key */
        const existingTimer = debounceTimers.current.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        /* Set new timer */
        const timer = setTimeout(async () => {
            try {
                await updateFn();
                debounceTimers.current.delete(key);
            } catch (error) {
                console.error('Failed to update:', error);
            }
        }, 500);

        debounceTimers.current.set(key, timer);
    }, [isLoggedIn]);

    /* Fetch all tasks for workspace */
    const fetchTasks = async () => {
        if (!card || !isLoggedIn) {
            /* For non-logged in users, use card tasks if available */
            if (card && card.tasks) {
                setTasks(card.tasks);
            }
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/checklists/workspace/item/all/${card.id}/`);
            
            /* Fetch subtasks for each task */
            const tasksWithSubtasks = await Promise.all(
                response.data.map(async (task: any) => {
                    try {
                        const subtasksResponse = await axios.get(`${process.env.REACT_APP_API_URL}/checklists/workspace/subitem/all/${task.id}/`);
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

            setTasks(tasksWithSubtasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            /* Keep existing card tasks on API failure instead of clearing */
        } finally {
            setIsLoading(false);
        }
    };

    /* Create new task */
    const createTask = async (heading: string) => {
        if (!card || !isLoggedIn) return null;
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/checklists/workspace/item/create/${card.id}/`, {
                heading: heading
            });
            return response.data.id.toString();
        } catch (error) {
            console.error('Failed to create task:', error);
            return null;
        }
    };

    /* Update task */
    const updateTask = async (taskId: string, heading: string) => {
        if (!isLoggedIn) return;
        
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/checklists/workspace/item/update/${taskId}/`, {
                heading: heading
            });
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    /* Delete task */
    const deleteTask = async (taskId: string) => {
        if (!isLoggedIn) return;
        
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/checklists/workspace/item/delete/${taskId}/`);
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    /* Create new subtask */
    const createSubtask = async (taskId: string, content: string, weight: number = 1) => {
        if (!isLoggedIn) return null;
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/checklists/workspace/subitem/create/${taskId}/`, {
                content: content,
                weight: weight,
                completion_status: false
            });
            return response.data.id.toString();
        } catch (error) {
            console.error('Failed to create subtask:', error);
            return null;
        }
    };

    /* Update subtask */
    const updateSubtask = async (subtaskId: string, data: any) => {
        if (!isLoggedIn) return;
        
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/checklists/workspace/subitem/update/${subtaskId}/`, data);
        } catch (error) {
            console.error('Failed to update subtask:', error);
        }
    };

    /* Delete subtask */
    const deleteSubtask = async (subtaskId: string) => {
        if (!isLoggedIn) return;
        
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/checklists/workspace/subitem/delete/${subtaskId}/`);
        } catch (error) {
            console.error('Failed to delete subtask:', error);
        }
    };
    /* Fetch tasks when card changes */
    useEffect(() => {
        if (card) {
            /* Initialize with existing card tasks to prevent flickering */
            if (card.tasks && card.tasks.length > 0) {
                setTasks(card.tasks);
            }
            
            fetchTasks();
            /* Reset editing states */
            setEditingId(null);
            setNewName('');
        } else {
            setTasks([]);
        }
    }, [card]);

    /* Update card when tasks change */
    useEffect(() => {
        if (card && onUpdateCard) {
            /* Calculate new completion percentage */
            const totalWeight = tasks.reduce((acc, task) =>
                acc + task.tasks.reduce((sum, subtask) => sum + subtask.weight, 0), 0);
            const completedWeight = tasks.reduce((acc, task) =>
                acc + task.tasks.filter(t => t.completed).reduce((sum, subtask) => sum + subtask.weight, 0), 0);
            const completionPercentage = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;

            /* Count total tasks */
            const taskCount = tasks.reduce((acc, task) => acc + task.tasks.length, 0);

            /* Create updated card */
            const updatedCard: CardInformation = {
                ...card,
                tasks: tasks,
                completionPercentage: completionPercentage,
                taskCount: taskCount,
                dateModified: new Date()
            };

            onUpdateCard(updatedCard);
        }
    }, [tasks, card, onUpdateCard]);

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

        /* Debounced update to API */
        const task = tasks.find(t => t.id === TaskId)?.tasks.find(st => st.id === taskId);
        if (task) {
            debouncedUpdate(`subtask-${taskId}`, () => 
                updateSubtask(taskId, { completion_status: !task.completed })
            );
        }
    };

    const addTask = async () => {
        const tempId = Date.now().toString();
        const newTask: Task = {
            id: tempId,
            name: '',
            tasks: []
        };
        
        setTasks([...tasks, newTask]);
        setEditingId(tempId);
        setNewName('');

        /* Create task in backend immediately */
        if (isLoggedIn) {
            const apiId = await createTask('New Task');
            if (apiId) {
                /* Update temp ID with real API ID */
                setTasks(prevTasks => 
                    prevTasks.map(task => 
                        task.id === tempId ? { ...task, id: apiId, name: 'New Task' } : task
                    )
                );
                setEditingId(apiId);
            }
        }
    };

    const addItem = async (TaskId: string) => {
        const tempId = Date.now().toString();
        setTasks(tasks.map(Task =>
            Task.id === TaskId
                ? {
                    ...Task,
                    tasks: [...Task.tasks, {
                        id: tempId,
                        text: '',
                        completed: false,
                        weight: 1
                    }]
                }
                : Task
        ));
        setEditingId(tempId);
        setNewName('');

        /* Create subtask in backend immediately */
        if (isLoggedIn) {
            const apiId = await createSubtask(TaskId, 'New Item', 1);
            if (apiId) {
                /* Update temp ID with real API ID */
                setTasks(prevTasks => 
                    prevTasks.map(task => 
                        task.id === TaskId 
                            ? {
                                ...task,
                                tasks: task.tasks.map(subtask =>
                                    subtask.id === tempId ? { ...subtask, id: apiId, text: 'New Item' } : subtask
                                )
                            }
                            : task
                    )
                );
                setEditingId(apiId);
            }
        }
    };

    const removeTask = async (TaskId: string) => {
        setTasks(tasks.filter(Task => Task.id !== TaskId));
        
        /* Delete from backend */
        if (isLoggedIn) {
            await deleteTask(TaskId);
        }
    };

    const removeItem = async (TaskId: string, taskId: string) => {
        setTasks(tasks.map(Task =>
            Task.id === TaskId
                ? {
                    ...Task,
                    tasks: Task.tasks.filter(task => task.id !== taskId)
                }
                : Task
        ));

        /* Delete from backend */
        if (isLoggedIn) {
            await deleteSubtask(taskId);
        }
    };

    const startEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setNewName(currentName);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && editingId) {
            e.preventDefault();
            saveCurrentAndAddNew(editingId, newName.trim());
        } else if (e.key === 'Enter' && editingId) {
            e.preventDefault();
            const currentValue = newName.trim();

            /* Update current item */
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

                return updatedTasks;
            });

            /* Save current item to backend */
            if (isLoggedIn && currentValue) {
                const isTask = tasks.some(task => task.id === editingId);
                if (isTask) {
                    updateTask(editingId, currentValue);
                } else {
                    updateSubtask(editingId, { content: currentValue });
                }
            }

            /* Create new item */
            const createNewItem = async () => {
                const Task = tasks.find(t => t.tasks.some(st => st.id === editingId));
                
                if (Task) {
                    /* Creating new subtask */
                    const tempId = Date.now().toString();
                    setTasks(prevTasks =>
                        prevTasks.map(t =>
                            t.id === Task.id
                                ? {
                                    ...t,
                                    tasks: [...t.tasks, { id: tempId, text: '', completed: false, weight: 1 }]
                                }
                                : t
                        )
                    );

                    if (isLoggedIn) {
                        const apiId = await createSubtask(Task.id, 'New Item', 1);
                        if (apiId) {
                            setTasks(prevTasks => 
                                prevTasks.map(task => 
                                    task.id === Task.id 
                                        ? {
                                            ...task,
                                            tasks: task.tasks.map(subtask =>
                                                subtask.id === tempId ? { ...subtask, id: apiId, text: 'New Item' } : subtask
                                            )
                                        }
                                        : task
                                )
                            );
                            setEditingId(apiId);
                        } else {
                            setEditingId(tempId);
                        }
                    } else {
                        setEditingId(tempId);
                    }
                } else {
                    /* Creating new task */
                    const tempId = Date.now().toString();
                    setTasks(prevTasks => [...prevTasks, { id: tempId, name: '', tasks: [] }]);

                    if (isLoggedIn) {
                        const apiId = await createTask('New Task');
                        if (apiId) {
                            setTasks(prevTasks => 
                                prevTasks.map(task => 
                                    task.id === tempId ? { ...task, id: apiId, name: 'New Task' } : task
                                )
                            );
                            setEditingId(apiId);
                        } else {
                            setEditingId(tempId);
                        }
                    } else {
                        setEditingId(tempId);
                    }
                }
                
                setNewName('');
            };

            createNewItem();
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!editingId) return;

        const value = newName.trim();
        
        /* Check if editing ID is a task or subtask */
        const isTask = tasks.some(task => task.id === editingId);

        if (isTask) {
            /* Only update the task */
            setTasks(tasks.map(Task => 
                Task.id === editingId 
                    ? { ...Task, name: value || 'New Task' }
                    : Task
            ));
        } else {
            /* Only update the subtask */
            setTasks(tasks.map(Task => ({
                ...Task,
                tasks: Task.tasks.map(task =>
                    task.id === editingId
                        ? { ...task, text: value || 'New Item' }
                        : task
                )
            })));
        }

        /* Debounced update to API */
        if (isLoggedIn && value) {
            if (isTask) {
                debouncedUpdate(`task-${editingId}`, () => updateTask(editingId, value));
            } else {
                debouncedUpdate(`subtask-${editingId}`, () => updateSubtask(editingId, { content: value }));
            }
        }

        setEditingId(null);
        setNewName('');
    };

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    /* Clean up timers on unmount */
    useEffect(() => {
        return () => {
            debounceTimers.current.forEach(timer => clearTimeout(timer));
            debounceTimers.current.clear();
        };
    }, []);

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
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="loading loading-spinner loading-md"></div>
                        </div>
                    ) : (
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
                                                            className={`flex-1 min-w-0 text-sm cursor-pointer break-all md:break-words overflow-hidden text-ellipsis whitespace-nowrap md:whitespace-normal ${task.completed
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
                                                            onClick={() => {
                                                                const newWeight = Math.max(0, task.weight - 1);
                                                                setTasks(tasks.map(g =>
                                                                    g.id === Task.id
                                                                        ? {
                                                                            ...g,
                                                                            tasks: g.tasks.map(t =>
                                                                                t.id === task.id
                                                                                    ? { ...t, weight: newWeight }
                                                                                    : t
                                                                            )
                                                                        }
                                                                        : g
                                                                ));
                                                                
                                                                /* Debounced update to API */
                                                                debouncedUpdate(`subtask-weight-${task.id}`, () => 
                                                                    updateSubtask(task.id, { weight: newWeight })
                                                                );
                                                            }}
                                                            className="p-1 hover:bg-base-300/20 rounded"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-xs w-6 text-center">{task.weight}</span>
                                                        <button
                                                            onClick={() => {
                                                                const newWeight = task.weight + 1;
                                                                setTasks(tasks.map(g =>
                                                                    g.id === Task.id
                                                                        ? {
                                                                            ...g,
                                                                            tasks: g.tasks.map(t =>
                                                                                t.id === task.id
                                                                                    ? { ...t, weight: newWeight }
                                                                                    : t
                                                                            )
                                                                        }
                                                                        : g
                                                                ));
                                                                
                                                                /* Debounced update to API */
                                                                debouncedUpdate(`subtask-weight-${task.id}`, () => 
                                                                    updateSubtask(task.id, { weight: newWeight })
                                                                );
                                                            }}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Workspace;