import React from 'react';
import type { Alien } from '../../types/alien';

interface OmnitrixProps {
  activeAlien: Alien | null;
  onAlienSelect: (alien: Alien) => void;
}

const Omnitrix: React.FC<OmnitrixProps> = ({ activeAlien, onAlienSelect }) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Círculo exterior del Omnitrix */}
      <div className="absolute inset-0 rounded-full border-8 border-green-500 bg-black shadow-xl">
        {/* Círculo interior */}
        <div className="absolute inset-4 rounded-full border-4 border-green-400 bg-black">
          {/* Botón central con símbolo o imagen del alien */}
          <button
            onClick={() => activeAlien && onAlienSelect(activeAlien)}
            className="absolute inset-0 flex items-center justify-center focus:outline-none"
            aria-label={activeAlien ? `Ver a ${activeAlien.name}` : 'Activar Omnitrix'}
          >
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-green-300 hover:ring-green-100 transition-all">
              {activeAlien ? (
                <img 
                  src={activeAlien.image} 
                  alt={activeAlien.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-black font-bold">⚡</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Nombre del alien activo */}
      {activeAlien && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-md text-center text-sm font-semibold">
          {activeAlien.name}
        </div>
      )}
    </div>
  );
};

export default Omnitrix;
