import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienDetail from '../components/aliens/AlienDetail';
import type { Alien } from '../types/alien';
import type { Comment } from '../types/comment';

const AlienDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aliens] = useState<Alien[]>(initialAliens);
  const [comments, setComments] = useState<Comment[]>(initialComments.filter(c => c.alienId === id));

  const alien = aliens.find(a => a.id === id);

  if (!alien) {
    return <div className="p-8">Alien no encontrado. <button onClick={() => navigate(-1)} className="text-green-600 underline">Volver</button></div>;
  }

  // Funciones dummy para comentarios (puedes implementar lógica real si lo deseas)
  const onFavoriteToggle = () => {};
  const onAddComment = (content: string, parentId?: string) => {};
  const onLikeComment = (commentId: string) => {};
  const onEditComment = (commentId: string, content: string) => {};
  const onDeleteComment = (commentId: string) => {};

  return (
    <AlienDetail
      alien={alien}
      comments={comments}
      onFavoriteToggle={onFavoriteToggle}
      onAddComment={onAddComment}
      onLikeComment={onLikeComment}
      onEditComment={onEditComment}
      onDeleteComment={onDeleteComment}
    />
  );
};

export default AlienDetailPage; 