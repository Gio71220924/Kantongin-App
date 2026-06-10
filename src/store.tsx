/**
 * App-wide state for Kantongin (transactions, budgets, balance visibility,
 * guest mode). Mirrors the design prototype's top-level App state, exposed
 * through context so any screen/route can read and mutate it.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

import {
  Budget,
  Transaction,
  budgets as seedBudgets,
  transactions as seedTxns,
} from '@/data/kantongin';

interface KantonginState {
  txns: Transaction[];
  addTxn: (t: Transaction) => void;
  updateTxn: (t: Transaction) => void;
  deleteTxn: (id: string) => void;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  guest: boolean;
  setGuest: (g: boolean) => void;
}

const KantonginContext = createContext<KantonginState | null>(null);

export function KantonginProvider({ children }: { children: React.ReactNode }) {
  const [txns, setTxns] = useState<Transaction[]>(seedTxns);
  const [budgets, setBudgets] = useState<Budget[]>(seedBudgets);
  const [hidden, setHidden] = useState(false);
  const [guest, setGuest] = useState(false);

  const value = useMemo<KantonginState>(
    () => ({
      txns,
      addTxn: (t) => setTxns((prev) => [t, ...prev]),
      updateTxn: (t) => setTxns((prev) => prev.map((x) => (x.id === t.id ? t : x))),
      deleteTxn: (id) => setTxns((prev) => prev.filter((x) => x.id !== id)),
      budgets,
      setBudgets,
      hidden,
      setHidden,
      guest,
      setGuest,
    }),
    [txns, budgets, hidden, guest],
  );

  return <KantonginContext.Provider value={value}>{children}</KantonginContext.Provider>;
}

export function useKantongin(): KantonginState {
  const ctx = useContext(KantonginContext);
  if (!ctx) throw new Error('useKantongin must be used within KantonginProvider');
  return ctx;
}
