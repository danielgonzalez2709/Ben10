import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import { AliensProvider } from './context/AliensContext';

const Root: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/login') {
    return <Outlet />;
  }
  return (
    <AliensProvider>
      <MainLayout>
        {location.pathname === '/' ? <HomePage /> : <Outlet />}
      </MainLayout>
    </AliensProvider>
  );
};

export default Root;
