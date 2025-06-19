import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { aliens as originalAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienPopup from '../components/aliens/AlienPopup';
import AlienStats from '../components/aliens/AlienStats';

// Cambiar el nombre 'Calor' por 'Heat' en los datos
const aliens = originalAliens.map(a => a.name === 'Calor' ? { ...a, name: 'Heat' } : a);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const alienId = query.get('alienId');
  // Selector de alien (por defecto 'Heat' si existe, si no el primero)
  const defaultId = aliens.find(a => a.name === 'Heat')?.id || aliens[0].id;
  const [selectedId, setSelectedId] = useState(alienId || defaultId);
  const [selectedAlien, setSelectedAlien] = useState(aliens.find(a => a.id === (alienId || defaultId)) || aliens[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments] = useState(initialComments);
  const alien = aliens.find((a) => a.id === selectedId);
  if (!alien) return <div>No se encontró el alien.</div>;

  const handleOpenModal = (alienObj: typeof aliens[0]) => {
    setSelectedAlien(alienObj);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      {/* Selector de alien */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <button
          className="text-green-700 hover:underline font-semibold"
          onClick={() => navigate('/')}
        >
          &larr; Volver al inicio
        </button>
        <label className="font-semibold text-black ml-0 sm:ml-4 bg-gray-100 px-3 py-2 rounded">
          Selecciona un alien:
          <select
            className="ml-2 px-2 py-1 border rounded bg-white"
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setSelectedAlien(aliens.find(a => a.id === e.target.value) || aliens[0]); }}
          >
            {aliens.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>
      </div>
      {/* Tarjeta principal */}
      <section className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative w-48 h-48 bg-white rounded border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => handleOpenModal(alien)}>
          <img src={alien.image} alt={alien.name} className="object-contain w-full h-full p-2" />
          <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">★</span>
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-black cursor-pointer" onClick={() => handleOpenModal(alien)}>{alien.name}</h2>
          <div className="flex flex-wrap gap-2 items-center text-gray-600 text-sm">
            <span>Usado <span className="font-bold text-black">{alien.stats.usageCount}</span> veces</span>
            <span className="flex items-center gap-1">🗨️ <span className="font-bold text-black">{alien.stats.commentCount}</span> comentarios</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">Activar Alien</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">Agregar a Prioridad</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">Quitar de Favoritos</button>
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
      </section>
      {/* Estadísticas */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-black">Estadísticas de {alien.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Métricas */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm">Número de veces usado</div>
              <div className="text-2xl font-bold text-black">{alien.stats.usageCount}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm">Tiempo promedio de uso</div>
              <div className="text-2xl font-bold text-black">{alien.stats.averageUsageTime}m</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm">Comentarios recibidos</div>
              <div className="text-2xl font-bold text-black">{alien.stats.commentCount}</div>
            </div>
          </div>
          {/* Capacidades */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold mb-4 text-black">Capacidades</h4>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Fuerza</span>
                <span className="font-bold text-black">{alien.stats.strength}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(alien.stats.strength / 10) * 100}%` }}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Velocidad</span>
                <span className="font-bold text-black">{alien.stats.speed}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(alien.stats.speed / 10) * 100}%` }}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Habilidades</span>
                <span className="font-bold text-black">{alien.stats.abilities.length}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(alien.stats.abilities.length / 10) * 100}%` }}></div>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="font-medium mb-2">Habilidades</h5>
              <div className="flex flex-wrap gap-2">
                {alien.stats.abilities.map((ability, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{ability}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EstadisticasPage; 