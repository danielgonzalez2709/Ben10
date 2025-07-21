import React, { useState, useEffect } from 'react';
import { aliens as initialAliens } from '../data/aliens';
import { comments as initialComments } from '../data/comments';
import AlienPopup from '../components/aliens/AlienPopup';
import FavoriteList from '../components/favorites/FavoriteList';
import type { Alien } from '../types/alien';
import type { Comment } from '../types/comment';
import { useAliens } from '../context/AliensContext';

const FavoritesPage: React.FC = () => {
  const { aliens, toggleFavorite } = useAliens();
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperUser = user && user.isSuperUser;

  // Refrescar aliens desde backend
  const fetchAliens = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/aliens');
      const data = await res.json();
      // setAliens(data); // This line is removed as per the edit hint
    } catch (err) {
      // opcional: manejo de error
    }
  };

  useEffect(() => {
    // Escuchar evento para refrescar aliens globalmente
    const handler = () => {
      // No necesitamos fetchAliens aquí porque el contexto ya maneja el estado
      console.log('Aliens refreshed from context');
    };
    window.addEventListener('aliens:refresh', handler);
    return () => window.removeEventListener('aliens:refresh', handler);
  }, []);

  // Ordenar por prioridad
  const favorites = aliens.filter(a => a.isFavorite);
  const [priorityList, setPriorityList] = useState<Alien[]>(() =>
    [...favorites].sort((a, b) => a.priority - b.priority)
  );

  // Bandera para saber si se está arrastrando
  const [isDragging, setIsDragging] = useState(false);

  // Solo actualiza si cambia la cantidad de favoritos Y no se está arrastrando
  useEffect(() => {
    if (!isDragging) {
      setPriorityList(prev =>
        favorites.length !== prev.length
          ? [...favorites].sort((a, b) => a.priority - b.priority)
          : prev
      );
    }
    // Actualiza la bandera global para el polling
    (window as any).isAliensDragging = isDragging;
  }, [favorites, isDragging]);

  // Simular activar alien
  const handleActivate = (id: string) => {
    // Implementation needed
  };

  // Reordenar favoritos (drag & drop)
  const handleReorder = async (result: any) => {
    setIsDragging(false); // Al terminar el drag
    (window as any).isAliensDragging = false;
    if (!result.destination) return;
    const items = Array.from(priorityList);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPriorityList(items); // Solo actualiza el estado local para el drag

    // Log para depuración: mostrar el nuevo orden
    console.log('Nuevo orden de prioridad:', items.map(a => ({ id: a.id, name: a.name, priority: a.priority })));

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        items.map(async (alien, idx) => {
          console.log(`Enviando PUT a /api/aliens/${alien.id} con priority: ${idx + 1}`);
          const res = await fetch(`http://localhost:3001/api/aliens/${alien.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ priority: idx + 1 })
          });
          const data = await res.json().catch(() => ({}));
          console.log(`Respuesta backend para alien ${alien.id}:`, res.status, data);
        })
      );
      // Espera a que el backend termine y luego refresca el estado global (el contexto lo hará solo)
    } catch (err) {
      alert('Error al actualizar prioridades');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar de favoritos
  const handleRemoveFavorite = async (id: string) => {
    setLoading(true);
    await toggleFavorite(id); // El contexto refresca el estado global
    setLoading(false);
  };

  // Función para manejar la eliminación desde la lista de prioridad
  const handleRemove = async (id: string) => {
    setLoading(true);
    await toggleFavorite(id);
    setLoading(false);
  };

  const handleOpenModal = (alien: Alien) => {
    setSelectedAlien(alien);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlien(null);
  };

  // Funciones dummy para comentarios (puedes implementar lógica real si lo deseas)
  const onFavoriteToggle = () => {};
  const onAddComment = (content: string, parentId?: string) => {};
  const onLikeComment = (commentId: string) => {};
  const onEditComment = (commentId: string, content: string) => {};
  const onDeleteComment = (commentId: string) => {};

  const filteredComments = selectedAlien
    ? comments.filter((c) => c.alienId === selectedAlien.id)
    : [];

  return (
    <div className="space-y-8">
      {/* Mis Aliens Favoritos */}
 <section>
  <h2 className="text-xl font-bold mb-4 text-black">Mis Aliens Favoritos</h2>
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    {favorites.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 text-lg py-12 font-semibold">
        No hay ningún Alien agregado a la Lista de Favoritos
      </div>
    ) : favorites.map((alien) => (
      <div
        key={alien.id}
        className="bg-white rounded-lg shadow p-4 relative flex flex-col min-h-[300px] cursor-pointer w-full max-w-full"
        onClick={() => handleOpenModal(alien)}
      >
        {alien.isFavorite && (
          <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-yellow-100 rounded-full shadow text-yellow-400 text-xl">★</span>
        )}
        <div className="h-40 w-full bg-gray-100 rounded mb-4 border border-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={alien.image}
            alt={alien.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="font-bold text-lg text-black break-words truncate max-w-full text-center w-full">{alien.name}</div>
            <div className="text-gray-500 text-sm mb-4">
              Usado {alien.stats.usageCount} veces
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            {isSuperUser && (
              <button
                className="px-3 py-1 rounded text-sm bg-yellow-400 text-white w-full"
                onClick={e => { e.stopPropagation(); handleRemoveFavorite(alien.id); }}
              >
                Quitar de Favoritos
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
  <AlienPopup
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    alien={selectedAlien}
    comments={filteredComments}
    onFavoriteToggle={onFavoriteToggle}
    onAddComment={onAddComment}
    onLikeComment={onLikeComment}
    onEditComment={onEditComment}
    onDeleteComment={onDeleteComment}
  />
</section>

      {/* Lista de Prioridad */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-black">Lista de Prioridad</h2>
        <div>
          <FavoriteList
            favorites={priorityList}
            onReorder={isSuperUser ? handleReorder : undefined}
            onRemove={isSuperUser ? handleRemove : undefined}
            draggable={isSuperUser}
            setIsDragging={setIsDragging}
          />
        </div>
      </section>
      {/* Lista Drag & Drop (opcional, para gestión) */}
      {/* <FavoriteList favorites={favorites} onReorder={handleReorder} onRemove={handleRemove} /> */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-lg font-bold text-green-700">Guardando cambios...</div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 



