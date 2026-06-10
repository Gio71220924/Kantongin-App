/* Concept 2 — Budget per category (Neo-Brutalism) */
function C2Budget({ go, budgets, setBudgets }) {
  const K = window.KANTONGIN;
  const { rp, byCategory, cat } = K;
  const Icon = window.C2Icon;
  const { CAT_COLOR, glyphFor, SH, mono } = window.C2;
  const R = React;
  const [editing, setEditing] = R.useState(null);

  const spentOf = (id) => { const b = byCategory.find(x => x.id === id); return b ? b.amount : 0; };
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + spentOf(b.id), 0);
  const pctTotal = Math.min(100, Math.round((totalSpent / totalLimit) * 100));
  const overCount = budgets.filter(b => spentOf(b.id) > b.limit).length;
  const adjust = (id, delta) => setBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: Math.max(100000, b.limit + delta) } : b));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)' }}>
      <div style={{ padding: '54px 16px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => go('dashboard')} style={{ width: 40, height: 40, background: 'var(--c2-paper)', border: '3px solid var(--c2-ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Icon name="chevron" size={20} stroke={3} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, textTransform: 'uppercase' }}>Anggaran</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 120px' }}>
        {/* total */}
        <div style={{ background: 'var(--c2-yellow)', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 'var(--c2-radius)', boxShadow: SH, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 }}>Sisa anggaran bulan ini</div>
          <div style={{ ...mono, fontSize: 30, fontWeight: 700, color: '#111', letterSpacing: -1, marginTop: 4 }}>{rp(Math.max(0, totalLimit - totalSpent))}</div>
          <div style={{ height: 18, border: '3px solid #111', borderRadius: 4, background: '#fff', overflow: 'hidden', marginTop: 12 }}>
            <div style={{ height: '100%', width: pctTotal + '%', background: '#111' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Pakai {rp(totalSpent)}</span>
            <span>Batas {rp(totalLimit)}</span>
          </div>
        </div>

        {overCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--c2-orange)', border: '3px solid var(--c2-ink)', borderRadius: 6, padding: '11px 13px', marginBottom: 16 }}>
            <Icon name="bolt" size={18} stroke={2.8} style={{ color: '#111', flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: '#111', fontWeight: 800, textTransform: 'uppercase' }}>{overCount} kategori lewat anggaran!</span>
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 0 11px' }}>Per Kategori</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {budgets.map(b => {
            const c = cat(b.id);
            const spent = spentOf(b.id);
            const pct = Math.min(100, Math.round((spent / b.limit) * 100));
            const over = spent > b.limit;
            const near = !over && pct >= 80;
            const barColor = over ? 'var(--c2-orange)' : near ? 'var(--c2-yellow)' : CAT_COLOR[b.id];
            const isOpen = editing === b.id;
            return (
              <div key={b.id} style={{ background: 'var(--c2-paper)', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 'var(--c2-radius)', boxShadow: isOpen ? '4px 4px 0 var(--c2-purple)' : SH, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
                  <div style={{ width: 40, height: 40, background: CAT_COLOR[b.id], color: CAT_COLOR[b.id] === 'var(--c2-purple)' ? '#fff' : '#111', border: '2.5px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={glyphFor[b.id] || 'coins'} size={20} stroke={2.6} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--c2-ink)' }}>{c.label}</div>
                    <div style={{ ...mono, fontSize: 11.5, color: over ? 'var(--c2-orange)' : 'var(--c2-muted)', fontWeight: 700, marginTop: 1 }}>{rp(spent)} / {rp(b.limit)}</div>
                  </div>
                  {over && <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', background: 'var(--c2-orange)', border: '2px solid #111', borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase' }}>Over</span>}
                  <button onClick={() => setEditing(isOpen ? null : b.id)} style={{ fontSize: 11, fontWeight: 900, color: '#111', background: isOpen ? 'var(--c2-yellow)' : 'var(--c2-paper)', border: '2px solid #111', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, textTransform: 'uppercase' }}>{isOpen ? 'OK' : 'Atur'}</button>
                </div>
                <div style={{ height: 14, border: '2.5px solid #111', borderRadius: 4, background: '#fff', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: barColor, transition: 'width .3s' }} />
                </div>
                {isOpen && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 13 }}>
                    <button onClick={() => adjust(b.id, -100000)} style={{ width: 40, height: 40, border: '2.5px solid #111', borderRadius: 6, background: 'var(--c2-bg)', color: '#111', fontSize: 22, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--c2-muted)', fontWeight: 900, textTransform: 'uppercase' }}>Batas</div>
                      <div style={{ ...mono, fontSize: 17, fontWeight: 700, color: 'var(--c2-purple)' }}>{rp(b.limit)}</div>
                    </div>
                    <button onClick={() => adjust(b.id, 100000)} style={{ width: 40, height: 40, border: '2.5px solid #111', borderRadius: 6, background: 'var(--c2-bg)', color: '#111', fontSize: 22, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
window.C2Budget = C2Budget;
