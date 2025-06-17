import React, { useState } from 'react';
import { aliens as initialAliens } from '../data/aliens';
import FavoriteList from '../components/favorites/FavoriteList';
import type { Alien } from '../types/alien';

const FavoritesPage: React.FC = () => {
  // Solo aliens favoritos
  const [favorites, setFavorites] = useState<Alien[]>(
    initialAliens.filter((a) => a.isFavorite)
  );

  // Ordenar por prioridad
  const priorityList = [...favorites].sort((a, b) => a.priority - b.priority);

  // Simular activar alien
  const handleActivate = (id: string) => {
    setFavorites((prev) =>
      prev.map((a) => ({ ...a, isActive: a.id === id }))
    );
  };

  // Reordenar favoritos (drag & drop)
  const handleReorder = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(favorites);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    // Actualizar prioridad
    setFavorites(
      items.map((a, i) => ({ ...a, priority: i + 1 }))
    );
  };

  // Eliminar de favoritos
  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Mis Aliens Favoritos */}
 <section>
  <h2 className="text-xl font-bold mb-4 text-black">Mis Aliens Favoritos</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    {favorites.map((alien) => (
      <div
        key={alien.id}
        className="bg-white rounded-lg shadow p-4 relative flex flex-col min-h-[300px]"
      >
        <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">
          ★
        </span>
        <div className="h-40 w-full bg-gray-100 rounded mb-4 border border-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={alien.image}
            alt={alien.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="font-bold text-lg text-black">{alien.name}</div>
            <div className="text-gray-500 text-sm mb-4">
              Usado {alien.stats.usageCount} veces
            </div>
          </div>
          <button
            className={`mt-auto px-3 py-1 rounded text-white ${
              alien.isActive ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={() => handleActivate(alien.id)}
          >
            {alien.isActive ? 'Activo' : 'Activar'}
          </button>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* Lista de Prioridad */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-black">Lista de Prioridad</h2>
        <div className="bg-white rounded-lg shadow p-4">
          {priorityList.map((alien, idx) => (
            <div key={alien.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center font-bold">{idx + 1}</span>
                <span className="font-bold text-black">{alien.name}</span>
              </div>
              <span className="text-gray-500 text-sm">Usado {alien.stats.usageCount} veces</span>
            </div>
          ))}
        </div>
      </section>
      {/* Lista Drag & Drop (opcional, para gestión) */}
      {/* <FavoriteList favorites={favorites} onReorder={handleReorder} onRemove={handleRemove} /> */}
    </div>
  );
};

export default FavoritesPage; 