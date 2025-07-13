import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAliens } from '../context/AliensContext';
import AlienPopup from '../components/aliens/AlienPopup';
import type { Alien } from '../types/alien';

const HomePage: React.FC = () => {
  const { aliens, toggleFavorite } = useAliens();
  const [activeAlienId, setActiveAlienId] = useState(aliens[1].id); // Por defecto XLR8
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const activeAlien = aliens.find(a => a.id === activeAlienId) || aliens[0];

  const handleOpenModal = (alien: Alien) => {
    setSelectedAlien(alien);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlien(null);
  };

  // Dummy handlers para AlienPopup (no funcionalidad de comentarios aquí)
  const onFavoriteToggle = () => {};
  const onAddComment = () => {};
  const onLikeComment = () => {};
  const onEditComment = () => {};
  const onDeleteComment = () => {};

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gradient-to-b from-green-100 to-white overflow-x-hidden pt-16">
      <div className="w-full max-w-screen-md flex flex-col items-center justify-center">
        {/* Mensaje de bienvenida */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-1 text-center drop-shadow-lg">¡Bienvenido, Ben 10!</h1>
        <p className="text-base md:text-lg text-gray-600 mb-4 text-center max-w-lg">Gestiona tus aliens y maximiza su potencial. Elige tu transformación y consulta las estadísticas del Omnitrix.</p>
        {/* Tarjeta del Alien Activo */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col items-center w-full relative animate-fadeIn overflow-x-hidden">
          {/* Fondo Omnitrix animado */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full bg-green-200 opacity-30 blur-2xl animate-pulse z-0 pointer-events-none select-none" />
          <div className="relative z-10 mb-4">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[8px] border-green-500 bg-black flex items-center justify-center animate-pulse shadow-xl">
              <img src={activeAlien.image} alt={activeAlien.name} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
            </div>
            <span className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-base font-bold shadow-lg">Activo</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 mb-1 text-center">{activeAlien.name}</h2>
          <p className="text-sm md:text-base text-gray-600 mb-2 text-center">El Omnitrix está listo para transformación <span className="font-semibold">(cooldown: 10 minutos)</span></p>
          {/* Estadísticas principales */}
          <div className="w-full flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="flex items-center gap-2"><span className="text-red-500">💪</span> Fuerza</span>
              <span>{activeAlien.stats.strength}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(activeAlien.stats.strength / 10) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="flex items-center gap-2"><span className="text-blue-500">⚡</span> Velocidad</span>
              <span>{activeAlien.stats.speed}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-400 h-3 rounded-full" style={{ width: `${(activeAlien.stats.speed / 10) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="flex items-center gap-2"><span className="text-green-700">🛡️</span> Habilidades</span>
              <span>{activeAlien.stats.abilities.length}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {activeAlien.stats.abilities.map((ab, i) => (
                <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs md:text-sm rounded-full font-semibold shadow-sm">{ab}</span>
              ))}
            </div>
          </div>
          {/* Acciones */}
          <div className="flex flex-col md:flex-row gap-2 w-full justify-center">
            <select
              className="border rounded px-3 py-1 bg-gray-100 text-black text-base font-semibold shadow"
              value={activeAlienId}
              onChange={e => setActiveAlienId(e.target.value)}
            >
              {aliens.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-base font-bold shadow hover:bg-green-700 flex items-center gap-2 justify-center"
              onClick={() => setActiveAlienId(activeAlienId)}
            >
              <span>🔄</span> Cambiar Alien
            </button>
            <button
              className="bg-gray-200 text-green-700 px-4 py-2 rounded-xl text-base font-bold shadow hover:bg-gray-300 flex items-center gap-2 justify-center"
              onClick={() => navigate(`/estadisticas?alienId=${activeAlienId}`)}
            >
              <span>📊</span> Ver Estadísticas
            </button>
          </div>
        </div>
        {/* Popup Alien (opcional, si quieres ver detalles del alien activo) */}
        <AlienPopup
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          alien={selectedAlien}
          comments={[]}
          onFavoriteToggle={onFavoriteToggle}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
        />
      </div>
    </div>
  );
};

export default HomePage; 