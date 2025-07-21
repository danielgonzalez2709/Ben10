// AliensContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Alien } from '../types/alien';

interface AliensContextType {
  aliens: Alien[];
  toggleFavorite: (id: string) => void;
  setAliens: React.Dispatch<React.SetStateAction<Alien[]>>;
  activateAlien: (id: string) => void;
}

const AliensContext = createContext<AliensContextType | undefined>(undefined);

export const useAliens = () => {
  const context = useContext(AliensContext);
  if (!context) throw new Error('useAliens debe usarse dentro de AliensProvider');
  return context;
};

export const AliensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAliens = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/aliens');
      const data = await res.json();
      setAliens(data);
    } catch (err) {
      console.error('Error al cargar aliens:', err);
    }
  };

  useEffect(() => {
    fetchAliens(); // carga inicial
    pollingRef.current = setInterval(fetchAliens, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const toggleFavorite = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado para marcar favorito');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/aliens/${id}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        console.warn('No se pudo cambiar favorito:', error.message || error.error);
        return;
      }

      // Refrescar la lista de aliens después de cambiar favorito
      await fetchAliens();
      
      // Emitir evento para que otras páginas se actualicen
      window.dispatchEvent(new CustomEvent('aliens:refresh'));
    } catch (err) {
      console.error('Error al cambiar favorito:', err);
    }
  };

  const activateAlien = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const res = await fetch(`http://localhost:3001/api/aliens/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        console.warn('No se pudo activar el alien:', error.message || error.error);
        return;
      }

      // Recarga los aliens desde backend para obtener el real isActive actualizado
      await fetchAliens();
    } catch (err) {
      console.error('Error al activar alien:', err);
    }
  };

  return (
    <AliensContext.Provider value={{ aliens, toggleFavorite, setAliens, activateAlien }}>
      {children}
    </AliensContext.Provider>
  );
};
