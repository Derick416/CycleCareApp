import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUsername } from './UsernameContext';
import { loadAccounts, saveAccounts } from './AccountStorage';

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
  const { username } = useUsername();
  const [entries, setEntries] = useState<CycleEntry[]>([]);

  useEffect(() => {
    const loadEntriesForUser = async () => {
      if (!username) {
        setEntries([]);
        return;
      }
      const store = await loadAccounts();
      const account = store.accounts.find((item) => item.username === username);
      setEntries(account?.entries ?? []);
    };
    loadEntriesForUser();
  }, [username]);

  const persistEntriesForUser = async (nextEntries: CycleEntry[]) => {
    if (!username) return;
    const store = await loadAccounts();
    const accounts = store.accounts.map((item) =>
      item.username === username ? { ...item, entries: nextEntries } : item
    );
    await saveAccounts({ ...store, accounts });
  };

  const addEntry = (entry: CycleEntry) => {
    setEntries((prev) => {
      const next = [entry, ...prev];
      persistEntriesForUser(next);
      return next;
    });
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persistEntriesForUser(next);
      return next;
    });
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
