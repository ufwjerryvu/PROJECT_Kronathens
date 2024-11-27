import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
    name: string,
    viewType: string,
    onViewSwitch(): void
};

const Header: React.FC<HeaderProps> = ({ name, viewType, onViewSwitch }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSort, setActiveSort] = useState('date-created');
    const filterRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    /* So that when we press outside the menu, it'll hide the menu */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* Get the initials of the group name*/
    const parseInitials = (name: string) => {
        let separated = name.split(' ');

        const MAX_LENGTH = 2, INIT_INDEX = 0, ZERO = 0, ONE = 1;

        if (separated.length >= MAX_LENGTH) {
            return (separated[ZERO][INIT_INDEX] + separated[ONE][INIT_INDEX])?.toUpperCase();
        } else {
            if (separated[ZERO].length < MAX_LENGTH) {
                return (separated[ZERO][INIT_INDEX])?.toUpperCase();
            }

            return (separated[ZERO][INIT_INDEX] + separated[ZERO][ONE])?.toUpperCase();
        }
    }

    /* The current icon for the view button based on the state of the view type */
    const renderViewIcon = (viewType: string) => {
        if (viewType === 'card') {
            return (<i className='bi bi-grid text-lg'></i>);
        } else if (viewType === 'list') {
            return (<i className='bi bi-list-task text-lg'></i>)
        }
    };

    /* Filter and sort options for the drop-down */
    const filterOptions = [
        { id: 'all', label: 'All Items', icon: 'bi-collection' },
        { id: 'active', label: 'Active', icon: 'bi-play-circle' },
        { id: 'completed', label: 'Completed', icon: 'bi-check-circle' },
        { id: 'archived', label: 'Archived', icon: 'bi-archive' },
        { id: 'priority', label: 'High Priority', icon: 'bi-flag' }
    ];

    const sortOptions = [
        { id: 'date-created', label: 'Date Created', icon: 'bi-calendar-plus' },
        { id: 'date-modified', label: 'Date Modified', icon: 'bi bi-calendar-check' },
        { id: 'name-asc', label: 'Name A-Z', icon: 'bi-sort-alpha-down' },
        { id: 'name-desc', label: 'Name Z-A', icon: 'bi-sort-alpha-up' },
        { id: 'priority', label: 'Priority', icon: 'bi-sort-numeric-down' }
    ];

    return (
        <div className='bg-base-100 rounded-xl shadow-sm px-3 sm:px-4 py-3 w-full'>
            <div className='flex flex-wrap gap-y-3 w-full'>
                <div className='flex items-center gap-3 flex-grow mr-auto w-full sm:w-auto'>
                    <div className='w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-inner flex-shrink-0'>
                        <span className='text-secondary-content text-sm font-semibold'>
                            {parseInitials(name)}
                        </span>
                    </div>
                    <h1 className='text-lg text-base-content font-semibold tracking-tight truncate'>
                        {name}
                    </h1>
                </div>

                <div className='flex flex-wrap items-center gap-3 w-full sm:w-auto'>
                    <div className='relative flex-1 min-w-[200px] sm:flex-none sm:w-48'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='w-full h-9 bg-base-200 border-none rounded-full px-4 py-2 pl-10 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200'
                        />
                        <i className='bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-base opacity-60'></i>
                    </div>

                    <div className='flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0'>
                        { /* Filtering */}
                        <div className='relative' ref={filterRef}>
                            <button
                                className='h-9 px-2.5 bg-base-200 rounded-full flex items-center gap-1.5 text-sm text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200'
                                onClick={() => {
                                    setIsFilterOpen(!isFilterOpen);
                                    setIsSortOpen(false);
                                }}
                            >
                                <i className='bi bi-funnel text-base'></i>
                                <span className='hidden sm:inline'>Filter</span>
                                <i className={`bi bi-chevron-${isFilterOpen ? 'up' : 'down'} text-xs`}></i>
                            </button>

                            {isFilterOpen && (
                                <div className='absolute top-full right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg py-2 z-10'>
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-base-200 transition-colors ${activeFilter === option.id ? 'text-secondary' : 'text-base-content'
                                                }`}
                                            onClick={() => {
                                                setActiveFilter(option.id);
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            <i className={`bi ${option.icon}`}></i>
                                            {option.label}
                                            {activeFilter === option.id && (
                                                <i className='bi bi-check ml-auto'></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        { /* Sorting */}
                        <div className='relative' ref={sortRef}>
                            <button
                                className='h-9 px-2.5 bg-base-200 rounded-full flex items-center gap-1.5 text-sm text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200'
                                onClick={() => {
                                    setIsSortOpen(!isSortOpen);
                                    setIsFilterOpen(false);
                                }}
                            >
                                <i className='bi bi-sort-down text-base'></i>
                                <span className='hidden sm:inline'>Sort</span>
                                <i className={`bi bi-chevron-${isSortOpen ? 'up' : 'down'} text-xs`}></i>
                            </button>

                            {isSortOpen && (
                                <div className='absolute top-full right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg py-2 z-10'>
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-base-200 transition-colors ${activeSort === option.id ? 'text-secondary' : 'text-base-content'
                                                }`}
                                            onClick={() => {
                                                setActiveSort(option.id);
                                                setIsSortOpen(false);
                                            }}
                                        >
                                            <i className={`bi ${option.icon}`}></i>
                                            {option.label}
                                            {activeSort === option.id && (
                                                <i className='bi bi-check ml-auto'></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* View switch */}
                        <button
                            className='h-9 px-2.5 bg-base-200 rounded-full flex items-center gap-1.5 text-sm 
                                text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200'
                            onClick={onViewSwitch}
                        >
                            {renderViewIcon(viewType)}
                            <span className='hidden sm:inline'>View</span>
                        </button>

                        {/* Add checklist button */}
                        <button className='h-9 px-2.5 bg-secondary text-secondary-content rounded-full flex 
                                items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200
                                hover:bg-opacity-80 active:bg-opacity-60'>
                            <i className='bi bi-plus-lg text-base'></i>
                            <span className='hidden sm:inline'>Checklist</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;