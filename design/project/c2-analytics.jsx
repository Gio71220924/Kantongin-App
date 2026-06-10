/* Concept 2 — Analytics (Neo-Brutalism) */
function C2Analytics({ go }) {
  const K = window.KANTONGIN;
  const { rp, byCategory, byAccount, trend, summary, cat, acct } = K;
  const Icon = window.C2Icon;
  const { CAT_COLOR, ACCT_COLOR, SH, mono } = window.C2;
  const { C2Block, C2BarRows, C2BarChart, C2Head } = window;
  const R = React;
  const [month, setMonth] = R.useState('Jun');

  const catRows = byCategory.map(b => ({ label: cat(b.id).label, value: b.amount, color: CAT_COLOR[b.id] }));
  const acctRows = byAccount.map(b => ({ label: acct(b.id).name, value: b.amount, color: ACCT_COLOR[b.id] }));
  const transferTotal = trend.find(d => d.m === 'Jun').transfer;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)' }}>
      <div style={{ padding: '54px 16px 8px' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, textTransform: 'uppercase' }}>Stats</h1>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
          {trend.map(d => {
            const on = month === d.m;
            return (
              <button key={d.m} onClick={() => setMonth(d.m)} style={{
                flex: '0 0 auto', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 5,
                border: '2.5px solid var(--c2-ink)', background: on ? 'var(--c2-purple)' : 'var(--c2-paper)',
                color: on ? '#fff' : '#111', fontWeight: 800, fontSize: 12.5, textTransform: 'uppercase',
                boxShadow: on ? '2px 2px 0 var(--c2-ink)' : 'none',
              }}>{d.m}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 120px' }}>
        {/* total */}
        <C2Block color="var(--c2-orange)" style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Pengeluaran · {summary.month}</div>
          <div style={{ ...mono, fontSize: 30, fontWeight: 700, letterSpacing: -1, marginTop: 4 }}>{rp(summary.expense)}</div>
          <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>↓ 7,5% DARI BULAN LALU</div>
        </C2Block>

        {/* by category */}
        <C2Head title="Pengeluaran / Kategori" action="Anggaran" onAction={() => go('budget')} />
        <C2Block style={{ marginBottom: 20 }}><C2BarRows rows={catRows} /></C2Block>

        {/* by account */}
        <C2Head title="Pengeluaran / Kantong" />
        <C2Block style={{ marginBottom: 20 }}><C2BarRows rows={acctRows} /></C2Block>

        {/* trend */}
        <C2Head title="Tren Bulanan" />
        <C2Block style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase' }}>
              <span style={{ width: 12, height: 12, background: 'var(--c2-orange)', border: '2px solid var(--c2-ink)' }} /> Keluar
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase' }}>
              <span style={{ width: 12, height: 12, background: 'var(--c2-purple)', border: '2px solid var(--c2-ink)' }} /> Transfer
            </span>
          </div>
          <C2BarChart data={trend} />
        </C2Block>

        {/* transfer activity separate */}
        <C2Head title="Aktivitas Transfer" />
        <C2Block color="var(--c2-purple)" style={{ color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: '#fff', color: 'var(--c2-purple)', border: '2.5px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="swap" size={24} stroke={2.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase' }}>Dipindahkan · {summary.month}</div>
              <div style={{ ...mono, fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{rp(transferTotal)}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, background: 'var(--c2-yellow)', color: '#111', border: '2.5px solid #111', borderRadius: 5, padding: '8px 11px', fontSize: 11.5, fontWeight: 800, lineHeight: 1.35 }}>
            DIHITUNG TERPISAH — transfer antar kantong BUKAN pengeluaran, hanya perpindahan danamu.
          </div>
        </C2Block>
      </div>
    </div>
  );
}
window.C2Analytics = C2Analytics;
