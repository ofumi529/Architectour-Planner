import React, { createContext, useContext, useState } from 'react';
import { ArchitecturalWork } from '../types/models';

interface SelectionContextProps {
  selected: ArchitecturalWork[];
  toggleSelection: (work: ArchitecturalWork) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextProps | undefined>(undefined);

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be inside SelectionProvider');
  return ctx;
};

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<ArchitecturalWork[]>([]);

  const toggleSelection = (work: ArchitecturalWork) => {
    setSelected((prev) => {
      const exists = prev.find((w) => w.id === work.id);
      if (exists) {
        return prev.filter((w) => w.id !== work.id);
      }
      return [...prev, work];
    });
  };

  const clearSelection = () => {
    setSelected([]);
  };

  return (
    <SelectionContext.Provider value={{ selected, toggleSelection, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
