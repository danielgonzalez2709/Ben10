import React, { useState } from 'react';

interface FilterOptions {
  searchTerm: string;
  filterBy: 'all' | 'favorites' | 'active';
  sortBy: 'name' | 'strength' | 'speed' | 'usage' | 'priority';
  strengthRange: [number, number];
  speedRange: [number, number];
  abilities: string[];
}

interface AlienFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalAliens: number;
  filteredCount: number;
}

const AlienFilters: React.FC<AlienFiltersProps> = ({
  filters,
  onFiltersChange,
  totalAliens,
  filteredCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      filterBy: 'all',
      sortBy: 'name',
      strengthRange: [1, 10],
      speedRange: [1, 10],
      abilities: []
    });
  };

  const availableAbilities = [
    'Super Strength', 'Endurance', 'Hand-to-hand Combat',
    'Super Speed', 'Sharp Claws', 'Enhanced Reflexes',
    'Crystallization', 'Crystal Projection', 'Durability',
    'Fire Control', 'Flight', 'Heat Resistance',
    'Superior Intelligence', 'Technical Skill', 'Agility',
    'Underwater Breathing', 'Sharp Teeth', 'Swimming',
    'Slime Spit', 'Technomorphing', 'Regeneration',
    'Elasticity', 'Enhanced Senses', 'Climbing',
    'Intangibility', 'Invisibility', 'Possession',
    'Rolling', 'Impact Resistance', 'Plant Manipulation',
    'Stretching', 'Sonic Howl', 'Bandage Manipulation',
    'Flexibility', 'Electricity Manipulation'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header de filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</h3>
          <p className="text-sm text-gray-500">
            {filteredCount} de {totalAliens} aliens encontrados
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showAdvanced ? 'Filtros básicos' : 'Filtros avanzados'}
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar alien
          </label>
          <input
            id="search"
            type="text"
            placeholder="Nombre o habilidad..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="filter"
            value={filters.filterBy}
            onChange={(e) => updateFilter('filterBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos los aliens</option>
            <option value="favorites">Solo favoritos</option>
            <option value="active">Alien activo</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="name">Nombre</option>
            <option value="strength">Fuerza</option>
            <option value="speed">Velocidad</option>
            <option value="usage">Uso</option>
            <option value="priority">Prioridad</option>
          </select>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="space-y-6 pt-4 border-t border-gray-200">
          {/* Rangos de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rango de fuerza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Fuerza: {filters.strengthRange[0]} - {filters.strengthRange[1]}
              </label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filters.strengthRange[0]}
                  onChange={(e) => updateFilter('strengthRange', [parseInt(e.target.value), filters.strengthRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filters.strengthRange[1]}
                  onChange={(e) => updateFilter('strengthRange', [filters.strengthRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Rango de velocidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Velocidad: {filters.speedRange[0]} - {filters.speedRange[1]}
              </label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filters.speedRange[0]}
                  onChange={(e) => updateFilter('speedRange', [parseInt(e.target.value), filters.speedRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filters.speedRange[1]}
                  onChange={(e) => updateFilter('speedRange', [filters.speedRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Filtro por habilidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habilidades específicas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {availableAbilities.map((ability) => (
                <label key={ability} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.abilities.includes(ability)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateFilter('abilities', [...filters.abilities, ability]);
                      } else {
                        updateFilter('abilities', filters.abilities.filter(a => a !== ability));
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="truncate">{ability}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Habilidades seleccionadas */}
          {filters.abilities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades seleccionadas:
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.abilities.map((ability) => (
                  <span
                    key={ability}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"
                  >
                    {ability}
                    <button
                      onClick={() => updateFilter('abilities', filters.abilities.filter(a => a !== ability))}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resumen de filtros activos */}
      {(filters.searchTerm || filters.filterBy !== 'all' || filters.abilities.length > 0) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filtros activos:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Búsqueda: "{filters.searchTerm}"
              </span>
            )}
            {filters.filterBy !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {filters.filterBy === 'favorites' ? 'Solo favoritos' : 'Alien activo'}
              </span>
            )}
            {filters.abilities.length > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {filters.abilities.length} habilidad{filters.abilities.length > 1 ? 'es' : ''} seleccionada{filters.abilities.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlienFilters; 