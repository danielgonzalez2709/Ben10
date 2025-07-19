import React from 'react';
import type { Alien } from '../../types/alien';
import type { Comment } from '../../types/comment';
import Modal from '../Modal';
import { useAliens } from '../../context/AliensContext';
import { useNavigate } from 'react-router-dom';
import CommentList from '../comments/CommentList';

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

const AlienPopup: React.FC<AlienPopupProps> = (props) => {
  // Hooks siempre al inicio
  const { activateAlien } = useAliens();
  const navigate = useNavigate();
  const [activateMsg, setActivateMsg] = React.useState<string | null>(null);
  const userMap = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userMap') || '{}');
    } catch {
      return {};
    }
  }, []);

  const { isOpen, onClose, alien, comments, onFavoriteToggle, onAddComment, onLikeComment, onEditComment, onDeleteComment } = props;

  if (!alien) return null;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperUser = user && user.isSuperUser;

  // Elegir el comentario destacado: más likeado, si no hay likes, el más reciente
  const rootComments = comments.filter((c) => !c.parentId);
  let topComment = null;
  if (rootComments.length > 0) {
    const maxLikes = Math.max(...rootComments.map(c => c.likes));
    if (maxLikes > 0) {
      topComment = rootComments.find(c => c.likes === maxLikes);
    } else {
      // Si no hay likes, el más reciente
      topComment = rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }
  } else if (comments.length > 0) {
    // Si no hay comentarios raíz, mostrar el comentario más reciente de cualquier tipo
    topComment = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }
  const respuestas = topComment?.replies?.length || 0;

  const handleVerComentarios = () => {
    navigate(`/comentarios?alienId=${alien.id}`);
  };

  const handleActivate = async () => {
    setActivateMsg(null);
    try {
      await activateAlien(alien.id);
      setActivateMsg('¡Alien activado correctamente!');
    } catch (err) {
      setActivateMsg('Error al activar alien');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row w-full max-w-4xl min-h-[500px] md:min-h-[420px] p-0 md:p-4">
        {/* Imagen del Alien */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-white p-6 md:p-8 relative">
          <img
            src={alien.image}
            alt={alien.name}
            className="w-full h-80 md:h-[350px] object-contain rounded-lg shadow-lg bg-gray-100"
            style={{ maxWidth: '340px' }}
          />
          {alien.isFavorite && (
            <span className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-2xl">★</span>
          )}
        </div>

        {/* Info y comentarios */}
        <div className="md:w-1/2 w-full flex flex-col justify-between p-6 md:p-4 gap-2">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{alien.name}</h2>

            {/* Estadísticas */}
            <div className="mb-4">
              <div className="mb-4">
                {[
                  { label: 'Fuerza', value: alien.stats.strength },
                  { label: 'Velocidad', value: alien.stats.speed },
                  { label: 'Habilidades', value: alien.stats.abilities.length },
                ].map((stat, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-black">{stat.label}</span>
                      <span className="text-lg font-bold text-black">{stat.value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${(stat.value / 10) * 100}%` }}
                      ></div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <button 
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full font-semibold"
                onClick={() => window.location.href = `/estadisticas?alienId=${alien.id}`}
              >
                Ver Estadísticas
              </button>

              {isSuperUser && (
                <>
                  <button
                    className={`mb-4 px-4 py-2 w-full font-semibold rounded ${alien.isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => onFavoriteToggle()}
                  >
                    {alien.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                  </button>

                  <button
                    className="mb-4 px-4 py-2 w-full font-semibold rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={handleActivate}
                  >
                    Activar Alien
                  </button>
                </>
              )}

              {activateMsg && (
                <div className="mb-2 text-center text-sm font-semibold text-green-700">
                  {activateMsg}
                </div>
              )}
            </div>

            {/* Comentario destacado */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner mb-2">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Comentarios</h3>
              {topComment ? (
                <div className="bg-white rounded-lg shadow p-3 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black">{userMap[topComment.userId] || topComment.userId}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(topComment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-1 text-gray-700 font-medium">{topComment.content}</div>
                  <div className="flex gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">👍 {topComment.likes}</span>
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
