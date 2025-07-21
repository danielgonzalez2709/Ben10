import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialAliens = [
  { id: '1', name: 'Alien 1' },
  { id: '2', name: 'Alien 2' },
  { id: '3', name: 'Alien 3' },
];

export default function DragTest() {
  const [aliens, setAliens] = useState(initialAliens);

  return (
    <DragDropContext
      onDragEnd={result => {
        if (!result.destination) return;
        const items = Array.from(aliens);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        setAliens(items);
        console.log('Nuevo orden:', items.map(a => a.name));
      }}
      onDragStart={() => {
        console.log('Drag started');
      }}
    >
      <Droppable droppableId="test-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {aliens.map((alien, index) => (
              <Draggable key={alien.id} draggableId={alien.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      border: '1px solid #ccc',
                      margin: '8px',
                      padding: '8px',
                      background: '#fff'
                    }}
                  >
                    {alien.name}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 