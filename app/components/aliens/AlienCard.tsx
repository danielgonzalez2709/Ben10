import React from 'react';
import type { Alien } from '../../types/alien';

interface AlienCardProps {
  alien: Alien;
  onClick: () => void;
  onFavoriteToggle: () => void;
}

const AlienCard: React.FC<AlienCardProps> = ({ alien, onClick, onFavoriteToggle }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={alien.image} 
          alt={alien.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
        >
          {alien.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{alien.name}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Fuerza: {alien.stats.strength}</span>
          <span>Velocidad: {alien.stats.speed}</span>
        </div>
      </div>
    </div>
  );
};

export default AlienCard; 