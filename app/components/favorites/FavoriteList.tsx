import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { Alien } from '../../types/alien';

interface FavoriteListProps {
  favorites: Alien[];
  onReorder?: (result: any) => void;
  onRemove?: (alienId: string) => void;
  draggable?: boolean;
  setIsDragging?: (dragging: boolean) => void;
}

const FavoriteList: React.FC<FavoriteListProps> = ({ 
  favorites, 
  onReorder = () => {}, 
  onRemove, 
  draggable = true,
  setIsDragging
}) => {
  // Verificar si el usuario es superusuario
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperUser = user && user.isSuperUser;
  
  // Solo permitir drag and drop si es superusuario y draggable es true
  const canDrag = draggable && isSuperUser;

  if (!canDrag) {
    // Vista de solo lectura para usuarios normales
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay aliens en la lista de prioridad
            </div>
          ) : (
            favorites.map((alien, index) => (
              <div key={alien.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <img 
                    src={alien.image} 
                    alt={alien.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                  />
                  <div>
                    <span className="font-semibold text-gray-900">{alien.name}</span>
                    <div className="text-sm text-gray-500">
                      Usado {alien.stats.usageCount} veces
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Prioridad {index + 1}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Vista con drag and drop para superusuarios
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay aliens en la lista de prioridad
        </div>
      ) : (
        <DragDropContext
          onDragEnd={result => { console.log('DragEnd fired', result); onReorder(result); }}
          onDragStart={() => {
            if (setIsDragging) setIsDragging(true);
            (window as any).isAliensDragging = true;
            console.log('[FavoriteList] Drag started, isAliensDragging = true');
          }}
        >
          <Droppable droppableId="priority-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-3 transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-green-50 rounded-lg p-2' : ''
                }`}
              >
                {favorites.map((alien, index) => (
                  <Draggable
                    key={alien.id}
                    draggableId={String(alien.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between bg-white p-4 rounded-lg border-2 transition-all duration-200 ${
                          snapshot.isDragging 
                            ? 'border-green-400 shadow-xl scale-105 bg-green-50 z-50 rotate-2' 
                            : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Handle de arrastre */}
                          <div 
                            {...provided.dragHandleProps}
                            className="flex flex-col space-y-1 cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Arrastra para reordenar"
                          >
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                          
                          {/* Número de prioridad */}
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-bold text-sm">
                            {index + 1}
                          </div>
                          
                          {/* Avatar del alien */}
                          <img 
                            src={alien.image} 
                            alt={alien.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                          />
                          
                          {/* Información del alien */}
                          <div>
                            <span className="font-semibold text-gray-900">{alien.name}</span>
                            <div className="text-sm text-gray-500">
                              Usado {alien.stats.usageCount} veces
                            </div>
                          </div>
                        </div>
                        
                        {/* Botón de eliminar y prioridad */}
                        <div className="flex items-center space-x-3">
                          <div className="text-sm text-gray-400">
                            Prioridad {index + 1}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default FavoriteList; 
