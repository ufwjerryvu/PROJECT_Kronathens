import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, ChevronUp, ChevronDown } from 'lucide-react';
import { CardInformation } from '../../interfaces/dashboard/CardInformation';

interface Task {
    id: string;
    text: string;
    completed: boolean;
    weight: number;
}

interface Group {
    id: string;
    name: string;
    tasks: Task[];
}

interface WorkspaceProps {
    isOpen: boolean;
    onClose: () => void;
    card: CardInformation | null;
}

const Workspace = ({ isOpen, onClose, card }: WorkspaceProps) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleTask = (groupId: string, taskId: string) => {
        setGroups(groups.map(group =>
            group.id === groupId
                ? {
                    ...group,
                    tasks: group.tasks.map(task =>
                        task.id === taskId
                            ? { ...task, completed: !task.completed }
                            : task
                    )
                }
                : group
        ));
    };

    const addGroup = () => {
        const id = Date.now().toString();
        const newGroup: Group = {
            id,
            name: '',
            tasks: []
        };
        setGroups([...groups, newGroup]);
        setEditingId(id);
        setNewName('');
    };

    const addTask = (groupId: string) => {
        const id = Date.now().toString();
        setGroups(groups.map(group =>
            group.id === groupId
                ? {
                    ...group,
                    tasks: [...group.tasks, {
                        id,
                        text: '',
                        completed: false,
                        weight: 1
                    }]
                }
                : group
        ));
        setEditingId(id);
        setNewName('');
    };

    const removeGroup = (groupId: string) => {
        setGroups(groups.filter(group => group.id !== groupId));
    };

    const removeTask = (groupId: string, taskId: string) => {
        setGroups(groups.map(group =>
            group.id === groupId
                ? {
                    ...group,
                    tasks: group.tasks.filter(task => task.id !== taskId)
                }
                : group
        ));
    };

    const startEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setNewName(currentName);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const saveCurrentAndAddNew = (editId: string, text: string) => {
        setGroups(prevGroups => {
            const updatedGroups = prevGroups.map(group => {
                if (group.id === editId) {
                    return { ...group, name: text || 'New Task' };
                }
                return {
                    ...group,
                    tasks: group.tasks.map(task =>
                        task.id === editId
                            ? { ...task, text: text || 'New Item' }
                            : task
                    )
                };
            });

            const group = updatedGroups.find(g => g.tasks.some(t => t.id === editId));

            if (group) {
                const newId = Date.now().toString();
                return updatedGroups.map(g =>
                    g.id === group.id
                        ? {
                            ...g,
                            tasks: [...g.tasks, { id: newId, text: '', completed: false, weight: 1 }]
                        }
                        : g
                );
            }

            const newId = Date.now().toString();
            return [...updatedGroups, { id: newId, name: '', tasks: [] }];
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
            const newId = Date.now().toString();

            setGroups(prevGroups => {
                const updatedGroups = prevGroups.map(group => {
                    if (group.id === editingId) {
                        return { ...group, name: currentValue || 'New Task' };
                    }
                    return {
                        ...group,
                        tasks: group.tasks.map(task =>
                            task.id === editingId
                                ? { ...task, text: currentValue || 'New Item' }
                                : task
                        )
                    };
                });

                const group = updatedGroups.find(g => g.tasks.some(t => t.id === editingId));

                if (group) {
                    return updatedGroups.map(g =>
                        g.id === group.id
                            ? {
                                ...g,
                                tasks: [...g.tasks, { id: newId, text: '', completed: false, weight: 1 }]
                            }
                            : g
                    );
                }

                return [...updatedGroups, { id: newId, name: '', tasks: [] }];
            });

            setEditingId(newId);
            setNewName('');
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!editingId) return;

        const value = newName.trim();
        setGroups(groups.map(group => {
            if (group.id === editingId) {
                return { ...group, name: value || 'New Task' };
            }
            return {
                ...group,
                tasks: group.tasks.map(task =>
                    task.id === editingId
                        ? { ...task, text: value || 'New Item' }
                        : task
                )
            };
        }));

        setEditingId(null);
        setNewName('');
    };

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    /* Calculate weighted completion statistics */
    const totalWeight = groups.reduce((acc, group) =>
        acc + group.tasks.reduce((sum, task) => sum + task.weight, 0), 0);
    const completedWeight = groups.reduce((acc, group) =>
        acc + group.tasks.filter(t => t.completed).reduce((sum, task) => sum + task.weight, 0), 0);
    const completionPercentage = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;

    return (
        <div
            className={`absolute inset-0 bg-base-200 rounded-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-base-300">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm gap-2 text-sm"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-xl font-medium">{card?.title}</span>
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
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

                        <div className="space-y-4">
                            {groups.map(group => (
                                <div key={group.id} className="space-y-2">
                                    <div className="flex items-center justify-between pl-2 mb-2">
                                        {editingId === group.id ? (
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
                                                className="text-lg font-medium cursor-pointer"
                                                onClick={() => startEdit(group.id, group.name)}
                                            >
                                                {group.name}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeGroup(group.id)}
                                            className="p-1 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {group.tasks.map(task => (
                                        <div
                                            key={task.id}
                                            className="group"
                                        >
                                            <div className="flex items-center gap-2 py-1.5 pl-2">
                                                <div
                                                    className={`w-5 h-5 rounded-full cursor-pointer ${task.completed
                                                            ? 'bg-green-500'
                                                            : 'border-2 border-base-300'
                                                        } flex items-center justify-center transition-colors duration-200`}
                                                    onClick={() => toggleTask(group.id, task.id)}
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
                                                        className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                                                    />
                                                ) : (
                                                    <span
                                                        className={`flex-1 text-sm cursor-pointer ${task.completed
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
                                                        onClick={() => setGroups(groups.map(g =>
                                                            g.id === group.id
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
                                                        ▼
                                                    </button>
                                                    <span className="text-xs w-6 text-center">{task.weight}</span>
                                                    <button
                                                        onClick={() => setGroups(groups.map(g =>
                                                            g.id === group.id
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
                                                        ▲
                                                    </button>
                                                    <button
                                                        onClick={() => removeTask(group.id, task.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => addTask(group.id)}
                                        className="w-full text-left py-1.5 pl-9 text-xs text-base-content/50 hover:bg-base-300/20 rounded-lg"
                                    >
                                        + Add item
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addGroup}
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