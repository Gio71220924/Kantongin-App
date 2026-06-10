/* Concept 1 — Transaction Detail (Detail Transaksi) */
function C1Detail({ go, txn, onDelete }) {
  const K = window.KANTONGIN;
  const { rp, acct, cat } = K;
  const Icon = window.C1Icon;
  const { SEM, catColor, catSoft, glyphFor } = window.C1;
  const R = React;
  const [confirm, setConfirm] = R.useState(false);

  if (!txn) { go('history'); return null; }
  const isTransfer = txn.type === 'transfer';
  const c = cat(txn.cat);
  const accent = SEM[txn.type];
  const typeLabel = { income: 'Pemasukan', expense: 'Pengeluaran', transfer: 'Transfer' }[txn.type];
  const sign = txn.type === 'income' ? '+' : txn.type === 'expense' ? '−' : '';

  const Field = ({ label, children, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: last ? 'none' : '1px solid var(--c1-line)' }}>
      <span style={{ fontSize: 13.5, color: 'var(--c1-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14.5, color: 'var(--c1-text)', fontWeight: 600, textAlign: 'right', maxWidth: '62%' }}>{children}</span>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c1-bg)' }}>
      {/* header */}
      <div style={{ padding: '58px 18px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => go('history')} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chevron" size={19} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--c1-text)', whiteSpace: 'nowrap' }}>Detail Transaksi</span>
        <button onClick={() => go('add', txn)} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          <Icon name="settings" size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 24px' }}>
        {/* hero amount */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{
            width: 66, height: 66, borderRadius: 20, margin: '0 auto 14px',
            background: isTransfer ? SEM.transfer + '15' : catSoft(c ? c.hue : 220),
            color: isTransfer ? SEM.transfer : catColor(c ? c.hue : 220),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={isTransfer ? 'swap' : glyphFor[txn.cat] || 'coins'} size={32} stroke={2} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: txn.type === 'income' ? SEM.income : txn.type === 'transfer' ? SEM.transfer : 'var(--c1-text)' }}>
            {sign}{rp(txn.amount)}
          </div>
          <div style={{ fontSize: 15, color: 'var(--c1-muted)', marginTop: 4, fontWeight: 500 }}>{txn.title}</div>
          <div style={{ marginTop: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: accent, background: accent + '14', borderRadius: 999, padding: '5px 14px' }}>
              <Icon name={txn.type === 'income' ? 'up' : txn.type === 'expense' ? 'down' : 'swap'} size={14} stroke={2.6} />
              {typeLabel}
            </span>
          </div>
        </div>

        {/* transfer route */}
        {isTransfer && (
          <div style={{ background: SEM.transfer + '0D', border: `1px solid ${SEM.transfer}33`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {[acct(txn.from), acct(txn.to)].map((a, i) => (
                <React.Fragment key={a.id}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--c1-muted)', fontWeight: 600, marginBottom: 5 }}>{i === 0 ? 'DARI' : 'KE'}</div>
                    <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto 6px', background: `oklch(0.55 0.13 ${a.hue})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{a.name.slice(0, 2)}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c1-text)' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--c1-muted)' }}>•• {a.last4}</div>
                  </div>
                  {i === 0 && (
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: SEM.transfer, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="chevron" size={16} stroke={2.6} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: SEM.transfer, fontWeight: 600, background: 'var(--c1-card)', borderRadius: 10, padding: '8px 10px' }}>
              Perpindahan dana — tidak mengurangi total pengeluaran
            </div>
          </div>
        )}

        {/* fields */}
        <div style={{ background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 18, padding: '2px 16px', marginBottom: 16 }}>
          {!isTransfer && <Field label="Kategori">{c ? c.label : '—'}</Field>}
          {!isTransfer && <Field label={txn.type === 'income' ? 'Masuk ke' : 'Rekening'}>{acct(txn.acct).name} ·· {acct(txn.acct).last4}</Field>}
          <Field label="Tanggal">{K.dayLabel(txn.date)}, 2026</Field>
          <Field label="Waktu">{txn.time === 'Baru' ? 'Baru saja' : txn.time}</Field>
          <Field label="ID Transaksi" last><span style={{ fontFamily: 'monospace', fontSize: 12.5 }}>#{txn.id.toUpperCase()}</span></Field>
        </div>

        {/* note */}
        <div style={{ background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 18, padding: 16, marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: 'var(--c1-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 }}>Catatan</div>
          <div style={{ fontSize: 14.5, color: 'var(--c1-text)', lineHeight: 1.4 }}>{txn.title}</div>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => go('add', txn)} style={{ flex: 1, height: 50, borderRadius: 15, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Icon name="settings" size={18} /> Edit
          </button>
          <button onClick={() => setConfirm(true)} style={{ flex: 1, height: 50, borderRadius: 15, border: 'none', background: SEM.expense + '15', color: SEM.expense, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Icon name="close" size={18} stroke={2.4} /> Hapus
          </button>
        </div>
      </div>

      {/* delete confirm sheet */}
      {confirm && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--c1-card)', borderRadius: '24px 24px 0 0', padding: '24px 18px 30px', animation: 'c1sheet .25s ease' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: SEM.expense + '15', color: SEM.expense, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Icon name="close" size={28} stroke={2.4} />
            </div>
            <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, color: 'var(--c1-text)' }}>Hapus transaksi ini?</div>
            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--c1-muted)', marginTop: 6, marginBottom: 20 }}>{txn.title} · {rp(txn.amount)}. Tindakan ini tidak bisa dibatalkan.</div>
            <button onClick={() => { onDelete(txn.id); go('history'); }} style={{ width: '100%', height: 52, borderRadius: 15, border: 'none', background: SEM.expense, color: '#fff', fontWeight: 700, fontSize: 15.5, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>Ya, hapus</button>
            <button onClick={() => setConfirm(false)} style={{ width: '100%', height: 52, borderRadius: 15, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
            <style>{`@keyframes c1sheet{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
          </div>
        </div>
      )}
    </div>
  );
}
window.C1Detail = C1Detail;
