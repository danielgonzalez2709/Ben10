import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { Alien } from '../../types/alien';

interface FavoriteListProps {
  favorites: Alien[];
  onReorder: (result: any) => void;
  onRemove: (alienId: string) => void;
}

const FavoriteList: React.FC<FavoriteListProps> = ({ favorites, onReorder, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold mb-4">Aliens Favoritos</h2>
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="favorites">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {favorites.map((alien, index) => (
                <Draggable
                  key={alien.id}
                  draggableId={alien.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">{index + 1}</span>
                        <img
                          src={alien.image}
                          alt={alien.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">{alien.name}</span>
                      </div>
                      <button
                        onClick={() => onRemove(alien.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default FavoriteList; 