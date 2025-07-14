import React, { useState } from 'react';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienPopup from '../components/aliens/AlienPopup';
import type { Alien } from '../types/alien';
import { useAliens } from '../context/AliensContext';

const categories = [
  { label: 'Todos', value: 'all', count: 15 },
  { label: 'Originales', value: 'original', count: 10 },
  { label: 'Alien Force', value: 'alienforce', count: 5 },
];

const habilidades = [
  'Fuerza',
  'Velocidad',
  'Vuelo',
  'Control de fuego',
  'Estudio',
  'Favoritos',
  'Activo', // Cambiado de 'Activos' a 'Activo'
];

const AliensManagerPage: React.FC = () => {
  const { aliens, toggleFavorite } = useAliens();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHabilidades, setSelectedHabilidades] = useState<string[]>([]); // Filtros aplicados
  const [tempHabilidades, setTempHabilidades] = useState<string[]>([]); // Filtros temporales
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments] = useState(initialComments);
  const [orderBy, setOrderBy] = useState('nombre-az');
  const [showOrderMenu, setShowOrderMenu] = useState(false);

  // Diccionario para mostrar el texto del filtro seleccionado
  const orderLabels: Record<string, string> = {
    'nombre-az': 'Nombre (A-Z)',
    'nombre-za': 'Nombre (Z-A)',
    'usos-desc': 'Veces usado (mayor a menor)',
    'usos-asc': 'Veces usado (menor a mayor)',
    'favoritos': 'Favoritos primero',
  };

  const handleOpenModal = (alien: Alien) => {
    setSelectedAlien(alien);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlien(null);
  };

  // Funciones dummy para comentarios (puedes implementar lógica real si lo deseas)
  const onFavoriteToggle = () => {};
  const onAddComment = (content: string, parentId?: string) => {};
  const onLikeComment = (commentId: string) => {};
  const onEditComment = (commentId: string, content: string) => {};
  const onDeleteComment = (commentId: string) => {};

  const filteredComments = selectedAlien
    ? comments.filter((c) => c.alienId === selectedAlien.id)
    : [];

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperUser = user && user.isSuperUser;

  // Filtrar por categoría
  let filteredAliens = selectedCategory === 'all' ? aliens : aliens.filter(a => a.category === selectedCategory);

  // Filtrar por habilidades, favoritos y activos
  if (selectedHabilidades.length > 0) {
    filteredAliens = filteredAliens.filter(alien => {
      // Filtros especiales
      const checks = selectedHabilidades.map(filtro => {
        if (filtro === 'Favoritos') return alien.isFavorite;
        if (filtro === 'Activo') return alien.isActive;
        // Filtro por habilidad (en español o inglés)
        const habilidades = alien.stats.abilities.map(h => h.toLowerCase());
        if (filtro === 'Fuerza') return habilidades.some(h => h.includes('fuerza') || h.includes('strength'));
        if (filtro === 'Velocidad') return habilidades.some(h => h.includes('velocidad') || h.includes('speed'));
        if (filtro === 'Vuelo') return habilidades.some(h => h.includes('vuelo') || h.includes('flight'));
        if (filtro === 'Control de fuego') return habilidades.some(h => h.includes('fuego') || h.includes('fire'));
        if (filtro === 'Estudio') return habilidades.some(h => h.includes('estudio') || h.includes('intelligence') || h.includes('study'));
        return true;
      });
      // Solo pasa si cumple todos los filtros seleccionados
      return checks.every(Boolean);
    });
  }
  // Ordenar aliens según la opción seleccionada
  let sortedAliens = [...filteredAliens];
  if (orderBy === 'nombre-az') {
    sortedAliens.sort((a, b) => a.name.localeCompare(b.name));
  } else if (orderBy === 'nombre-za') {
    sortedAliens.sort((a, b) => b.name.localeCompare(a.name));
  } else if (orderBy === 'usos-desc') {
    sortedAliens.sort((a, b) => b.stats.usageCount - a.stats.usageCount);
  } else if (orderBy === 'usos-asc') {
    sortedAliens.sort((a, b) => a.stats.usageCount - b.stats.usageCount);
  } else if (orderBy === 'favoritos') {
    sortedAliens.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }

  // Al cambiar de categoría, sincronizar los filtros temporales con los aplicados
  React.useEffect(() => {
    setTempHabilidades(selectedHabilidades);
  }, [selectedHabilidades, selectedCategory]);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
      <button className="md:hidden mb-2 bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition w-full" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>
      <aside className={`w-full md:w-64 space-y-6 ${showFilters ? 'block' : 'hidden'} md:block bg-white md:bg-transparent p-4 md:p-0 rounded md:rounded-none shadow md:shadow-none z-20 absolute md:static left-0 top-16 md:top-0`} style={{maxWidth: '100vw'}}>
        <div>
          <input
            type="text"
            placeholder="Buscar Alien por nombre o habilidad..."
            className="w-full px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-black placeholder-gray-500 bg-gray-100"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <h3 className="font-bold mb-2 text-black">Categorías</h3>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat.value}>
                <button
                  className={`w-full text-left px-3 py-1 rounded ${selectedCategory === cat.value ? 'bg-green-200 text-green-900 font-semibold' : 'hover:bg-gray-100 text-black'}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label} <span className="ml-2 text-xs text-gray-500">{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2 text-black">Filtros</h3>
          <form className="space-y-1" onSubmit={e => e.preventDefault()}>
            {habilidades.map(hab => (
              <label key={hab} className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={tempHabilidades.includes(hab)}
                  onChange={e => {
                    if (e.target.checked) setTempHabilidades([...tempHabilidades, hab]);
                    else setTempHabilidades(tempHabilidades.filter(h => h !== hab));
                  }}
                />
                {hab}
              </label>
            ))}
            <button type="button" className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700" onClick={() => setSelectedHabilidades(tempHabilidades)}>Aplicar</button>
          </form>
        </div>
      </aside>
      <section className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-black">Todos los Aliens</h1>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <button className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setView('grid')}>Grid</button>
            <button className={`px-3 py-1 rounded ${view === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setView('list')}>Lista</button>
            <div className="relative">
              <button
                className="bg-green-600 text-white px-4 py-1 rounded font-semibold shadow hover:bg-green-700 transition"
                onClick={() => setShowOrderMenu((v) => !v)}
                type="button"
              >
                Ordenar por: {orderLabels[orderBy]}
              </button>
              {showOrderMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  <button className="w-full text-left px-4 py-2 text-gray-900 hover:bg-green-100 hover:text-green-700" onClick={() => { setOrderBy('nombre-az'); setShowOrderMenu(false); }}>Nombre (A-Z)</button>
                  <button className="w-full text-left px-4 py-2 text-gray-900 hover:bg-green-100 hover:text-green-700" onClick={() => { setOrderBy('nombre-za'); setShowOrderMenu(false); }}>Nombre (Z-A)</button>
                  <button className="w-full text-left px-4 py-2 text-gray-900 hover:bg-green-100 hover:text-green-700" onClick={() => { setOrderBy('usos-desc'); setShowOrderMenu(false); }}>Veces usado (mayor a menor)</button>
                  <button className="w-full text-left px-4 py-2 text-gray-900 hover:bg-green-100 hover:text-green-700" onClick={() => { setOrderBy('usos-asc'); setShowOrderMenu(false); }}>Veces usado (menor a mayor)</button>
                  <button className="w-full text-left px-4 py-2 text-gray-900 hover:bg-green-100 hover:text-green-700" onClick={() => { setOrderBy('favoritos'); setShowOrderMenu(false); }}>Favoritos primero</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {view === 'grid' ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedAliens.map(alien => (
              <div key={alien.id} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2 relative w-full max-w-full">
                {alien.isFavorite && (
                  <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">★</span>
                )}
                <img src={alien.image} alt={alien.name} className="h-32 object-contain rounded mb-2 w-full" />
                <div className="font-bold text-lg text-black break-words truncate max-w-full text-center w-full">{alien.name}</div>
                <div className="text-gray-700 text-sm mb-2">Usado {alien.stats.usageCount} veces</div>
                <div className="flex flex-col gap-2 mt-auto w-full">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm w-full" onClick={() => handleOpenModal(alien)}>Ver</button>
                  {isSuperUser && (
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm w-full">Activar</button>
                  )}
                  {isSuperUser && (
                    <button
                      className={`px-3 py-1 rounded text-sm w-full ${alien.isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => toggleFavorite(alien.id)}
                    >
                      {alien.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAliens.map(alien => (
              <div key={alien.id} className="bg-white rounded-lg p-4 shadow flex flex-col sm:flex-row items-center gap-4 relative w-full max-w-full">
                {alien.isFavorite && (
                  <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">★</span>
                )}
                <img src={alien.image} alt={alien.name} className="w-24 h-24 object-contain rounded" />
                <div className="flex-1">
                  <div className="font-bold text-lg text-black break-words truncate max-w-full text-center w-full">{alien.name}</div>
                  <div className="text-gray-700 text-sm mb-2">Usado {alien.stats.usageCount} veces</div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm w-full sm:w-auto" onClick={() => handleOpenModal(alien)}>Ver</button>
                  {isSuperUser && (
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm w-full sm:w-auto">Activar</button>
                  )}
                  {isSuperUser && (
                    <button
                      className={`px-3 py-1 rounded text-sm w-full sm:w-auto ${alien.isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => toggleFavorite(alien.id)}
                    >
                      {alien.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <AlienPopup
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          alien={selectedAlien}
          comments={filteredComments}
          onFavoriteToggle={onFavoriteToggle}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
        />
      </section>
    </div>
  );
};

export default AliensManagerPage;