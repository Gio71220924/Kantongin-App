/* Concept 2 — History (Neo-Brutalism) */
function C2History({ go, txns }) {
  const K = window.KANTONGIN;
  const { rp, accounts, dayLabel } = K;
  const Icon = window.C2Icon;
  const { SEM, mono } = window.C2;
  const { C2Block, C2TxnRow } = window;
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
  const groups = [];
  filtered.forEach(t => { let g = groups.find(x => x.date === t.date); if (!g) { g = { date: t.date, items: [] }; groups.push(g); } g.items.push(t); });

  const typeChips = [
    { id: 'all', label: 'Semua', c: 'var(--c2-ink)' },
    { id: 'income', label: 'Masuk', c: SEM.income },
    { id: 'expense', label: 'Keluar', c: SEM.expense },
    { id: 'transfer', label: 'Transfer', c: SEM.transfer },
  ];
  const Chip = ({ on, color, white, children, onClick }) => (
    <button onClick={onClick} style={{
      flex: '0 0 auto', padding: '7px 13px', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 5,
      border: '2.5px solid var(--c2-ink)', background: on ? color : 'var(--c2-paper)',
      color: on && white ? '#fff' : '#111', fontWeight: 800, fontSize: 12.5, whiteSpace: 'nowrap',
      textTransform: 'uppercase', letterSpacing: 0.2, boxShadow: on ? '2px 2px 0 var(--c2-ink)' : 'none',
    }}>{children}</button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)' }}>
      <div style={{ padding: '54px 16px 10px' }}>
        <h1 style={{ margin: '0 0 14px', fontSize: 30, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, textTransform: 'uppercase' }}>Riwayat</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--c2-paper)', border: '3px solid var(--c2-ink)', borderRadius: 6, padding: '9px 12px', marginBottom: 12 }}>
          <Icon name="search" size={18} stroke={2.8} style={{ color: '#111' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="CARI TRANSAKSI" style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--c2-ink)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 9, scrollbarWidth: 'none' }}>
          {typeChips.map(c => <Chip key={c.id} on={typeF === c.id} color={c.c} white={c.id === 'transfer'} onClick={() => setTypeF(c.id)}>{c.label}</Chip>)}
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          <Chip on={acctF === 'all'} color="var(--c2-yellow)" onClick={() => setAcctF('all')}>Semua Kantong</Chip>
          {accounts.map(a => <Chip key={a.id} on={acctF === a.id} color={window.C2.ACCT_COLOR[a.id]} white={a.id === 'bca'} onClick={() => setAcctF(a.id)}>{a.name}</Chip>)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 16px 120px' }}>
        {groups.length === 0 && <div style={{ textAlign: 'center', color: 'var(--c2-muted)', marginTop: 60, fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>Tidak ada hasil</div>}
        {groups.map(g => {
          const dayExpense = g.items.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          return (
            <div key={g.date} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--c2-ink)', color: '#fff', padding: '6px 12px', borderRadius: 5, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.4 }}>{dayLabel(g.date)}</span>
                {dayExpense > 0 && <span style={{ ...mono, fontSize: 12, fontWeight: 700 }}>−{rp(dayExpense)}</span>}
              </div>
              <C2Block pad={'2px 14px'}>
                {g.items.map((t, i) => <C2TxnRow key={t.id} t={t} onClick={() => go('detail', t)} last={i === g.items.length - 1} />)}
              </C2Block>
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.C2History = C2History;
