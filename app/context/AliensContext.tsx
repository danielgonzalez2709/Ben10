import React, { createContext, useContext, useState } from 'react';
import { aliens as initialAliens } from '../data/aliens';
import type { Alien } from '../types/alien';

interface AliensContextType {
  aliens: Alien[];
  toggleFavorite: (id: string) => void;
  setAliens: React.Dispatch<React.SetStateAction<Alien[]>>;
}

const AliensContext = createContext<AliensContextType | undefined>(undefined);

export const useAliens = () => {
  const context = useContext(AliensContext);
  if (!context) throw new Error('useAliens debe usarse dentro de AliensProvider');
  return context;
};

export const AliensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aliens, setAliens] = useState<Alien[]>(initialAliens);

  const toggleFavorite = (id: string) => {
    setAliens(prev => prev.map(a => a.id === id ? { ...a, isFavorite: !a.isFavorite } : a));
  };

  return (
    <AliensContext.Provider value={{ aliens, toggleFavorite, setAliens }}>
      {children}
    </AliensContext.Provider>
  );
}; 