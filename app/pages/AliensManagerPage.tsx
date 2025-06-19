import React, { useState } from 'react';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienPopup from '../components/aliens/AlienPopup';
import type { Alien } from '../types/alien';
import { useAliens } from '../context/AliensContext';

const categories = [
  { label: 'Todos', value: 'all', count: 20 },
  { label: 'Originales', value: 'original', count: 8 },
  { label: 'Alien Force', value: 'alienforce', count: 5 },
  { label: 'Ultimatrix', value: 'ultimatrix', count: 7 },
];

const habilidades = [
  'Fuerza',
  'Velocidad',
  'Vuelo',
  'Control de fuego',
  'Estudio',
  'Favoritos',
  'Activos',
];

const AliensManagerPage: React.FC = () => {
  const { aliens, toggleFavorite } = useAliens();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHabilidades, setSelectedHabilidades] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments] = useState(initialComments);

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
          <form className="space-y-1">
            {habilidades.map(hab => (
              <label key={hab} className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={selectedHabilidades.includes(hab)}
                  onChange={e => {
                    if (e.target.checked) setSelectedHabilidades([...selectedHabilidades, hab]);
                    else setSelectedHabilidades(selectedHabilidades.filter(h => h !== hab));
                  }}
                />
                {hab}
              </label>
            ))}
            <button type="button" className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700">Aplicar</button>
          </form>
        </div>
      </aside>
      <section className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-black">Todos los Aliens</h1>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <button className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setView('grid')}>Grid</button>
            <button className={`px-3 py-1 rounded ${view === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setView('list')}>Lista</button>
            <button className="bg-green-600 text-white px-4 py-1 rounded font-semibold shadow hover:bg-green-700 transition">Ordenar por</button>
            <button className="bg-green-600 text-white px-4 py-1 rounded font-semibold shadow hover:bg-green-700 transition">Filtros</button>
          </div>
        </div>
        {view === 'grid' ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {aliens.map(alien => (
              <div key={alien.id} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2 relative w-full max-w-full">
                {alien.isFavorite && (
                  <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">★</span>
                )}
                <img src={alien.image} alt={alien.name} className="h-32 object-contain rounded mb-2 w-full" />
                <div className="font-bold text-lg text-black break-words truncate max-w-full text-center w-full">{alien.name}</div>
                <div className="text-gray-700 text-sm mb-2">Usado {alien.stats.usageCount} veces</div>
                <div className="flex flex-col gap-2 mt-auto w-full">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm w-full" onClick={() => handleOpenModal(alien)}>Ver</button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm w-full">Activar</button>
                  <button
                    className={`px-3 py-1 rounded text-sm w-full ${alien.isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => toggleFavorite(alien.id)}
                  >
                    {alien.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {aliens.map(alien => (
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
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm w-full sm:w-auto">Activar</button>
                  <button
                    className={`px-3 py-1 rounded text-sm w-full sm:w-auto ${alien.isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => toggleFavorite(alien.id)}
                  >
                    {alien.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                  </button>
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