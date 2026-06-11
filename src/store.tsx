/**
 * App-wide state for Kantongin (transactions, budgets, balance visibility,
 * guest mode, onboarding). Persisted to AsyncStorage so data survives reloads.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  Budget,
  Transaction,
  budgets as seedBudgets,
  transactions as seedTxns,
} from '@/data/kantongin';

const STORAGE_KEY = 'kantongin:v1';

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
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
}

const KantonginContext = createContext<KantonginState | null>(null);

export function KantonginProvider({ children }: { children: React.ReactNode }) {
  const [txns, setTxns] = useState<Transaction[]>(seedTxns);
  const [budgets, setBudgets] = useState<Budget[]>(seedBudgets);
  const [hidden, setHidden] = useState(false);
  const [guest, setGuest] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          if (Array.isArray(d.txns)) setTxns(d.txns);
          if (Array.isArray(d.budgets)) setBudgets(d.budgets);
          if (typeof d.onboarded === 'boolean') setOnboarded(d.onboarded);
          if (typeof d.guest === 'boolean') setGuest(d.guest);
        }
      } catch {
        // ignore corrupt/missing storage — fall back to seed data
      }
      setHydrated(true);
    })();
  }, []);

  // Persist whenever durable state changes (after the initial load).
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ txns, budgets, onboarded, guest })).catch(() => {});
  }, [hydrated, txns, budgets, onboarded, guest]);

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
      onboarded,
      setOnboarded,
    }),
    [txns, budgets, hidden, guest, onboarded],
  );

  // Avoid a flash of the wrong screen (e.g. onboarding) before storage loads.
  if (!hydrated) return null;

  return <KantonginContext.Provider value={value}>{children}</KantonginContext.Provider>;
}

export function useKantongin(): KantonginState {
  const ctx = useContext(KantonginContext);
  if (!ctx) throw new Error('useKantongin must be used within KantonginProvider');
  return ctx;
}
