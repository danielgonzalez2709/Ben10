import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';

const Root: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/login') {
    return <Outlet />;
  }
  return (
    <MainLayout>
      {location.pathname === '/' ? <HomePage /> : <Outlet />}
    </MainLayout>
  );
};

export default Root;
