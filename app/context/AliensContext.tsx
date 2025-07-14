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
  const [aliens, setAliens] = useState<Alien[]>([]); // Estado inicial vacío
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Función para cargar aliens desde el backend
  const fetchAliens = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/aliens');
      const data = await res.json();
      setAliens(data);
    } catch (err) {
      // Opcional: manejar error
    }
  };

  // Polling cada 3 segundos
  useEffect(() => {
    fetchAliens(); // Carga inicial
    pollingRef.current = setInterval(fetchAliens, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    setAliens(prev => prev.map(a => a.id === id ? { ...a, isFavorite: !a.isFavorite } : a));
  };

  const activateAlien = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/aliens/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        // Actualizar el estado local inmediatamente
        setAliens(prev => prev.map(a => ({ ...a, isActive: a.id === id })));
      }
      // Refrescar desde el backend después de un pequeño delay
      setTimeout(fetchAliens, 300);
    } catch (err) {
      // Opcional: manejar error
    }
  };

  return (
    <AliensContext.Provider value={{ aliens, toggleFavorite, setAliens, activateAlien }}>
      {children}
    </AliensContext.Provider>
  );
}; 