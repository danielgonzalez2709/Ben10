import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import { AliensProvider } from './context/AliensContext';
import { CommentsProvider } from './context/CommentsContext';

const Root: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/login') {
    return <Outlet />;
  }
  return (
    <AliensProvider>
      <CommentsProvider>
        <MainLayout>
          {location.pathname === '/' ? <HomePage /> : <Outlet />}
        </MainLayout>
      </CommentsProvider>
    </AliensProvider>
  );
};

export default Root;
