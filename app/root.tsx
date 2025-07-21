import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import { AliensProvider } from './context/AliensContext';
import { CommentsProvider } from './context/CommentsContext';

const Root: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);
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
