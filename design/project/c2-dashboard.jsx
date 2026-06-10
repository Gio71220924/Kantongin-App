/* Concept 2 — Dashboard (Neo-Brutalism) */
function C2Dashboard({ go, txns, hidden, setHidden, guest }) {
  const K = window.KANTONGIN;
  const { rp, accounts, summary, byCategory, cat, totalBalance } = K;
  const Icon = window.C2Icon;
  const { SEM, CAT_COLOR, SH, mono } = window.C2;
  const { C2Block, C2AccountBlock, C2TxnRow, C2BarRows, C2Head } = window;

  const catRows = byCategory.slice(0, 4).map(b => ({ label: cat(b.id).label, value: b.amount, color: CAT_COLOR[b.id] }));
  const recent = txns.slice(0, 4);

  return (
    <div style={{ padding: '54px 16px 120px', background: 'var(--c2-bg)', minHeight: '100%' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, lineHeight: 1 }}>KANTONGIN</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--c2-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 }}>● {accounts.length} kantong aktif</div>
        </div>
        <button onClick={() => go('settings')} style={{ width: 44, height: 44, background: 'var(--c2-teal)', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, color: '#111', fontWeight: 900, fontSize: 18, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{guest ? <Icon name="user" size={22} stroke={2.8} /> : 'S'}</button>
      </div>

      {/* balance */}
      <div style={{ background: 'var(--c2-yellow)', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 'var(--c2-radius)', boxShadow: SH, padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Saldo — Semua Kantong</span>
          <button onClick={() => setHidden(h => !h)} style={{ width: 30, height: 30, background: '#fff', border: '2.5px solid #111', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
            <Icon name={hidden ? 'eyeoff' : 'eye'} size={16} stroke={2.6} />
          </button>
        </div>
        <div style={{ ...mono, fontSize: 34, fontWeight: 700, color: '#111', letterSpacing: -1.5, marginTop: 6 }}>
          {hidden ? 'Rp•••••••' : rp(totalBalance)}
        </div>
      </div>

      {/* accounts grid */}
      <C2Head title="Kantong Saya" action="Kelola" onAction={() => go('settings')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
        {accounts.map(a => <C2AccountBlock key={a.id} a={a} onClick={() => go('analytics')} />)}
      </div>

      {/* summary */}
      <C2Head title={`Bulan Ini · ${summary.month}`} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <C2Block color="var(--c2-teal)" pad={13} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3 }}>↑ Masuk</div>
          <div style={{ ...mono, fontSize: 15, fontWeight: 700, marginTop: 5, letterSpacing: -0.5 }}>{rp(summary.income)}</div>
        </C2Block>
        <C2Block color="var(--c2-orange)" pad={13} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3 }}>↓ Keluar</div>
          <div style={{ ...mono, fontSize: 15, fontWeight: 700, marginTop: 5, letterSpacing: -0.5 }}>{rp(summary.expense)}</div>
        </C2Block>
      </div>
      {/* transfer block with stamp */}
      <C2Block color="var(--c2-purple)" style={{ marginBottom: 22, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: '#fff', color: 'var(--c2-purple)', border: '2.5px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="swap" size={22} stroke={2.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3 }}>Transfer Antar Kantong</div>
            <div style={{ ...mono, fontSize: 18, fontWeight: 700, marginTop: 2 }}>{rp(summary.transfer)}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, background: 'var(--c2-yellow)', color: '#111', border: '2.5px solid #111', borderRadius: 5, padding: '6px 10px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <Icon name="close" size={13} stroke={3} /> Bukan Pengeluaran
        </div>
      </C2Block>

      {/* spending by category */}
      <C2Head title="Pengeluaran / Kategori" action="Anggaran" onAction={() => go('budget')} />
      <C2Block style={{ marginBottom: 22 }}>
        <C2BarRows rows={catRows} />
      </C2Block>

      {/* recent */}
      <C2Head title="Transaksi Terbaru" action="Lihat Semua" onAction={() => go('history')} />
      <C2Block pad={'2px 14px'}>
        {recent.map((t, i) => <C2TxnRow key={t.id} t={t} onClick={() => go('detail', t)} last={i === recent.length - 1} />)}
      </C2Block>
    </div>
  );
}
window.C2Dashboard = C2Dashboard;
