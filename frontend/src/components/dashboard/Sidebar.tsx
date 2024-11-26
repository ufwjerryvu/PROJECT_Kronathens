import React, { useState } from 'react';

interface TeamItem {
  id: string,
  name: string;
}

const Sidebar: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('1');
  const [teams] = useState<TeamItem[]>([
    { id: '1', name: 'Frontend' },
    { id: '2', name: 'Backend' },
    { id: '3', name: 'DevOps' },
    { id: '4', name: 'Data Science' },
    { id: '5', name: 'Machine Learning' },
    { id: '6', name: 'Security' },
    { id: '7', name: 'Product' },
    { id: '8', name: 'UI/UX' },
    { id: '9', name: 'Cloud' },
    { id: '10', name: 'Mobile Development' },
    { id: '11', name: 'QA Automation' },
    { id: '12', name: 'Blockchain' },
    { id: '13', name: 'AI Research' },
    { id: '14', name: 'Infrastructure' },
    { id: '15', name: 'Sales Engineering' },
    { id: '16', name: 'Customer Support' },
    { id: '17', name: 'Operations' },
    { id: '18', name: 'Product Design' },
    { id: '19', name: 'Systems Engineering' },
    { id: '20', name: 'Tech Support' },
  ]);

  const parseInitials = (name: string) => {
    let separated = name.split(' ');

    const MAX_LENGTH = 2, INIT_INDEX = 0, ZERO = 0, ONE = 1;

    if (separated.length >= MAX_LENGTH) {
      return (separated[ZERO][INIT_INDEX] + separated[ONE][INIT_INDEX]).toUpperCase();
    } else {
      if (separated[ZERO].length < MAX_LENGTH) {
        return (separated[ZERO][INIT_INDEX]).toUpperCase();
      }

      return (separated[ZERO][INIT_INDEX] + separated[ZERO][ONE]).toUpperCase();
    }
  }

  const handleAddTeam = () => {

  };

  return (
    <div className='h-full flex flex-col p-2 pt-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold px-2'>All Groups</h2>
        <button
          onClick={handleAddTeam}
          className='h-9 px-2.5 bg-secondary text-secondary-content rounded-full flex items-center gap-1.5 text-sm 
            font-medium whitespace-nowrap transition-all duration-200 hover:opacity-80 active:opacity-60'
        >
          <i className='bi bi-plus-lg text-base'></i>
          <span className='hidden sm:inline'>Add</span>
        </button>
      </div>

      <div className='overflow-y-auto pt-3 auto-hide-scrollbar'>
        <ul>
          {teams.map((team) => (
            <li key={team.id} className='mb-1'>
              <button
                onClick={() => setSelectedTeamId(team.id)}
                className={`w-full rounded-full py-2 pl-2 flex items-center gap-3 transition-colors duration-200
                  ${selectedTeamId === team.id ? 'bg-neutral text-neutral-content' : 'hover:bg-neutral/10'}`}
              >
                <div className='w-8 h-8 bg-neutral rounded-full flex items-center justify-center text-neutral-content 
                  font-medium text-sm'>
                  {parseInitials(team.name)}
                </div>
                <span className='text-sm font-medium truncate'>
                  {team.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;