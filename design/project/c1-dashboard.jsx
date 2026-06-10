/* Concept 1 — Dashboard (Beranda) */
function C1Dashboard({ go, txns, hidden, setHidden, guest }) {
  const K = window.KANTONGIN;
  const { rp, accounts, summary, byCategory, cat, totalBalance } = K;
  const Icon = window.C1Icon;
  const { SEM, catColor } = window.C1;
  const { C1AccountCard, C1TxnRow, C1Donut, C1Card, C1SectionHead, C1TypeBadge } = window;

  const segs = byCategory.map(b => ({ value: b.amount, color: catColor(cat(b.id).hue) }));
  const recent = txns.slice(0, 5);

  const Tile = ({ label, value, color, icon, note }) => (
    <div style={{ flex: 1, background: 'var(--c1-card)', borderRadius: 16, padding: '12px 13px', border: '1px solid var(--c1-line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 12, fontWeight: 600 }}>
        <Icon name={icon} size={14} stroke={2.4} />{label}
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--c1-text)', marginTop: 6, letterSpacing: -0.3 }}>{rp(value)}</div>
      {note && <div style={{ fontSize: 9.5, color: 'var(--c1-muted)', marginTop: 3, lineHeight: 1.25 }}>{note}</div>}
    </div>
  );

  return (
    <div style={{ padding: '54px 18px 118px' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: guest ? 'var(--c1-muted)' : 'var(--c1-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17 }}>{guest ? <Icon name="user" size={22} stroke={2} /> : 'S'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--c1-muted)' }}>Selamat pagi,</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--c1-text)' }}>{guest ? 'Pengguna Tamu' : 'Sapto Wibowo'}</div>
        </div>
        <button style={{ width: 42, height: 42, borderRadius: 13, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
          <Icon name="bell" size={20} />
          <span style={{ position: 'absolute', top: 10, right: 11, width: 7, height: 7, borderRadius: '50%', background: SEM.expense }} />
        </button>
      </div>

      {/* total balance hero */}
      <div style={{
        borderRadius: 24, padding: 20, marginBottom: 18, color: '#fff', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--c1-primary), color-mix(in oklch, var(--c1-primary) 62%, #0b1020))',
        boxShadow: '0 14px 30px color-mix(in oklch, var(--c1-primary) 32%, transparent)',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 24, bottom: -40, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, opacity: 0.9, fontWeight: 500 }}>Total Saldo · semua kantong</span>
          <button onClick={() => setHidden(h => !h)} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', width: 32, height: 32, borderRadius: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name={hidden ? 'eyeoff' : 'eye'} size={17} />
          </button>
        </div>
        <div style={{ fontSize: 33, fontWeight: 800, marginTop: 8, letterSpacing: -0.8 }}>
          {hidden ? 'Rp • • • • • • •' : rp(totalBalance)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '7px 11px', flex: 1 }}>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Masuk bulan ini</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>+{rp(summary.income)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '7px 11px', flex: 1 }}>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Keluar bulan ini</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>−{rp(summary.expense)}</div>
          </div>
        </div>
      </div>

      {/* accounts */}
      <C1SectionHead title="Kantong Saya" action="Kelola" onAction={() => go('settings')} />
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '2px 0 6px', margin: '0 -18px 22px', paddingLeft: 18, paddingRight: 18, scrollbarWidth: 'none' }}>
        {accounts.map(a => <C1AccountCard key={a.id} a={a} onClick={() => go('analytics')} />)}
      </div>

      {/* monthly summary */}
      <C1SectionHead title={`Ringkasan · ${summary.month}`} />
      <div style={{ display: 'flex', gap: 9, marginBottom: 10 }}>
        <Tile label="Masuk" value={summary.income} color={SEM.income} icon="up" />
        <Tile label="Keluar" value={summary.expense} color={SEM.expense} icon="down" />
      </div>
      <div style={{
        background: SEM.transfer + '0F', border: `1px solid ${SEM.transfer}33`, borderRadius: 16,
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: SEM.transfer + '1F', color: SEM.transfer, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="swap" size={20} stroke={2.2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c1-text)' }}>Transfer antar kantong</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--c1-muted)', marginTop: 1 }}>Pindah dana — <b style={{ color: SEM.transfer }}>bukan pengeluaran</b></div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: SEM.transfer }}>{rp(summary.transfer)}</div>
      </div>

      {/* spending by category */}
      <C1SectionHead title="Pengeluaran per Kategori" action="Anggaran" onAction={() => go('budget')} />
      <C1Card style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
        <C1Donut segments={segs} size={132} thickness={20} centerTop="Total keluar" centerBottom={rp(summary.expense).replace('Rp', 'Rp ')} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {byCategory.slice(0, 5).map(b => {
            const c = cat(b.id);
            const pct = Math.round((b.amount / summary.expense) * 100);
            return (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: catColor(c.hue), flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--c1-text)', flex: 1, fontWeight: 500 }}>{c.label}</span>
                <span style={{ fontSize: 12, color: 'var(--c1-muted)', fontWeight: 600 }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </C1Card>

      {/* recent transactions */}
      <C1SectionHead title="Transaksi Terbaru" action="Lihat semua" onAction={() => go('history')} />
      <C1Card pad={'4px 16px'}>
        {recent.map((t, i) => (
          <div key={t.id} style={{ borderTop: i ? '1px solid var(--c1-line)' : 'none' }}>
            <C1TxnRow t={t} onClick={() => go('detail', t)} />
          </div>
        ))}
      </C1Card>
    </div>
  );
}
window.C1Dashboard = C1Dashboard;
