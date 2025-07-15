import React, { createContext, useContext, useState } from 'react';
import { worksMap } from '../data/works';
import { ArchitecturalWork } from '../types/models';

interface SelectionContextProps {
  selected: ArchitecturalWork[];
  toggleSelection: (work: ArchitecturalWork) => void;
  clearSelection: () => void;
  setSelection: (works: ArchitecturalWork[]) => void;
}

const SelectionContext = createContext<SelectionContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be inside SelectionProvider');
  return ctx;
};

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [selected, setSelected] = useState<ArchitecturalWork[]>(() => {
    const params = new URLSearchParams(window.location.search);
    const worksParam = params.get('works');
    if (worksParam) {
      const ids = worksParam.split(',');
      return ids.map(id => worksMap[id]).filter(Boolean) as ArchitecturalWork[];
    }
    return [];
  });

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

  const setSelection = (works: ArchitecturalWork[]) => {
    setSelected(works);
  };

  return (
    <SelectionContext.Provider value={{ selected, toggleSelection, clearSelection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
