/* Concept 1 — History (Riwayat) */
function C1History({ go, txns }) {
  const K = window.KANTONGIN;
  const { rp, accounts, dayLabel } = K;
  const Icon = window.C1Icon;
  const { SEM } = window.C1;
  const { C1TxnRow, C1Card } = window;
  const R = React;

  const [typeF, setTypeF] = R.useState('all');
  const [acctF, setAcctF] = R.useState('all');
  const [q, setQ] = R.useState('');

  const filtered = txns.filter(t => {
    if (typeF !== 'all' && t.type !== typeF) return false;
    if (acctF !== 'all') {
      const hit = t.type === 'transfer' ? (t.from === acctF || t.to === acctF) : t.acct === acctF;
      if (!hit) return false;
    }
    if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  // group by date
  const groups = [];
  filtered.forEach(t => {
    let g = groups.find(x => x.date === t.date);
    if (!g) { g = { date: t.date, items: [] }; groups.push(g); }
    g.items.push(t);
  });

  const typeChips = [
    { id: 'all', label: 'Semua', c: 'var(--c1-primary)' },
    { id: 'income', label: 'Pemasukan', c: SEM.income },
    { id: 'expense', label: 'Pengeluaran', c: SEM.expense },
    { id: 'transfer', label: 'Transfer', c: SEM.transfer },
  ];

  const Chip = ({ on, color, children, onClick }) => (
    <button onClick={onClick} style={{
      flex: '0 0 auto', padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
      border: on ? `1.5px solid ${color}` : '1.5px solid var(--c1-line)',
      background: on ? color + '15' : 'var(--c1-card)', color: on ? color : 'var(--c1-muted)',
      fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap',
    }}>{children}</button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '58px 18px 10px', background: 'var(--c1-bg)' }}>
        <h1 style={{ margin: '0 0 14px', fontSize: 28, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.6 }}>Riwayat</h1>
        {/* search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 14, padding: '10px 13px', marginBottom: 12 }}>
          <Icon name="search" size={18} style={{ color: 'var(--c1-muted)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari transaksi" style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14.5, color: 'var(--c1-text)' }} />
        </div>
        {/* type filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {typeChips.map(c => <Chip key={c.id} on={typeF === c.id} color={c.c} onClick={() => setTypeF(c.id)}>{c.label}</Chip>)}
        </div>
        {/* account filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          <Chip on={acctF === 'all'} color="var(--c1-primary)" onClick={() => setAcctF('all')}>Semua Kantong</Chip>
          {accounts.map(a => <Chip key={a.id} on={acctF === a.id} color={`oklch(0.5 0.13 ${a.hue})`} onClick={() => setAcctF(a.id)}>{a.name}</Chip>)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 18px 118px' }}>
        {groups.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--c1-muted)', marginTop: 60, fontSize: 14 }}>Tidak ada transaksi yang cocok.</div>
        )}
        {groups.map(g => {
          const dayExpense = g.items.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          return (
            <div key={g.date} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '6px 4px 6px' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c1-muted)' }}>{dayLabel(g.date)}</span>
                {dayExpense > 0 && <span style={{ fontSize: 12, color: 'var(--c1-muted)' }}>−{rp(dayExpense)}</span>}
              </div>
              <C1Card pad={'4px 16px'}>
                {g.items.map((t, i) => (
                  <div key={t.id} style={{ borderTop: i ? '1px solid var(--c1-line)' : 'none' }}>
                    <C1TxnRow t={t} onClick={() => go('detail', t)} />
                  </div>
                ))}
              </C1Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.C1History = C1History;
