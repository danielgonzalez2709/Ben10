import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menu = [
  { label: 'Inicio', icon: '🏠', path: '/' },
  { label: 'Aliens', icon: '👽', path: '/aliens' },
  { label: 'Favoritos', icon: '⭐', path: '/favoritos' },
  { label: 'Estadísticas', icon: '📊', path: '/estadisticas' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user?.username || 'Usuario';

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 h-full w-80 lg:w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full border-4 border-green-600 bg-black animate-pulse" />
            <div className="absolute w-4 h-4 rounded-full bg-green-500 animate-ping" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-green-700">Omnitrix</h1>
            <p className="text-xs text-gray-500">Sistema de Gestión</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {menu.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                    location.pathname === item.path 
                      ? 'bg-green-100 text-green-700 border-r-4 border-green-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-sm lg:text-base">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{user?.username === 'ben10' ? 'Ben Tennyson' : username}</p>
              <p className="text-xs text-gray-500">{user?.username === 'ben10' ? 'Portador del Omnitrix' : 'usuario'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Botón hamburguesa */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Título de la página */}
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                {menu.find(item => item.path === location.pathname)?.label || 'Omnitrix Manager'}
              </h1>
              <p className="text-sm text-gray-500 hidden lg:block">
                Gestiona tus aliens y maximiza su potencial
              </p>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Perfil */}
            <div className="relative">
              <div
                className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg cursor-pointer select-none"
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{username.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-semibold text-green-700 text-sm hidden sm:block">{username}</span>
                <svg className="w-4 h-4 ml-1 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 