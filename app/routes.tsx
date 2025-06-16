import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from './root';
import AliensPage from './pages/AliensPage';
import AlienDetailPage from './pages/AlienDetailPage';
import AliensManagerPage from './pages/AliensManagerPage';
import FavoritesPage from './pages/FavoritesPage';
import EstadisticasPage from './pages/EstadisticasPage';
import ComentariosPage from './pages/ComentariosPage';
import LoginPage from './pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <AliensPage />,
      },
      {
        path: 'aliens',
        element: <AliensManagerPage />,
      },
      {
        path: 'aliens/:id',
        element: <AlienDetailPage />,
      },
      {
        path: 'favoritos',
        element: <FavoritesPage />,
      },
      {
        path: 'estadisticas',
        element: <EstadisticasPage />,
      },
      {
        path: 'comentarios',
        element: <ComentariosPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]); 