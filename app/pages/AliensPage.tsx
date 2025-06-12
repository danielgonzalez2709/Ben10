import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aliens as initialAliens } from '../data/aliens';
import AlienList from '../components/aliens/AlienList';
import type { Alien } from '../types/alien';

const AliensPage: React.FC = () => {
  const [aliens, setAliens] = useState<Alien[]>(initialAliens);
  const navigate = useNavigate();

  const handleAlienClick = (alien: Alien) => {
    navigate(`/aliens/${alien.id}`);
  };

  const handleFavoriteToggle = (alienId: string) => {
    setAliens((prev) =>
      prev.map((alien) =>
        alien.id === alienId ? { ...alien, isFavorite: !alien.isFavorite } : alien
      )
    );
  };

  return (
    <AlienList
      aliens={aliens}
      onAlienClick={handleAlienClick}
      onFavoriteToggle={handleFavoriteToggle}
    />
  );
};

export default AliensPage; 