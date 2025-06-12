import React from 'react';
import type { AlienStats as AlienStatsType } from '../../types/alien';

interface AlienStatsProps {
  stats: AlienStatsType;
}

const AlienStats: React.FC<AlienStatsProps> = ({ stats }) => {
  const renderStatBar = (value: number, label: string) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${(value / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Estadísticas</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Veces usado</p>
          <p className="text-2xl font-bold">{stats.usageCount}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Tiempo promedio</p>
          <p className="text-2xl font-bold">{stats.averageUsageTime} min</p>
        </div>
      </div>

      {renderStatBar(stats.strength, 'Fuerza')}
      {renderStatBar(stats.speed, 'Velocidad')}

      <div className="mt-6">
        <h4 className="font-medium mb-2">Habilidades</h4>
        <div className="flex flex-wrap gap-2">
          {stats.abilities.map((ability, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {ability}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Comentarios recibidos</p>
        <p className="text-2xl font-bold">{stats.commentCount}</p>
      </div>
    </div>
  );
};

export default AlienStats; 