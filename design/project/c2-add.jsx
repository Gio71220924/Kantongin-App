/* Concept 2 — Add Transaction (Neo-Brutalism) */
function C2Add({ go, onAdd, onUpdate, editTxn }) {
  const K = window.KANTONGIN;
  const { rp, accounts, categories } = K;
  const Icon = window.C2Icon;
  const { SEM, CAT_COLOR, ACCT_COLOR, glyphFor, SH, mono } = window.C2;
  const R = React;

  const isEdit = !!editTxn;
  const [type, setType] = R.useState(editTxn ? editTxn.type : 'expense');
  const [amount, setAmount] = R.useState(editTxn ? String(editTxn.amount) : '');
  const [catId, setCatId] = R.useState(editTxn && editTxn.cat ? editTxn.cat : 'makan');
  const [acctId, setAcctId] = R.useState(editTxn && editTxn.acct ? editTxn.acct : 'jago');
  const [fromId, setFromId] = R.useState(editTxn && editTxn.from ? editTxn.from : 'bca');
  const [toId, setToId] = R.useState(editTxn && editTxn.to ? editTxn.to : 'jago');
  const [note, setNote] = R.useState(editTxn ? (editTxn.title || '') : '');
  const [success, setSuccess] = R.useState(false);

  const isTransfer = type === 'transfer';
  const accent = SEM[type];
  const expenseCats = categories.filter(c => ['makan','transport','belanja','tagihan','hiburan','kesehatan'].includes(c.id));
  const incomeCats = categories.filter(c => ['gaji','belanja'].includes(c.id));
  const cats = type === 'income' ? incomeCats : expenseCats;

  const press = (k) => setAmount(prev => {
    if (k === 'del') return prev.slice(0, -1);
    if (k === '000') return prev === '' ? '' : (prev + '000').slice(0, 12);
    return (prev + k).replace(/^0+/, '').slice(0, 12);
  });
  const amtNum = parseInt(amount || '0', 10);
  const valid = amtNum > 0 && (!isTransfer || fromId !== toId);

  const save = () => {
    if (!valid) return;
    const base = isEdit
      ? { id: editTxn.id, amount: amtNum, date: editTxn.date, time: editTxn.time }
      : { id: 'n' + Date.now(), amount: amtNum, date: '2026-06-04', time: 'Baru' };
    const t = isTransfer ? { ...base, type: 'transfer', title: note || 'Transfer kantong', from: fromId, to: toId }
      : { ...base, type, title: note || (type === 'income' ? 'Pemasukan' : K.cat(catId).label), cat: catId, acct: acctId };
    setSuccess(true);
    setTimeout(() => { if (isEdit) onUpdate(t); else onAdd(t); go('history'); }, 1050);
  };

  const TypeTab = ({ id, label, icon }) => {
    const on = type === id;
    return (
      <button onClick={() => setType(id)} style={{
        flex: 1, padding: '10px 4px', cursor: 'pointer', fontFamily: 'inherit',
        background: on ? SEM[id] : 'var(--c2-paper)', color: on && id === 'transfer' ? '#fff' : '#111',
        border: '3px solid var(--c2-ink)', borderRadius: 6, boxShadow: on ? '3px 3px 0 var(--c2-ink)' : 'none',
        transform: on ? 'translate(-1px,-1px)' : 'none', fontWeight: 900, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      }}>
        <Icon name={icon} size={18} stroke={3} />{label}
      </button>
    );
  };

  const Pills = ({ value, onPick, exclude }) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {accounts.filter(a => a.id !== exclude).map(a => {
        const on = value === a.id;
        return (
          <button key={a.id} onClick={() => onPick(a.id)} style={{
            padding: '8px 12px', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 5,
            border: '2.5px solid var(--c2-ink)', background: on ? ACCT_COLOR[a.id] : 'var(--c2-paper)',
            color: on && ACCT_COLOR[a.id] === 'var(--c2-purple)' ? '#fff' : '#111',
            fontWeight: 800, fontSize: 13, boxShadow: on ? '2px 2px 0 var(--c2-ink)' : 'none',
          }}>{a.name}</button>
        );
      })}
    </div>
  );
  const Label = ({ children }) => <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--c2-ink)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)', position: 'relative' }}>
      {/* success overlay */}
      {success && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'var(--c2-yellow)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{ width: 96, height: 96, background: '#fff', color: '#111', border: '4px solid var(--c2-ink)', borderRadius: 10, boxShadow: '6px 6px 0 var(--c2-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'c2pop .35s cubic-bezier(.2,1.5,.4,1)' }}>
            <Icon name="check" size={52} stroke={3.4} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 0.3 }}>{isEdit ? 'Tersimpan!' : 'Berhasil!'}</div>
          <div style={{ ...mono, fontSize: 16, fontWeight: 700, color: '#111' }}>{isTransfer ? 'TRANSFER ≠ PENGELUARAN' : rp(amtNum)}</div>
          <style>{`@keyframes c2pop{0%{transform:scale(.4) rotate(-8deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}`}</style>
        </div>
      )}
      <div style={{ padding: '54px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => go(isEdit ? 'detail' : 'dashboard', isEdit ? editTxn : null)} style={{ width: 40, height: 40, background: 'var(--c2-paper)', border: '3px solid var(--c2-ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Icon name={isEdit ? 'chevron' : 'close'} size={20} stroke={3} style={isEdit ? { transform: 'scaleX(-1)' } : null} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.3 }}>{isEdit ? 'Edit' : 'Tambah'}</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 18px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <TypeTab id="income" label="Masuk" icon="up" />
          <TypeTab id="expense" label="Keluar" icon="down" />
          <TypeTab id="transfer" label="Transfer" icon="swap" />
        </div>

        {/* amount */}
        <div style={{ background: isTransfer ? 'var(--c2-purple)' : 'var(--c2-yellow)', color: isTransfer ? '#fff' : '#111', border: '3px solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, padding: '14px 16px', marginBottom: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Jumlah</div>
          <div style={{ ...mono, fontSize: 38, fontWeight: 700, letterSpacing: -1.5, marginTop: 2 }}>
            <span style={{ fontSize: 20 }}>Rp</span>{amtNum ? amtNum.toLocaleString('id-ID') : '0'}
          </div>
        </div>

        {isTransfer ? (
          <>
            <div style={{ background: 'var(--c2-ink)', color: '#fff', border: '3px solid var(--c2-ink)', borderRadius: 6, padding: '10px 13px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="swap" size={16} stroke={3} style={{ flexShrink: 0, color: 'var(--c2-yellow)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.3 }}>TRANSFER ≠ PENGELUARAN. Dana hanya pindah antar kantongmu.</span>
            </div>
            <Label>Dari Kantong</Label>
            <div style={{ marginBottom: 12 }}><Pills value={fromId} onPick={(v) => { setFromId(v); if (v === toId) setToId(accounts.find(a => a.id !== v).id); }} /></div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 12px' }}>
              <div style={{ width: 34, height: 34, background: 'var(--c2-purple)', color: '#fff', border: '3px solid var(--c2-ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(90deg)' }}>
                <Icon name="down" size={18} stroke={3} />
              </div>
            </div>
            <Label>Ke Kantong</Label>
            <div style={{ marginBottom: 18 }}><Pills value={toId} onPick={setToId} exclude={fromId} /></div>
          </>
        ) : (
          <>
            <Label>Kategori</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {cats.map(c => {
                const on = catId === c.id;
                return (
                  <button key={c.id} onClick={() => setCatId(c.id)} style={{
                    padding: '8px 12px', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 5,
                    border: '2.5px solid var(--c2-ink)', background: on ? CAT_COLOR[c.id] : 'var(--c2-paper)',
                    color: on && CAT_COLOR[c.id] === 'var(--c2-purple)' ? '#fff' : '#111',
                    fontWeight: 800, fontSize: 13, boxShadow: on ? '2px 2px 0 var(--c2-ink)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Icon name={glyphFor[c.id] || 'coins'} size={15} stroke={2.6} />{c.label}
                  </button>
                );
              })}
            </div>
            <Label>{type === 'income' ? 'Masuk ke Kantong' : 'Dari Kantong'}</Label>
            <div style={{ marginBottom: 18 }}><Pills value={acctId} onPick={setAcctId} /></div>
          </>
        )}

        <Label>Catatan</Label>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="OPSIONAL" style={{
          width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: 6,
          border: '3px solid var(--c2-ink)', background: 'var(--c2-paper)', fontFamily: 'inherit',
          fontSize: 14, fontWeight: 600, color: 'var(--c2-ink)', outline: 'none', marginBottom: 14,
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--c2-paper)', border: '3px solid var(--c2-ink)', borderRadius: 6, padding: '11px 13px' }}>
          <Icon name="calendar" size={17} stroke={2.6} style={{ color: '#111' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c2-ink)', flex: 1, textTransform: 'uppercase' }}>Hari Ini · 4 Jun 2026</span>
        </div>
      </div>

      {/* keypad + save */}
      <div style={{ background: 'var(--c2-paper)', borderTop: '3px solid var(--c2-ink)', padding: '12px 14px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
          {['1','2','3','4','5','6','7','8','9','000','0','del'].map(k => (
            <button key={k} onClick={() => press(k)} style={{
              height: 42, border: '2.5px solid var(--c2-ink)', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
              background: 'var(--c2-bg)', color: 'var(--c2-ink)', ...mono, fontSize: k === 'del' ? 16 : 19, fontWeight: 700,
            }}>{k === 'del' ? '⌫' : k}</button>
          ))}
        </div>
        <button onClick={save} disabled={!valid} style={{
          width: '100%', height: 52, border: '3px solid var(--c2-ink)', borderRadius: 8, cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
          background: valid ? accent : 'var(--c2-line)', color: valid && !isTransfer ? '#111' : '#fff',
          fontSize: 15, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5,
          boxShadow: valid ? '4px 4px 0 var(--c2-ink)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="check" size={20} stroke={3.2} />{isEdit ? 'Simpan Perubahan' : (isTransfer ? 'Simpan Transfer' : 'Simpan')}
        </button>
      </div>
    </div>
  );
}
window.C2Add = C2Add;
