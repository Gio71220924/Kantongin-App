/* Concept 2 — Transaction Detail (Neo-Brutalism) */
function C2Detail({ go, txn, onDelete }) {
  const K = window.KANTONGIN;
  const { rp, acct, cat } = K;
  const Icon = window.C2Icon;
  const { SEM, CAT_COLOR, glyphFor, SH, mono } = window.C2;
  const R = React;
  const [confirm, setConfirm] = R.useState(false);

  if (!txn) { go('history'); return null; }
  const isTransfer = txn.type === 'transfer';
  const c = cat(txn.cat);
  const col = isTransfer ? SEM.transfer : CAT_COLOR[txn.cat] || 'var(--c2-teal)';
  const heroInk = (col === 'var(--c2-purple)') ? '#fff' : '#111';
  const typeLabel = { income: 'MASUK', expense: 'KELUAR', transfer: 'TRANSFER' }[txn.type];
  const sign = txn.type === 'income' ? '+' : txn.type === 'expense' ? '−' : '';

  const Field = ({ label, children, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: last ? 'none' : '2.5px solid var(--c2-ink)' }}>
      <span style={{ fontSize: 12, color: 'var(--c2-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--c2-ink)', fontWeight: 800, textAlign: 'right', maxWidth: '60%' }}>{children}</span>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)' }}>
      {/* header */}
      <div style={{ padding: '54px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => go('history')} style={{ width: 40, height: 40, background: 'var(--c2-paper)', border: '3px solid var(--c2-ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Icon name="chevron" size={20} stroke={3} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.3 }}>Detail</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 24px' }}>
        {/* hero block */}
        <div style={{ background: col, color: heroInk, border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 'var(--c2-radius)', boxShadow: SH, padding: 18, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: '#fff', color: '#111', border: '3px solid #111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Icon name={isTransfer ? 'swap' : glyphFor[txn.cat] || 'coins'} size={28} stroke={2.8} />
          </div>
          <div style={{ display: 'inline-block', background: '#111', color: '#fff', fontSize: 11, fontWeight: 900, padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{typeLabel}</div>
          <div style={{ ...mono, fontSize: 34, fontWeight: 700, letterSpacing: -1.5 }}>{sign}{rp(txn.amount)}</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{txn.title}</div>
        </div>

        {/* transfer route */}
        {isTransfer && (
          <div style={{ background: 'var(--c2-paper)', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 'var(--c2-radius)', boxShadow: SH, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              {[acct(txn.from), acct(txn.to)].map((a, i) => (
                <React.Fragment key={a.id}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--c2-muted)', marginBottom: 6, textTransform: 'uppercase' }}>{i === 0 ? 'DARI' : 'KE'}</div>
                    <div style={{ width: 46, height: 46, background: window.C2.ACCT_COLOR[a.id], color: a.id === 'bca' ? '#fff' : '#111', border: '3px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, margin: '0 auto 6px' }}>{a.name.slice(0, 2).toUpperCase()}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--c2-ink)' }}>{a.name}</div>
                  </div>
                  {i === 0 && (
                    <div style={{ width: 34, height: 34, background: 'var(--c2-purple)', color: '#fff', border: '3px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="chevron" size={17} stroke={3} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{ marginTop: 14, background: 'var(--c2-yellow)', color: '#111', border: '2.5px solid #111', borderRadius: 5, padding: '8px 11px', fontSize: 11, fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.2 }}>Dana pindah antar kantong — bukan pengeluaran</div>
          </div>
        )}

        {/* fields */}
        <div style={{ background: 'var(--c2-paper)', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 'var(--c2-radius)', boxShadow: SH, padding: '4px 16px', marginBottom: 22 }}>
          {!isTransfer && <Field label="Kategori">{c ? c.label : '—'}</Field>}
          {!isTransfer && <Field label={txn.type === 'income' ? 'Masuk ke' : 'Kantong'}>{acct(txn.acct).name} ··{acct(txn.acct).last4}</Field>}
          <Field label="Tanggal">{K.dayLabel(txn.date)}, 2026</Field>
          <Field label="Waktu">{txn.time === 'Baru' ? 'Baru saja' : txn.time}</Field>
          <Field label="ID" last><span style={{ ...mono, fontSize: 12.5 }}>#{txn.id.toUpperCase()}</span></Field>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => go('add', txn)} style={{ flex: 1, height: 52, background: 'var(--c2-teal)', color: '#111', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Icon name="settings" size={18} stroke={2.6} /> Edit
          </button>
          <button onClick={() => setConfirm(true)} style={{ flex: 1, height: 52, background: 'var(--c2-orange)', color: '#111', border: 'var(--c2-bw) solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Icon name="close" size={18} stroke={3} /> Hapus
          </button>
        </div>
      </div>

      {/* delete confirm */}
      {confirm && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(20,20,20,0.45)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--c2-paper)', borderTop: '4px solid var(--c2-ink)', borderRadius: '0', padding: '22px 16px 30px', animation: 'c2sheet .22s ease' }}>
            <div style={{ width: 56, height: 56, background: 'var(--c2-orange)', color: '#111', border: '3px solid #111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Icon name="close" size={30} stroke={3} />
            </div>
            <div style={{ textAlign: 'center', fontSize: 19, fontWeight: 900, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.3 }}>Hapus transaksi?</div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--c2-muted)', fontWeight: 700, marginTop: 6, marginBottom: 20 }}>{txn.title} · {rp(txn.amount)}</div>
            <button onClick={() => { onDelete(txn.id); go('history'); }} style={{ width: '100%', height: 52, background: 'var(--c2-orange)', color: '#111', border: '3px solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', marginBottom: 12 }}>Ya, Hapus</button>
            <button onClick={() => setConfirm(false)} style={{ width: '100%', height: 52, background: 'var(--c2-paper)', color: '#111', border: '3px solid var(--c2-ink)', borderRadius: 8, fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}>Batal</button>
            <style>{`@keyframes c2sheet{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
          </div>
        </div>
      )}
    </div>
  );
}
window.C2Detail = C2Detail;
