import React from 'react';

import Navigation from '../components/navigation/Navigation.tsx';
import Box from '../components/dashboard/Box.tsx';
import Sidebar from '../components/dashboard/Sidebar.tsx';

function Dashboard() {
  return (
    <>
      <Navigation/>
      <Box/>
      <Sidebar/>
    </>
  );
}

export default Dashboard;
