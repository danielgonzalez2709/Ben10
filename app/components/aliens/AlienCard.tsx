import React from 'react';
import type { Alien } from '../../types/alien';

interface AlienCardProps {
  alien: Alien;
  onClick: () => void;
  onFavoriteToggle: () => void;
}

const AlienCard: React.FC<AlienCardProps> = ({ alien, onClick, onFavoriteToggle }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperUser = !!user?.isSuperUser;

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 group 
        ${alien.isActive ? 'ring-4 ring-green-400 bg-green-50 hover:scale-[1.03]' : 'bg-white hover:scale-[1.01]'} 
      `}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={alien.image}
          alt={alien.name}
          className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Botón de favorito solo para superusuarios */}
        {isSuperUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            aria-label={alien.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {alien.isFavorite ? '❤️' : '🤍'}
          </button>
        )}

        {/* Indicador de alien activo */}


        {/* Indicador de prioridad */}
        {typeof alien.priority === 'number' && alien.priority <= 3 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
            PRIORIDAD {alien.priority}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{alien.name}</h3>
          <span className="text-xs text-gray-500">#{alien.id}</span>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-red-500">💪</span>
            <div>
              <div className="font-medium text-gray-900">Fuerza</div>
              <div className="text-gray-600">{alien.stats.strength}/10</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">⚡</span>
            <div>
              <div className="font-medium text-gray-900">Velocidad</div>
              <div className="text-gray-600">{alien.stats.speed}/10</div>
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
          <span>Uso: {alien.stats.usageCount}</span>
          <span>Comentarios: {alien.stats.commentCount}</span>
        </div>

        {/* Habilidades principales */}
        <div className="flex flex-wrap gap-1">
          {alien.stats.abilities.slice(0, 2).map((ability, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
            >
              {ability}
            </span>
          ))}
          {alien.stats.abilities.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{alien.stats.abilities.length - 2} más
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlienCard;
