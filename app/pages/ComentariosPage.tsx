import React, { useState, useEffect } from 'react';
import { useComments } from '../context/CommentsContext';
import { aliens } from '../data/aliens';
import { useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Todos los comentarios', value: 'all', icon: '💬' },
  { label: 'Más populares', value: 'popular', icon: '🔥' },
  { label: 'Recientes', value: 'recent', icon: '🕒' },
  { label: 'Mis comentarios', value: 'mine', icon: '👤' },
];

// Elimina el objeto users simulado y avatars

const initialComments: Comment[] = [
  {
    id: 'c1',
    alienId: '4',
    userId: '1',
    content: 'Heatblast es perfecto para situaciones que requieren control de fuego y vuelo. Lo uso mucho cuando necesito llegar rápido a algún lugar.',
    likes: 24,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    isEdited: false,
    replies: [
      {
        id: 'c1r1',
        alienId: '4',
        userId: '2',
        content: '¡Totalmente de acuerdo! Especialmente útil en emergencias.',
        likes: 5,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        isEdited: false,
        parentId: 'c1',
      },
    ],
  },
  {
    id: 'c2',
    alienId: '1',
    userId: '3',
    content: 'Cuatro Brazos es mi alien favorito para combate cuerpo a cuerpo. Su fuerza es increíble y puede levantar objetos muy pesados.',
    likes: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    isEdited: false,
    replies: [],
  },
  {
    id: 'c3',
    alienId: '2',
    userId: '1',
    content: 'XLR8 es esencial para misiones de rescate y persecuciones. Su velocidad es impresionante.',
    likes: 18,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    isEdited: false,
    replies: [],
  },
];

// Reemplaza la simulación de usuario actual:
// const currentUserId = '1';
const user = JSON.parse(localStorage.getItem('user') || '{}');
const currentUserId = user?.id || '';

// Eliminar la función nestComments y su uso

