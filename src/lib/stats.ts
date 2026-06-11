import { AccountId, CategoryId, Transaction } from '@/data/kantongin';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function ym(t: Transaction): string {
  return t.date.slice(0, 7);
}

export function currentYM(): string {
  return new Date().toISOString().slice(0, 7);
}

export function ymLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split('-');
  return MONTH_LABELS[parseInt(m) - 1] + ' ' + y;
}

export function computeSummary(txns: Transaction[], yearMonth: string) {
  const month = txns.filter((t) => ym(t) === yearMonth);
  return {
    income: month.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expense: month.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    transfer: month.filter((t) => t.type === 'transfer').reduce((s, t) => s + t.amount, 0),
    month: ymLabel(yearMonth),
  };
}

export function computeByCategory(txns: Transaction[], yearMonth: string): { id: CategoryId; amount: number }[] {
  const map = new Map<CategoryId, number>();
  for (const t of txns) {
    if (ym(t) === yearMonth && t.type === 'expense') {
      map.set(t.cat, (map.get(t.cat) ?? 0) + t.amount);
    }
  }
  return [...map.entries()].map(([id, amount]) => ({ id, amount })).sort((a, b) => b.amount - a.amount);
}

export function computeByAccount(txns: Transaction[], yearMonth: string): { id: AccountId; amount: number }[] {
  const map = new Map<AccountId, number>();
  for (const t of txns) {
    if (ym(t) === yearMonth && t.type === 'expense') {
      map.set(t.acct, (map.get(t.acct) ?? 0) + t.amount);
    }
  }
  return [...map.entries()].map(([id, amount]) => ({ id, amount })).sort((a, b) => b.amount - a.amount);
}

export function computeTrend(txns: Transaction[]): { m: string; ym: string; expense: number; transfer: number }[] {
  const map = new Map<string, { expense: number; transfer: number }>();
  for (const t of txns) {
    const key = ym(t);
    if (!map.has(key)) map.set(key, { expense: 0, transfer: 0 });
    const e = map.get(key)!;
    if (t.type === 'expense') e.expense += t.amount;
    else if (t.type === 'transfer') e.transfer += t.amount;
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, data]) => ({ m: MONTH_LABELS[parseInt(key.slice(5)) - 1], ym: key, ...data }));
}
