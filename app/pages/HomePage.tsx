import React, { useState } from 'react';
import { aliens as initialAliens } from '../data/aliens';

const tabs = [
  { label: 'Todos los Aliens', value: 'all' },
  { label: 'Favoritos', value: 'favorites' },
  { label: 'Lista de prioridad', value: 'priority' },
];

const HomePage: React.FC = () => {
  const [aliens] = useState(initialAliens);
  const [tab, setTab] = useState('all');
  const activeAlien = aliens[1]; // Demo: XLR8

  return (
    <div className="space-y-8">
      {/* Omnitrix Status y Alien Activo */}
      <div className="flex gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col items-center justify-center">
          <div className="w-40 h-40 rounded-full border-8 border-green-500 bg-black flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Alien Activo</div>
            <div className="text-2xl font-bold mb-2">{activeAlien.name}</div>
            <div className="text-gray-600 mb-2">El Omnitrix está listo para transformación<br/>(cooldown: 10 minutos)</div>
            <div className="flex gap-2 justify-center">
              <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Cambiar Alien</button>
              <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300">Ver Estadísticas</button>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${tab === t.value ? 'bg-white border-green-600 text-green-700' : 'bg-gray-200 border-transparent text-gray-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Aliens Disponibles */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-xl font-bold text-black">Aliens Disponibles</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm w-full sm:w-auto">Filtrar</button>
            <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm w-full sm:w-auto">Ordenar</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {aliens.map((alien) => (
            <div key={alien.id} className="bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-2 relative">
              {alien.isFavorite && (
                <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">
                  ★
                </span>
              )}
              <div className="h-24 bg-gray-200 rounded mb-2" />
              <div className="font-bold text-lg text-black">{alien.name}</div>
              <div className="text-gray-500 text-sm mb-2">Usado {alien.stats.usageCount} veces</div>
              <div className="flex gap-2 mt-auto flex-col sm:flex-row">
                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">Ver</button>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">Activar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 