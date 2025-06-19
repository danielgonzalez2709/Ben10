import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienList from '../components/aliens/AlienList';
import AlienPopup from '../components/aliens/AlienPopup';
import type { Alien } from '../types/alien';

const AliensPage: React.FC = () => {
  const [aliens, setAliens] = useState<Alien[]>(initialAliens);
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments] = useState(initialComments);
  const navigate = useNavigate();

  const handleAlienClick = (alien: Alien) => {
    setSelectedAlien(alien);
    setIsModalOpen(true);
  };

  const handleFavoriteToggle = (alienId: string) => {
    setAliens((prev) =>
      prev.map((alien) =>
        alien.id === alienId ? { ...alien, isFavorite: !alien.isFavorite } : alien
      )
    );
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
        onFavoriteToggle={handleFavoriteToggle}
      />
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
    </>
  );
};

export default AliensPage; 