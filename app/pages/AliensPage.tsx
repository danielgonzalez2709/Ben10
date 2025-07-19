import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienList from '../components/aliens/AlienList';
import AlienPopup from '../components/aliens/AlienPopup';
import type { Alien } from '../types/alien';
import { useAliens } from '../context/AliensContext';

const AliensPage: React.FC = () => {
  const { aliens, toggleFavorite } = useAliens();
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isModalOpen && selectedAlien) {
      fetch(`/api/comments?alienId=${selectedAlien.id}`)
        .then(res => res.json())
        .then(data => setComments(data));
    } else {
      setComments([]);
    }
  }, [isModalOpen, selectedAlien]);

  const handleAlienClick = (alien: Alien) => {
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
    <>
      <AlienList
        aliens={aliens}
        onAlienClick={handleAlienClick}
        onFavoriteToggle={toggleFavorite}
      />
      <AlienPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        alien={selectedAlien}
        comments={filteredComments}
        onFavoriteToggle={() => selectedAlien && toggleFavorite(selectedAlien.id)}
        onAddComment={onAddComment}
        onLikeComment={onLikeComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
      />
    </>
  );
};

export default AliensPage; 