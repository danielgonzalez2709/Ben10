import React, { useState } from 'react';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienPopup from '../components/aliens/AlienPopup';
import { useNavigate } from 'react-router-dom';
import type { Alien } from '../types/alien';

const tabs = [
  { label: 'Todos los Aliens', value: 'all' },
  { label: 'Favoritos', value: 'favorites' },
];

const HomePage: React.FC = () => {
  const [aliens] = useState(initialAliens);
  const [tab, setTab] = useState('all');
  const [activeAlienId, setActiveAlienId] = useState(aliens[1].id); // Por defecto XLR8
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments] = useState(initialComments);
  const navigate = useNavigate();

  const activeAlien = aliens.find(a => a.id === activeAlienId) || aliens[0];

  const handleTabClick = (value: string) => {
    if (value === 'favorites') {
      navigate('/favoritos');
    } else {
      setTab(value);
    }
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

  return (
    <div className="space-y-8">
      {/* Omnitrix Status y Alien Activo */}
      <div className="flex gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col items-center justify-center">
          <div className="w-40 h-40 rounded-full border-8 border-green-500 bg-black flex items-center justify-center mb-4 overflow-hidden">
            <img src={activeAlien.image} alt={activeAlien.name} className="w-36 h-36 object-contain mx-auto my-auto" />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Alien Activo</div>
            <div className="text-2xl font-bold mb-2">{activeAlien.name}</div>
            <div className="text-gray-600 mb-2">El Omnitrix está listo para transformación<br/>(cooldown: 10 minutos)</div>
            <div className="flex gap-2 justify-center mb-2">
              <select
                className="border rounded px-3 py-1 bg-gray-100 text-black"
                value={activeAlienId}
                onChange={e => setActiveAlienId(e.target.value)}
              >
                {aliens.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                onClick={() => setActiveAlienId(activeAlienId)}
              >
                Cambiar Alien
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300"
                onClick={() => navigate(`/estadisticas?alienId=${activeAlienId}`)}
              >
                Ver Estadísticas
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${tab === t.value ? 'bg-white border-green-600 text-green-700' : 'bg-gray-200 border-transparent text-gray-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Aliens Disponibles */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-xl font-bold text-black">Aliens Disponibles</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm w-full sm:w-auto">Filtrar</button>
            <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm w-full sm:w-auto">Ordenar</button>
          </div>
        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {aliens.map((alien) => (
    <div key={alien.id} className="bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-2 relative min-h-[280px]">
      {alien.isFavorite && (
        <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">
          ★
        </span>
      )}
      {/* Imagen del alien */}
      <div className="h-32 w-full bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
        <img src={alien.image} alt={alien.name} className="h-full w-full object-contain" />
      </div>
      <div className="font-bold text-lg text-black">{alien.name}</div>
      <div className="text-gray-500 text-sm mb-2">Usado {alien.stats.usageCount} veces</div>
      <div className="flex gap-2 mt-auto flex-col sm:flex-row">
        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm" onClick={() => handleOpenModal(alien)}>Ver</button>
        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">Activar</button>
      </div>
    </div>
  ))}

        </div>
      </div>
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
    </div>
  );
};

export default HomePage; 