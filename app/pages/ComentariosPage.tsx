import React, { useState } from 'react';
import type { Comment } from '../types/comment';

const TABS = [
  { label: 'Todos los comentarios', value: 'all' },
  { label: 'Más populares', value: 'popular' },
  { label: 'Recientes', value: 'recent' },
];

// Datos simulados
const users = {
  '1': 'Gwen Tennyson',
  '2': 'Kevin Levin',
  '3': 'Ben Tennyson',
} as const;
const userAvatars: Record<string, string> = {
  '1': '/images/gwen.jpg',
  '2': '/images/kevin.jpg',
  '3': '/images/ben.jpg',
};
const aliens = {
  '4': 'Heatblast',
  '1': 'Cuatro Brazos',
  '2': 'XLR8',
  '3': 'Diamante',
  '5': 'Materia Gris',
} as const;
const aliensArr = Object.entries(aliens).map(([id, name]) => ({ id, name }));

const initialComments: Comment[] = [
  {
    id: 'c1',
    alienId: '4',
    userId: '1',
    content: 'Este alien es muy útil',
    likes: 24,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
    updatedAt: new Date(),
    isEdited: false,
    replies: [
      {
        id: 'c1r1',
        alienId: '4',
        userId: '2',
        content: '¡Totalmente de acuerdo!',
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
    content: 'Cuatro Brazos es el más fuerte.',
    likes: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    isEdited: false,
    replies: [],
  },
];

// Simulación de usuario actual
const currentUserId = '1';

const ComentariosPage: React.FC = () => {
  const [tab, setTab] = useState('all');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedAlien, setSelectedAlien] = useState(aliensArr[0].id);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  // Guardar likes dados por el usuario actual
  const [userLikes, setUserLikes] = useState<{ [id: string]: boolean }>({});

  // Filtros de tabs
  let filtered = comments;
  if (tab === 'popular') {
    filtered = [...comments].sort((a, b) => b.likes - a.likes);
  } else if (tab === 'recent') {
    filtered = [...comments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      {
        id: `c${Date.now()}`,
        alienId: selectedAlien,
        userId: '1', // Simulación: Gwen
        content: newComment,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false,
        replies: [],
      },
      ...comments,
    ]);
    setNewComment('');
    setShowForm(false);
  };

  // Like/Unlike a comentario o respuesta
  const handleLike = (id: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        const liked = userLikes[id];
        return { ...c, likes: c.likes + (liked ? -1 : 1) };
      }
      return {
        ...c,
        replies: c.replies?.map(r => {
          if (r.id === id) {
            const liked = userLikes[id];
            return { ...r, likes: r.likes + (liked ? -1 : 1) };
          }
          return r;
        })
      };
    }));
    setUserLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mostrar formulario de respuesta
  const handleShowReply = (id: string) => {
    setReplyTo(id);
    setReplyText('');
  };

  // Agregar respuesta
  const handleAddReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setComments(prev => prev.map(c =>
      c.id === parentId
        ? {
            ...c,
            replies: [
              ...c.replies || [],
              {
                id: `r${Date.now()}`,
                alienId: c.alienId,
                userId: '2', // Simulación: Kevin
                content: replyText,
                likes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                isEdited: false,
                parentId,
              },
            ],
          }
        : c
    ));
    setReplyTo(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black mb-2">Comentarios</h1>
      {/* Botón agregar comentario */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition mb-2"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? 'Cancelar' : 'Agregar comentario'}
      </button>
      {/* Formulario para agregar comentario */}
      {showForm && (
        <form onSubmit={handleAddComment} className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col gap-3 max-w-md">
          <label className="font-semibold text-black">Alien:
            <select
              className="ml-2 px-2 py-1 border rounded bg-gray-100"
              value={selectedAlien}
              onChange={e => setSelectedAlien(e.target.value)}
            >
              {aliensArr.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </label>
          <textarea
            className="border rounded px-2 py-1 bg-gray-100 text-black placeholder-gray-500 font-medium"
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-semibold">Publicar</button>
        </form>
      )}
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${tab === t.value ? 'bg-white border-green-600 text-green-700' : 'bg-gray-200 border-transparent text-gray-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Lista de comentarios */}
      <div className="space-y-4">
        {filtered.map((comment, idx) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={userAvatars[comment.userId as keyof typeof userAvatars] || '/images/default-avatar.png'}
                alt={users[comment.userId as keyof typeof users] || 'Usuario'}
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span className="font-semibold text-black">{users[comment.userId as keyof typeof users] || 'Usuario'}</span>
              <span className="text-gray-500 text-sm">hace {Math.floor((Date.now() - comment.createdAt.getTime()) / (24*60*60*1000))} días</span>
            </div>
            <div className="mb-2 text-gray-700">{comment.content}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>🔥 {aliens[comment.alienId as keyof typeof aliens]}</span>
            </div>
            <div className="flex gap-4 text-gray-600 text-sm mb-2">
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 font-semibold ${userLikes[comment.id] ? 'text-green-700' : 'hover:text-green-700 text-gray-600'}`}
                aria-pressed={userLikes[comment.id] ? 'true' : 'false'}
              >
                <span>{userLikes[comment.id] ? '💚' : '👍'}</span> {comment.likes}
              </button>
              <button onClick={() => handleShowReply(comment.id)} className="flex items-center gap-1 hover:text-green-700 font-semibold"><span>💬</span> {comment.replies?.length || 0} respuestas</button>
            </div>
            {/* Formulario de respuesta */}
            {replyTo === comment.id && (
              <form onSubmit={e => handleAddReply(e, comment.id)} className="mt-2 flex flex-col gap-2">
                <textarea
                  className="border rounded px-2 py-1 bg-gray-100 text-black placeholder-gray-500 font-medium"
                  placeholder="Escribe tu respuesta..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={2}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-semibold">Responder</button>
                  <button type="button" className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-semibold" onClick={() => setReplyTo(null)}>Cancelar</button>
                </div>
              </form>
            )}
            {/* Respuestas */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-2">
                {comment.replies.map((reply, ridx) => (
                  <div key={reply.id} className="bg-gray-50 rounded p-3 ml-4">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={userAvatars[reply.userId as keyof typeof userAvatars] || '/images/default-avatar.png'}
                        alt={users[reply.userId as keyof typeof users] || 'Usuario'}
                        className="w-7 h-7 rounded-full object-cover border border-gray-300"
                      />
                      <span className="font-semibold text-black">{users[reply.userId as keyof typeof users] || 'Usuario'}</span>
                      <span className="text-gray-500 text-xs">hace {Math.floor((Date.now() - reply.createdAt.getTime()) / (24*60*60*1000))} días</span>
                    </div>
                    <div className="mb-1 text-gray-700">{reply.content}</div>
                    <div className="flex gap-2 text-gray-600 text-xs">
                      <button
                        onClick={() => handleLike(reply.id)}
                        className={`flex items-center gap-1 font-semibold ${userLikes[reply.id] ? 'text-green-700' : 'hover:text-green-700 text-gray-600'}`}
                        aria-pressed={userLikes[reply.id] ? 'true' : 'false'}
                      >
                        <span>{userLikes[reply.id] ? '💚' : '👍'}</span> {reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComentariosPage; 