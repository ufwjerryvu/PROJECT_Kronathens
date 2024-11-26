import React from 'react';

interface HeaderProps{
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
        initials = separated[ZERO][INIT_INDEX];
    }

    const renderViewIcon = (viewType: string) => {
        if(viewType === 'card'){
            return (<i className='bi bi-grid text-lg'></i>);
        }else if(viewType === 'list'){
            return (<i className='bi bi-list-task text-lg'></i>)
        }
    };

    return (
        <div className='bg-base-100 rounded-xl shadow-sm px-6 py-4'>
            <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-inner flex-shrink-0'>
                        <span className='text-secondary-content text-base font-semibold'>
                            {initials}
                        </span>
                    </div>

                    <h1 className='text-xl text-base-content font-semibold tracking-tight'>{name}</h1>
                </div>

                <div className='flex flex-wrap gap-4 items-center lg:ml-auto'>
                    <div className='relative flex-1 min-w-[200px] lg:max-w-[200px]'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='w-full h-10 bg-base-200 border-none rounded-full px-4 py-2 pl-11 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200'
                        />
                        <i className='bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-base opacity-60'></i>
                    </div>
                </div>

                <div className='flex flex-shrink-0 items-center gap-2 ml-auto lg:ml-0'>
                    <button className='h-10 px-3 bg-base-200 rounded-full flex items-center gap-1.5 text-sm text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200 whitespace-nowrap'>
                        <i className='bi bi-funnel text-base'></i>
                        Filter
                    </button>
                    <button className='h-10 px-3 bg-base-200 rounded-full flex items-center gap-1.5 text-sm text-secondary hover:bg-base-300 active:bg-base-300/50 transition-all duration-200 whitespace-nowrap'
                            onClick={onViewSwitch}>
                        {renderViewIcon(viewType)}
                        View
                    </button>
                    <button className="h-10 px-3 bg-secondary text-secondary-content rounded-full flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:bg-opacity-80 active:bg-opacity-60">
                        <i className="bi bi-plus-lg text-base"></i>
                        Checklist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;