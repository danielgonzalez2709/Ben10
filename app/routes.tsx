import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from './root';
import AliensPage from './pages/AliensPage';
import AlienDetailPage from './pages/AlienDetailPage';
import AliensManagerPage from './pages/AliensManagerPage';

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
    ],
  },
]); 