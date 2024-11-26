import React from 'react';

interface HeaderProps {
    name: string,
    viewType: string,
    onViewSwitch(): void
};

const Header: React.FC<HeaderProps> = ({ name, viewType, onViewSwitch }) => {
    let separated = name.split(' ');
    const MAX_LENGTH = 2, INIT_INDEX = 0, ZERO = 0, ONE = 1;

    let initials = '';
    if (separated.length >= MAX_LENGTH && separated[ONE].length >= ONE) {
        initials = separated[ZERO][INIT_INDEX] + separated[ONE][INIT_INDEX];
    } else {
        if (separated[ZERO].length < MAX_LENGTH) {
            initials = initials = separated[ZERO][INIT_INDEX]
        } else {
            initials = separated[ZERO][INIT_INDEX] + separated[ZERO][ONE];
        }
    }

    const renderViewIcon = (viewType: string) => {
        if (viewType === 'card') {
            return (<i className='bi bi-grid text-lg'></i>);
        } else if (viewType === 'list') {
            return (<i className='bi bi-list-task text-lg'></i>)
        }
    };

    return (
        <div className='bg-base-100 rounded-xl shadow-sm px-3 sm:px-4 py-3 w-full'>
            <div className='flex flex-wrap gap-y-3 w-full'>
                <div className='flex items-center gap-3 flex-grow mr-auto w-full sm:w-auto'>
                    <div className='w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-inner flex-shrink-0'>
                        <span className='text-secondary-content text-sm font-semibold'>
                            {initials}
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
                        <button className='h-9 px-2.5 bg-base-200 rounded-full flex items-center gap-1.5 text-sm text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200'>
                            <i className='bi bi-funnel text-base'></i>
                            <span className='hidden sm:inline'>Filter</span>
                        </button>
                        <button
                            className='h-9 px-2.5 bg-base-200 rounded-full flex items-center gap-1.5 text-sm text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200'
                            onClick={onViewSwitch}
                        >
                            {renderViewIcon(viewType)}
                            <span className='hidden sm:inline'>View</span>
                        </button>
                        <button className='h-9 px-2.5 bg-secondary text-secondary-content rounded-full flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60'>
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