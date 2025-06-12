import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { label: 'Inicio', icon: '🏠', path: '/' },
  { label: 'Aliens', icon: '⚡', path: '/aliens' },
  { label: 'Favoritos', icon: '⭐', path: '/favoritos' },
  { label: 'Estadísticas', icon: '📊', path: '/estadisticas' },
  { label: 'Comentarios', icon: '💬', path: '/comentarios' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar responsive */}
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed z-50 md:static top-0 left-0 h-full w-64 bg-white border-r flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          {/* Mini Omnitrix */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <span className="absolute w-7 h-7 rounded-full border-4 border-green-600 bg-black" />
            <span className="absolute w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="font-bold text-lg text-green-700 drop-shadow">Omnitrix</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {menu.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-2 rounded-lg transition-colors hover:bg-green-100 text-gray-700 font-medium ${location.pathname === item.path ? 'bg-green-200 text-green-900' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-green-600 flex items-center justify-between px-4 md:px-8 text-white shadow relative">
          {/* Botón hamburguesa solo en móvil */}
          <button
            className="md:hidden mr-2 p-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl md:text-2xl font-bold tracking-wide">Omnitrix Manager</span>
          <div className="flex items-center gap-2">
            <span className="bg-white text-green-700 px-3 py-1 rounded-full font-semibold text-sm md:text-base">Ben10</span>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-2 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout; 