const ComentariosPage: React.FC = () => {
  const location = useLocation();
  const { comments, addComment, editComment, deleteComment, likeComment } = useComments();
  const [tab, setTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedAlien, setSelectedAlien] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [userLikes, setUserLikes] = useState<{ [id: string]: boolean }>({});
  const [filterAlien, setFilterAlien] = useState('all');
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  // En ComentariosPage, agrega un estado para controlar qué comentario está expandido:
  const [expandedComment, setExpandedComment] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then((users: any[]) => {
        const map: Record<string, string> = {};
        users.forEach(u => { map[u.id] = u.username; });
        setUserMap(map);
      });
  }, []);

  // Leer alienId de la query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const alienId = params.get('alienId');
    if (alienId) {
      setFilterAlien(alienId);
    }
  }, [location.search]);

  // 1. NO filtres el array plano antes de anidar. Usa todos los comentarios para anidar.
  // const allNested = nestComments(comments);
  // 2. Filtra solo los comentarios raíz después de anidar:
  let filtered: Comment[] = comments;

  if (tab === 'popular') {
    filtered = [...comments].sort((a, b) => b.likes - a.likes);
  } else if (tab === 'recent') {
    filtered = [...comments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (tab === 'mine') {
    filtered = comments.filter(c => c.userId === currentUserId);
  }

  if (filterAlien !== 'all') {
    filtered = filtered.filter(c => c.alienId === filterAlien);
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const alienIdToUse = filterAlien !== 'all' ? filterAlien : selectedAlien;
    if (!newComment.trim() || !alienIdToUse) return;
    addComment({
      id: `c${Date.now()}`,
      alienId: alienIdToUse,
      userId: currentUserId,
      content: newComment,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      replies: [],
    });
    setNewComment('');
    setSelectedAlien('');
    setShowForm(false);
  };

  // Al inicio del componente ComentariosPage:
  useEffect(() => {
    // Cargar likes del usuario desde localStorage
    const storedLikes = localStorage.getItem('userLikes');
    if (storedLikes) {
      setUserLikes(JSON.parse(storedLikes));
    }
  }, []);

  const handleLike = (id: string) => {
    const alreadyLiked = !!userLikes[id];
    likeComment(id, alreadyLiked);
    const newUserLikes = { ...userLikes, [id]: !alreadyLiked };
    setUserLikes(newUserLikes);
    localStorage.setItem('userLikes', JSON.stringify(newUserLikes));
  };

  const handleShowReply = (id: string) => {
    setReplyTo(id);
    setReplyText('');
  };

  const handleAddReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addComment({
      id: `r${Date.now()}`,
      alienId: comments.find(c => c.id === parentId)?.alienId || '',
      userId: user.id, // usar siempre el usuario autenticado actual
      content: replyText,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      parentId: parentId,
      replies: [],
    });
    setReplyTo(null);
    setReplyText('');
  };

  const handleRequestDelete = (id: string) => {
    setCommentToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  };

  // Eliminar la función nestComments y su uso

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Comunidad de Aliens</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comparte tus experiencias, estrategias y opiniones sobre los aliens del Omnitrix. 
          Ayuda a otros usuarios a conocer mejor las capacidades de cada alien.
        </p>
      </div>

      {/* Controles principales */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Filtro por alien */}
            <div className="sm:w-48">
              <label htmlFor="alienFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por alien
              </label>
              <select
                id="alienFilter"
                value={filterAlien}
                onChange={(e) => setFilterAlien(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos los aliens</option>
                {aliens.map(alien => (
                  <option key={alien.id} value={alien.id}>{alien.name}</option>
                ))}
              </select>
            </div>

            {/* Estadísticas */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Total: {comments.length} comentarios</span>
              <span>Respuestas: {comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}</span>
              <span>Likes totales: {comments.reduce((acc, c) => acc + c.likes, 0)}</span>
            </div>
          </div>

          {/* Botón agregar comentario */}
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <span>✏️</span>
            Nuevo comentario
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                tab === t.value 
                  ? 'bg-white border-green-600 text-green-700' 
                  : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal para nuevo comentario */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 m-0 p-0" style={{margin:0,padding:0}}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-0" style={{margin:0}}>
            <div className="flex justify-between items-center mb-4 px-6 pt-6">
              <h3 className="text-lg font-bold text-gray-900">Nuevo comentario</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddComment} className="space-y-4 px-6 pb-6">
              {/* Solo mostrar el select si NO hay un alien filtrado */}
              {filterAlien === 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alien
                  </label>
                  <select
                    value={selectedAlien}
                    onChange={e => setSelectedAlien(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Selecciona un alien</option>
                    {aliens.map(alien => (
                      <option key={alien.id} value={alien.id}>{alien.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentario
                </label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Comparte tu experiencia con este alien..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
                >
                  Publicar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-400 rounded bg-white text-black font-bold hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comentarios</h3>
            <p className="text-gray-500">
              {filterAlien !== 'all' 
                ? `No hay comentarios para ${aliens.find(a => a.id === filterAlien)?.name}`
                : 'Sé el primero en comentar sobre los aliens del Omnitrix'
              }
            </p>
          </div>
        ) : (
          filtered.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userMap={userMap}
              formatTimeAgo={formatTimeAgo}
              handleLike={handleLike}
              userLikes={userLikes}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleAddReply={handleAddReply}
              expandedComment={expandedComment}
              setExpandedComment={setExpandedComment}
              deleteComment={deleteComment}
              handleRequestDelete={handleRequestDelete}
            />
          ))
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">¿Estás seguro que quieres borrar este comentario?</h3>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-400 rounded bg-white text-black font-bold hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CommentItem({ comment, userMap, formatTimeAgo, handleLike, userLikes, replyTo, setReplyTo, replyText, setReplyText, handleAddReply, expandedComment, setExpandedComment, deleteComment, handleRequestDelete }: {
  comment: Comment,
  userMap: Record<string, string>,
  formatTimeAgo: (date: Date) => string,
  handleLike: (id: string) => void,
  userLikes: { [id: string]: boolean },
  replyTo: string | null,
  setReplyTo: (id: string | null) => void,
  replyText: string,
  setReplyText: (text: string) => void,
  handleAddReply: (e: React.FormEvent, parentId: string) => void,
  expandedComment: string | null,
  setExpandedComment: (id: string | null) => void,
  deleteComment: (id: string) => void,
  handleRequestDelete: (id: string) => void,
}) {
  const isExpanded = expandedComment === comment.id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={'/images/default-avatar.png'}
          alt={userMap[comment.userId] || comment.userId}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {userMap[comment.userId] || comment.userId}
            </span>
            <span className="text-gray-500 text-sm">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">(editado)</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Alien:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {aliens.find(a => a.id === comment.alienId)?.name}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-4 text-gray-800 leading-relaxed">
        {comment.content}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => handleLike(comment.id)}
          className={`flex items-center gap-1 font-medium transition-colors ${
            userLikes[comment.id] 
              ? 'text-green-600' 
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <span>{userLikes[comment.id] ? '💚' : '👍'}</span>
          {comment.likes}
        </button>
        {/* Botón de respuestas estilo YouTube */}
        {hasReplies && (
          <button
            onClick={() => setExpandedComment(isExpanded ? null : comment.id)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? 'Ver menos' : `${comment.replies.length} respuesta${comment.replies.length > 1 ? 's' : ''}`}
          </button>
        )}
        <button
          onClick={() => setReplyTo(comment.id)}
          className="flex items-center gap-1 text-gray-600 hover:text-green-600 font-medium"
        >
          <span>💬</span>
          Responder
        </button>
        {user.id === comment.userId && (
          <button
            onClick={() => handleRequestDelete(comment.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
          >
            🗑️ Eliminar comentario
          </button>
        )}
      </div>
      {/* Formulario de respuesta */}
      {replyTo === comment.id && (
        <form onSubmit={e => handleAddReply(e, comment.id)} className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Escribe tu respuesta..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
            required
          />
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
            >
              Responder
            </button>
            <button 
              type="button" 
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 border border-gray-300 rounded bg-white text-black font-bold hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {/* Respuestas anidadas visualmente, ocultas por defecto y expandibles */}
      {hasReplies && isExpanded && (
        <div className="mt-4 space-y-3 ml-8 border-l-2 border-blue-200 pl-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              userMap={userMap}
              formatTimeAgo={formatTimeAgo}
              handleLike={handleLike}
              userLikes={userLikes}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleAddReply={handleAddReply}
              expandedComment={expandedComment}
              setExpandedComment={setExpandedComment}
              deleteComment={deleteComment}
              handleRequestDelete={handleRequestDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ComentariosPage; 