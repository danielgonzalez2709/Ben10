import React from 'react';
import { Alien } from '../../types/alien';
import AlienCard from './AlienCard';

interface AlienListProps {
  aliens: Alien[];
  onAlienClick: (alien: Alien) => void;
  onFavoriteToggle: (alienId: string) => void;
}

const AlienList: React.FC<AlienListProps> = ({ aliens, onAlienClick, onFavoriteToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {aliens.map((alien) => (
        <AlienCard
          key={alien.id}
          alien={alien}
          onClick={() => onAlienClick(alien)}
          onFavoriteToggle={() => onFavoriteToggle(alien.id)}
        />
      ))}
    </div>
  );
};

export default AlienList; 