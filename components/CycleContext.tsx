import React, { createContext, useContext, useState } from 'react';

export type CycleEntry = {
  id: string;
  periodStart: string;        // ISO date string
  nextPeriod: string;         // ISO date string
  savedAt: string;            // ISO date string
  markedDates: Record<string, any>;
};

type CycleContextType = {
  entries: CycleEntry[];
  addEntry: (entry: CycleEntry) => void;
  removeEntry: (id: string) => void;
  latestEntry: CycleEntry | null;
};

const CycleContext = createContext<CycleContextType>({
  entries: [],
  addEntry: () => {},
  removeEntry: () => {},
  latestEntry: null,
});

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CycleEntry[]>([]);

  const addEntry = (entry: CycleEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const latestEntry = entries.length > 0 ? entries[0] : null;

  return (
    <CycleContext.Provider value={{ entries, addEntry, removeEntry, latestEntry }}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  return useContext(CycleContext);
}
