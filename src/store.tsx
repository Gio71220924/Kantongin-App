import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  Account,
  AccountId,
  Budget,
  Transaction,
  accounts as seedAccounts,
  budgets as seedBudgets,
  transactions as seedTxns,
} from '@/data/kantongin';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'kantongin:v1';
const CHUNK_SIZE = 1900;

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

// ── Supabase sync helpers (fire-and-forget) ──────────────────

function syncUpsertTxn(userId: string, t: Transaction) {
  supabase.from('transactions').upsert({
    id: t.id, user_id: userId, type: t.type, amount: t.amount,
    title: t.title, date: t.date, time: t.time,
    acct: t.type !== 'transfer' ? t.acct : null,
    cat: t.type !== 'transfer' ? t.cat : null,
    from: t.type === 'transfer' ? t.from : null,
    to: t.type === 'transfer' ? t.to : null,
  }).then(() => {});
}

function syncDeleteTxn(txnId: string) {
  supabase.from('transactions').delete().eq('id', txnId).then(() => {});
}

function syncUpsertAccount(userId: string, a: Account) {
  supabase.from('accounts').upsert({
    id: a.id, user_id: userId, name: a.name,
    kind: a.kind ?? '', last4: a.last4 ?? '', balance: a.balance, hue: a.hue,
  }).then(() => {});
}

function syncDeleteAccount(acctId: string) {
  supabase.from('accounts').delete().eq('id', acctId).then(() => {});
}

function syncUpsertBudgets(userId: string, buds: Budget[]) {
  if (!buds.length) return;
  supabase.from('budgets').upsert(
    buds.map((b) => ({ id: b.id, user_id: userId, limit: b.limit }))
  ).then(() => {});
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
  initUserData: (accts: Account[], bals: Balances) => void;
  accountBalances: Balances;
  totalBalance: number;
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  guest: boolean;
  setGuest: (g: boolean) => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);

  // ── Local hydration ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        let raw = await secureGetJSON();
        if (!raw) {
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

  // ── Supabase auth listener ───────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadFromSupabase(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadFromSupabase(u.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFromSupabase = useCallback(async (userId: string) => {
    const [{ data: accts }, { data: txnsData }, { data: budgetsData }] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId),
      supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('budgets').select('*').eq('user_id', userId),
    ]);

    if (accts && accts.length > 0) {
      const mappedAccts: Account[] = accts.map((a) => ({
        id: a.id, name: a.name, kind: a.kind, last4: a.last4, balance: a.balance, hue: a.hue,
      }));
      const bals = Object.fromEntries(mappedAccts.map((a) => [a.id, a.balance])) as Balances;
      setAccounts(mappedAccts);
      setAccountBalances(bals);
      setOnboarded(true);
    }

    if (txnsData) {
      const mappedTxns: Transaction[] = txnsData.map((t) => {
        const base = { id: t.id, type: t.type, amount: t.amount, title: t.title ?? '', date: t.date, time: t.time ?? '00:00' };
        if (t.type === 'transfer') {
          return { ...base, type: 'transfer' as const, from: t.from ?? '', to: t.to ?? '' };
        }
        return { ...base, type: t.type as 'income' | 'expense', acct: t.acct ?? '', cat: t.cat ?? '' };
      });
      setTxns(mappedTxns);
    }

    if (budgetsData && budgetsData.length > 0) {
      setBudgets(budgetsData.map((b) => ({ id: b.id, limit: b.limit })));
    }
  }, []);

  // ── Local persistence ────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    secureSetJSON({ txns, budgets, accounts, onboarded, guest, accountBalances }).catch(() => {});
  }, [hydrated, txns, budgets, onboarded, guest, accountBalances]);

  const totalBalance = useMemo(() => Object.values(accountBalances).reduce((s, v) => s + v, 0), [accountBalances]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTxns([]);
    setAccounts(seedAccounts);
    setAccountBalances(seedBalances);
    setBudgets(seedBudgets);
    setOnboarded(false);
    setGuest(false);
  }, []);

  const value = useMemo<KantonginState>(
    () => ({
      txns,
      addTxn: (t) => {
        setTxns((prev) => [t, ...prev]);
        setAccountBalances((prev) => applyTxn(prev, t, 1));
        if (user) syncUpsertTxn(user.id, t);
      },
      updateTxn: (t) => {
        const old = txns.find((x) => x.id === t.id);
        setAccountBalances((prev) => {
          const reversed = old ? applyTxn(prev, old, -1) : prev;
          return applyTxn(reversed, t, 1);
        });
        setTxns((prev) => prev.map((x) => (x.id === t.id ? t : x)));
        if (user) syncUpsertTxn(user.id, t);
      },
      deleteTxn: (id) => {
        const t = txns.find((x) => x.id === id);
        if (t) setAccountBalances((prev) => applyTxn(prev, t, -1));
        setTxns((prev) => prev.filter((x) => x.id !== id));
        if (user) syncDeleteTxn(id);
      },
      budgets,
      setBudgets: (action) => {
        setBudgets((prev) => {
          const next = typeof action === 'function' ? action(prev) : action;
          if (user) syncUpsertBudgets(user.id, next);
          return next;
        });
      },
      accounts,
      addAccount: (a) => {
        setAccounts((prev) => [...prev, a]);
        if (user) syncUpsertAccount(user.id, a);
      },
      deleteAccount: (id) => {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        if (user) syncDeleteAccount(id);
      },
      initUserData: (accts, bals) => {
        setAccounts(accts);
        setAccountBalances(bals);
        setTxns([]);
        if (user) {
          accts.forEach((a) => syncUpsertAccount(user.id, a));
        }
      },
      accountBalances,
      totalBalance,
      hidden,
      setHidden,
      guest,
      setGuest,
      onboarded,
      setOnboarded,
      user,
      signOut: handleSignOut,
    }),
    [txns, budgets, accounts, accountBalances, totalBalance, hidden, guest, onboarded, user, handleSignOut],
  );

  if (!hydrated) return null;
  return <KantonginContext.Provider value={value}>{children}</KantonginContext.Provider>;
}

export function useKantongin(): KantonginState {
  const ctx = useContext(KantonginContext);
  if (!ctx) throw new Error('useKantongin must be used within KantonginProvider');
  return ctx;
}
