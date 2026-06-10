/* Concept 1 — Analytics (Analitik) */
function C1Analytics({ go }) {
  const K = window.KANTONGIN;
  const { rp, byCategory, byAccount, trend, summary, cat, acct } = K;
  const Icon = window.C1Icon;
  const { SEM, catColor } = window.C1;
  const { C1Donut, C1BarList, C1TrendChart, C1Card, C1SectionHead } = window;
  const R = React;
  const [month, setMonth] = R.useState('Jun');

  const catSegs = byCategory.map(b => ({ value: b.amount, color: catColor(cat(b.id).hue) }));
  const catRows = byCategory.map(b => ({ label: cat(b.id).label, value: b.amount, color: catColor(cat(b.id).hue) }));
  const acctRows = byAccount.map(b => ({ label: acct(b.id).name, value: b.amount, color: `oklch(0.55 0.13 ${acct(b.id).hue})` }));
  const transferTotal = trend.find(d => d.m === 'Jun').transfer;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '58px 18px 8px' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.6 }}>Analitik</h1>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
          {trend.map(d => {
            const on = month === d.m;
            return (
              <button key={d.m} onClick={() => setMonth(d.m)} style={{
                flex: '0 0 auto', padding: '7px 15px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                border: 'none', background: on ? 'var(--c1-primary)' : 'var(--c1-card)',
                color: on ? '#fff' : 'var(--c1-muted)', fontWeight: 600, fontSize: 13,
                boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--c1-line)',
              }}>{d.m}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 118px' }}>
        {/* spending by category */}
        <C1SectionHead title="Pengeluaran per Kategori" action="Anggaran" onAction={() => go('budget')} />
        <C1Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <C1Donut segments={catSegs} size={120} thickness={19} centerTop="Total" centerBottom={rp(summary.expense)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: 'var(--c1-muted)' }}>Total pengeluaran {summary.month}</div>
              <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.5, margin: '2px 0 6px' }}>{rp(summary.expense)}</div>
              <div style={{ fontSize: 12, color: SEM.income, fontWeight: 600 }}>↓ 7,5% dari bulan lalu</div>
            </div>
          </div>
          <C1BarList rows={catRows} />
        </C1Card>

        {/* spending per account */}
        <C1SectionHead title="Pengeluaran per Kantong" />
        <C1Card style={{ marginBottom: 20 }}>
          <C1BarList rows={acctRows} />
        </C1Card>

        {/* monthly trend */}
        <C1SectionHead title="Tren Bulanan" />
        <C1Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--c1-text)', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: SEM.expense }} /> Pengeluaran
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--c1-text)', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: SEM.transfer }} /> Transfer
            </span>
          </div>
          <C1TrendChart data={trend} />
        </C1Card>

        {/* transfer activity — kept separate */}
        <C1SectionHead title="Aktivitas Transfer" />
        <div style={{
          borderRadius: 'var(--c1-radius)', padding: 18, color: '#fff',
          background: `linear-gradient(140deg, ${SEM.transfer}, color-mix(in oklch, ${SEM.transfer} 60%, #14102e))`,
          boxShadow: `0 12px 26px ${SEM.transfer}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="swap" size={22} stroke={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Total dipindahkan {summary.month}</div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{rp(transferTotal)}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '10px 13px', marginTop: 14, fontSize: 12.5, lineHeight: 1.4 }}>
            Transfer antar kantong <b>tidak termasuk</b> dalam total pengeluaran — hanya perpindahan dana milikmu sendiri.
          </div>
        </div>
      </div>
    </div>
  );
}
window.C1Analytics = C1Analytics;
