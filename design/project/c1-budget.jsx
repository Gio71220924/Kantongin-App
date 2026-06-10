/* Concept 1 — Budget per category (Anggaran) */
function C1Budget({ go, budgets, setBudgets }) {
  const K = window.KANTONGIN;
  const { rp, byCategory, cat, summary } = K;
  const Icon = window.C1Icon;
  const { SEM, catColor, catSoft, glyphFor } = window.C1;
  const R = React;
  const [editing, setEditing] = R.useState(null);

  const spentOf = (id) => { const b = byCategory.find(x => x.id === id); return b ? b.amount : 0; };
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + spentOf(b.id), 0);
  const pctTotal = Math.min(100, Math.round((totalSpent / totalLimit) * 100));
  const overCount = budgets.filter(b => spentOf(b.id) > b.limit).length;

  const adjust = (id, delta) => setBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: Math.max(100000, b.limit + delta) } : b));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c1-bg)' }}>
      <div style={{ padding: '58px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => go('dashboard')} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chevron" size={19} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.5 }}>Anggaran</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 118px' }}>
        {/* total ring */}
        <div style={{ borderRadius: 24, padding: 20, marginBottom: 18, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--c1-primary), color-mix(in oklch, var(--c1-primary) 62%, #0b1020))', boxShadow: '0 14px 30px color-mix(in oklch, var(--c1-primary) 30%, transparent)' }}>
          <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 500 }}>Sisa anggaran bulan ini</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.7, marginTop: 4 }}>{rp(Math.max(0, totalLimit - totalSpent))}</div>
          <div style={{ height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.22)', overflow: 'hidden', marginTop: 14 }}>
            <div style={{ height: '100%', width: pctTotal + '%', borderRadius: 999, background: '#fff' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, opacity: 0.92 }}>
            <span>Terpakai {rp(totalSpent)}</span>
            <span>Batas {rp(totalLimit)}</span>
          </div>
        </div>

        {overCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: SEM.expense + '12', border: `1px solid ${SEM.expense}33`, borderRadius: 14, padding: '11px 14px', marginBottom: 16 }}>
            <Icon name="bolt" size={18} stroke={2.4} style={{ color: SEM.expense, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--c1-text)', fontWeight: 500 }}><b style={{ color: SEM.expense }}>{overCount} kategori</b> melebihi anggaran bulan ini.</span>
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c1-muted)', textTransform: 'uppercase', letterSpacing: 0.4, margin: '4px 4px 11px' }}>Per Kategori</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {budgets.map(b => {
            const c = cat(b.id);
            const spent = spentOf(b.id);
            const pct = Math.min(100, Math.round((spent / b.limit) * 100));
            const over = spent > b.limit;
            const near = !over && pct >= 80;
            const barColor = over ? SEM.expense : near ? '#E8893B' : catColor(c.hue);
            const isOpen = editing === b.id;
            return (
              <div key={b.id} style={{ background: 'var(--c1-card)', border: isOpen ? `1.5px solid var(--c1-primary)` : '1px solid var(--c1-line)', borderRadius: 18, padding: 16, transition: 'border .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: catSoft(c.hue), color: catColor(c.hue), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={glyphFor[b.id] || 'coins'} size={20} stroke={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--c1-text)' }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: over ? SEM.expense : 'var(--c1-muted)', fontWeight: over ? 600 : 400, marginTop: 1 }}>
                      {rp(spent)} dari {rp(b.limit)}{over ? ` · lebih ${rp(spent - b.limit)}` : ''}
                    </div>
                  </div>
                  <button onClick={() => setEditing(isOpen ? null : b.id)} style={{ fontSize: 12.5, fontWeight: 700, color: isOpen ? 'var(--c1-primary)' : 'var(--c1-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>{isOpen ? 'Selesai' : 'Atur'}</button>
                </div>
                <div style={{ height: 9, borderRadius: 999, background: 'var(--c1-line)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', borderRadius: 999, background: barColor, transition: 'width .4s' }} />
                </div>
                {isOpen && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                    <button onClick={() => adjust(b.id, -100000)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-bg)', color: 'var(--c1-text)', fontSize: 22, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--c1-muted)', fontWeight: 600 }}>Batas anggaran</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c1-primary)' }}>{rp(b.limit)}</div>
                    </div>
                    <button onClick={() => adjust(b.id, 100000)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-bg)', color: 'var(--c1-text)', fontSize: 22, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
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
window.C1Budget = C1Budget;
