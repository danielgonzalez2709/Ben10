import React from 'react';
import type { Alien } from '../../types/alien';
import type { Comment } from '../../types/comment';
import AlienStats from './AlienStats';
import Modal from '../Modal';

interface AlienPopupProps {
  isOpen: boolean;
  onClose: () => void;
  alien: Alien | null;
  comments: Comment[];
  onFavoriteToggle: () => void;
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const AlienPopup: React.FC<AlienPopupProps> = ({
  isOpen,
  onClose,
  alien,
  comments,
  onFavoriteToggle,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}) => {
  if (!alien) return null;

  // Tomar el comentario más popular (más likes)
  const topComment = comments
    .filter((c) => !c.parentId)
    .sort((a, b) => b.likes - a.likes)[0];
  const respuestas = topComment?.replies?.length || 0;

  const handleVerComentarios = () => {
    window.location.href = `/comentarios?alienId=${alien.id}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row w-full max-w-4xl min-h-[500px] md:min-h-[420px] p-0 md:p-4">
        {/* Imagen del Alien */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-white p-6 md:p-8">
          <img
            src={alien.image}
            alt={alien.name}
            className="w-full h-80 md:h-[350px] object-contain rounded-lg shadow-lg bg-gray-100"
            style={{ maxWidth: '340px' }}
          />
        </div>
        {/* Info y comentarios */}
        <div className="md:w-1/2 w-full flex flex-col justify-between p-6 md:p-4 gap-2">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{alien.name}</h2>
            {/* Estadísticas */}
            <div className="mb-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-black">Fuerza</span>
                  <span className="text-lg font-bold text-black">{alien.stats.strength}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(alien.stats.strength / 10) * 100}%` }}></div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-black">Velocidad</span>
                  <span className="text-lg font-bold text-black">{alien.stats.speed}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(alien.stats.speed / 10) * 100}%` }}></div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-black">Habilidades</span>
                  <span className="text-lg font-bold text-black">{alien.stats.abilities.length}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(alien.stats.abilities.length / 10) * 100}%` }}></div>
                </div>
              </div>
              <button 
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full font-semibold"
                onClick={() => window.location.href = `/estadisticas?alienId=${alien.id}`}
              >
                Ver Estadísticas
              </button>
            </div>
            {/* Comentario destacado */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner mb-2">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Comentarios</h3>
              {topComment ? (
                <div className="bg-white rounded-lg shadow p-3 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black">{topComment.userId}</span>
                    <span className="text-gray-500 text-xs">hace {Math.floor((Date.now() - new Date(topComment.createdAt).getTime()) / (1000*60*60*24))} días</span>
                  </div>
                  <div className="mb-1 text-gray-700 font-medium">{topComment.content}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="font-semibold">{alien.name}</span>
                  </div>
                  <div className="flex gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">👍 {topComment.likes}</span>
                    <span className="flex items-center gap-1">💬 {respuestas} respuestas</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Sin comentarios aún.</div>
              )}
              <button
                className="mt-2 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition w-full font-bold flex items-center justify-center gap-2 text-lg shadow-lg border border-green-700"
                onClick={handleVerComentarios}
              >
                <span>💬</span> Ver comentarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlienPopup; 