import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  Account,
  AccountId,
  Budget,
  Transaction,
  accounts as seedAccounts,
  budgets as seedBudgets,
  transactions as seedTxns,
} from '@/data/kantongin';

const STORAGE_KEY = 'kantongin:v1';
const CHUNK_SIZE = 1900; // SecureStore limit is 2048 bytes per item

type Balances = Record<AccountId, number>;

const seedBalances: Balances = Object.fromEntries(
  seedAccounts.map((a) => [a.id, a.balance])
) as Balances;

function applyTxn(b: Balances, t: Transaction, sign: 1 | -1): Balances {
  const next = { ...b };
  if (t.type === 'income') {
    next[t.acct] = (next[t.acct] ?? 0) + sign * t.amount;
  } else if (t.type === 'expense') {
    next[t.acct] = (next[t.acct] ?? 0) - sign * t.amount;
  } else if (t.type === 'transfer') {
    next[t.from] = (next[t.from] ?? 0) - sign * t.amount;
    next[t.to] = (next[t.to] ?? 0) + sign * t.amount;
  }
  return next;
}

async function secureSetJSON(data: object): Promise<void> {
  const str = JSON.stringify(data);
  const n = Math.ceil(str.length / CHUNK_SIZE);
  await SecureStore.setItemAsync(`${STORAGE_KEY}:n`, String(n));
  for (let i = 0; i < n; i++) {
    await SecureStore.setItemAsync(
      `${STORAGE_KEY}:${i}`,
      str.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    );
  }
}

async function secureGetJSON(): Promise<string | null> {
  const nStr = await SecureStore.getItemAsync(`${STORAGE_KEY}:n`);
  if (!nStr) return null;
  const n = parseInt(nStr, 10);
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const chunk = await SecureStore.getItemAsync(`${STORAGE_KEY}:${i}`);
    if (chunk === null) return null;
    parts.push(chunk);
  }
  return parts.join('');
}

interface KantonginState {
  txns: Transaction[];
  addTxn: (t: Transaction) => void;
  updateTxn: (t: Transaction) => void;
  deleteTxn: (id: string) => void;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  accounts: Account[];
  addAccount: (a: Account) => void;
  deleteAccount: (id: string) => void;
  accountBalances: Balances;
  totalBalance: number;
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
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [accountBalances, setAccountBalances] = useState<Balances>(seedBalances);
  const [hidden, setHidden] = useState(false);
  const [guest, setGuest] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let raw = await secureGetJSON();
        if (!raw) {
          // Migrate from AsyncStorage if it exists (one-time upgrade path)
          const legacy = await AsyncStorage.getItem(STORAGE_KEY);
          if (legacy) {
            raw = legacy;
            await secureSetJSON(JSON.parse(legacy));
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
        if (raw) {
          const d = JSON.parse(raw);
          if (Array.isArray(d.txns)) setTxns(d.txns);
          if (Array.isArray(d.budgets)) setBudgets(d.budgets);
          if (Array.isArray(d.accounts)) setAccounts(d.accounts);
          if (typeof d.onboarded === 'boolean') setOnboarded(d.onboarded);
          if (typeof d.guest === 'boolean') setGuest(d.guest);
          if (d.accountBalances && typeof d.accountBalances === 'object') setAccountBalances(d.accountBalances);
        }
      } catch {
        // fall back to seed data
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    secureSetJSON({ txns, budgets, accounts, onboarded, guest, accountBalances }).catch(() => {});
  }, [hydrated, txns, budgets, onboarded, guest, accountBalances]);

  const totalBalance = useMemo(() => Object.values(accountBalances).reduce((s, v) => s + v, 0), [accountBalances]);

  const value = useMemo<KantonginState>(
    () => ({
      txns,
      addTxn: (t) => {
        setTxns((prev) => [t, ...prev]);
        setAccountBalances((prev) => applyTxn(prev, t, 1));
      },
      updateTxn: (t) => {
        const old = txns.find((x) => x.id === t.id);
        setAccountBalances((prev) => {
          const reversed = old ? applyTxn(prev, old, -1) : prev;
          return applyTxn(reversed, t, 1);
        });
        setTxns((prev) => prev.map((x) => (x.id === t.id ? t : x)));
      },
      deleteTxn: (id) => {
        const t = txns.find((x) => x.id === id);
        if (t) setAccountBalances((prev) => applyTxn(prev, t, -1));
        setTxns((prev) => prev.filter((x) => x.id !== id));
      },
      budgets,
      setBudgets,
      accounts,
      addAccount: (a) => setAccounts((prev) => [...prev, a]),
      deleteAccount: (id) => setAccounts((prev) => prev.filter((a) => a.id !== id)),
      accountBalances,
      totalBalance,
      hidden,
      setHidden,
      guest,
      setGuest,
      onboarded,
      setOnboarded,
    }),
    [txns, budgets, accounts, accountBalances, totalBalance, hidden, guest, onboarded],
  );

  if (!hydrated) return null;
  return <KantonginContext.Provider value={value}>{children}</KantonginContext.Provider>;
}

export function useKantongin(): KantonginState {
  const ctx = useContext(KantonginContext);
  if (!ctx) throw new Error('useKantongin must be used within KantonginProvider');
  return ctx;
}
