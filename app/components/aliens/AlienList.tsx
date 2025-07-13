import React, { useState, useMemo } from 'react';
import { Alien } from '../../types/alien';
import AlienCard from './AlienCard';
import AlienFilters from './AlienFilters';

interface AlienListProps {
  aliens: Alien[];
  onAlienClick: (alien: Alien) => void;
  onFavoriteToggle: (alienId: string) => void;
}

interface FilterOptions {
  searchTerm: string;
  filterBy: 'all' | 'favorites' | 'active';
  sortBy: 'name' | 'strength' | 'speed' | 'usage' | 'priority';
  strengthRange: [number, number];
  speedRange: [number, number];
  abilities: string[];
}

const AlienList: React.FC<AlienListProps> = ({ aliens, onAlienClick, onFavoriteToggle }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    filterBy: 'all',
    sortBy: 'name',
    strengthRange: [1, 10],
    speedRange: [1, 10],
    abilities: []
  });

  const filteredAndSortedAliens = useMemo(() => {
    let filtered = aliens;

    // Aplicar filtros básicos
    if (filters.filterBy === 'favorites') {
      filtered = filtered.filter(alien => alien.isFavorite);
    } else if (filters.filterBy === 'active') {
      filtered = filtered.filter(alien => alien.isActive);
    }

    // Aplicar búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(alien =>
        alien.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        alien.stats.abilities.some(ability => 
          ability.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar filtros de rango
    filtered = filtered.filter(alien => 
      alien.stats.strength >= filters.strengthRange[0] &&
      alien.stats.strength <= filters.strengthRange[1] &&
      alien.stats.speed >= filters.speedRange[0] &&
      alien.stats.speed <= filters.speedRange[1]
    );

    // Aplicar filtros de habilidades
    if (filters.abilities.length > 0) {
      filtered = filtered.filter(alien =>
        filters.abilities.some(ability =>
          alien.stats.abilities.includes(ability)
        )
      );
    }

    // Aplicar ordenamiento
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'strength':
          return b.stats.strength - a.stats.strength;
        case 'speed':
          return b.stats.speed - a.stats.speed;
        case 'usage':
          return b.stats.usageCount - a.stats.usageCount;
        case 'priority':
          return a.priority - b.priority;
        default:
          return 0;
      }
    });
  }, [aliens, filters]);

  return (
    <div className="space-y-6">
      {/* Componente de filtros */}
      <AlienFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalAliens={aliens.length}
        filteredCount={filteredAndSortedAliens.length}
      />

      {/* Lista de aliens */}
      {filteredAndSortedAliens.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-8xl mb-6">👽</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No se encontraron aliens</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {filters.searchTerm 
              ? `No hay aliens que coincidan con "${filters.searchTerm}"`
              : 'No hay aliens que cumplan con los filtros seleccionados'
            }
          </p>
          <button
            onClick={() => setFilters({
              searchTerm: '',
              filterBy: 'all',
              sortBy: 'name',
              strengthRange: [1, 10],
              speedRange: [1, 10],
              abilities: []
            })}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          {/* Información de resultados */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aliens encontrados
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {filteredAndSortedAliens.length} resultado{filteredAndSortedAliens.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Total: {aliens.length}</span>
                <span>Favoritos: {aliens.filter(a => a.isFavorite).length}</span>
                <span>Activo: {aliens.filter(a => a.isActive).length}</span>
              </div>
            </div>
          </div>

          {/* Grid de aliens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedAliens.map((alien) => (
              <AlienCard
                key={alien.id}
                alien={alien}
                onClick={() => onAlienClick(alien)}
                onFavoriteToggle={() => onFavoriteToggle(alien.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AlienList; 