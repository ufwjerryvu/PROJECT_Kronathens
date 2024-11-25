import React, { } from 'react';
import Header from './Header.tsx';

const MainSection: React.FC = ({ }) => {
    return (
        <>
            <div className='container pt-12 pb-12'>
                <div className='flex h-[100vh] rounded-3xl h-96 bg-base-200'>
                    <ul className='menu bg-base-300 w-56 w-1/5 p-4 rounded-l-3xl'>

                    </ul>

                    <div className='w-4/5 bg-base-200 p-4 rounded-xl'>
                        <Header name={'Office Christmas Barbecue'} />
                    </div>

                </div>
            </div>
        </>
    );
};

export default MainSection;