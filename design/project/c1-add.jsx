/* Concept 1 — Add Transaction (Tambah Transaksi) */
function C1Add({ go, onAdd, onUpdate, editTxn }) {
  const K = window.KANTONGIN;
  const { rp, accounts, categories, acct } = K;
  const Icon = window.C1Icon;
  const { SEM, catColor, catSoft, glyphFor } = window.C1;
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

  const accent = SEM[type];
  const isTransfer = type === 'transfer';
  const expenseCats = categories.filter(c => ['makan','transport','belanja','tagihan','hiburan','kesehatan'].includes(c.id));
  const incomeCats = categories.filter(c => ['gaji','belanja'].includes(c.id));
  const cats = type === 'income' ? incomeCats : expenseCats;

  const press = (k) => {
    setAmount(prev => {
      if (k === 'del') return prev.slice(0, -1);
      if (k === '000') return prev === '' ? '' : (prev + '000').slice(0, 12);
      return (prev + k).replace(/^0+/, '').slice(0, 12);
    });
  };
  const amtNum = parseInt(amount || '0', 10);
  const valid = amtNum > 0 && (!isTransfer || fromId !== toId);

  const save = () => {
    if (!valid) return;
    const base = isEdit
      ? { id: editTxn.id, amount: amtNum, date: editTxn.date, time: editTxn.time }
      : { id: 'n' + Date.now(), amount: amtNum, date: '2026-06-04', time: 'Baru' };
    const t = isTransfer
      ? { ...base, type: 'transfer', title: note || 'Transfer kantong', from: fromId, to: toId }
      : { ...base, type, title: note || (type === 'income' ? 'Pemasukan' : K.cat(catId).label), cat: catId, acct: acctId };
    setSuccess(true);
    setTimeout(() => {
      if (isEdit) onUpdate(t); else onAdd(t);
      go('history');
    }, 1050);
  };

  const TypeTab = ({ id, label, icon }) => {
    const on = type === id;
    return (
      <button onClick={() => setType(id)} style={{
        flex: 1, padding: '9px 4px', borderRadius: 13, border: 'none', cursor: 'pointer',
        background: on ? SEM[id] : 'transparent', color: on ? '#fff' : 'var(--c1-muted)',
        fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        transition: 'all .18s', boxShadow: on ? `0 4px 12px ${SEM[id]}55` : 'none',
      }}>
        <Icon name={icon} size={18} stroke={2.4} />{label}
      </button>
    );
  };

  const AcctPick = ({ value, onPick, exclude }) => (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 0', scrollbarWidth: 'none' }}>
      {accounts.filter(a => a.id !== exclude).map(a => {
        const on = value === a.id;
        return (
          <button key={a.id} onClick={() => onPick(a.id)} style={{
            flex: '0 0 auto', padding: '8px 14px', borderRadius: 13, cursor: 'pointer', fontFamily: 'inherit',
            border: on ? `1.5px solid ${accent}` : '1.5px solid var(--c1-line)',
            background: on ? accent + '12' : 'var(--c1-card)',
            color: on ? accent : 'var(--c1-text)', fontWeight: 600, fontSize: 13.5,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: `oklch(0.55 0.13 ${a.hue})` }} />
            {a.name}
          </button>
        );
      })}
    </div>
  );

  const Label = ({ children }) => <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--c1-muted)', margin: '0 2px 8px', textTransform: 'uppercase', letterSpacing: 0.3 }}>{children}</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: isTransfer ? SEM.transfer + '08' : 'var(--c1-bg)', transition: 'background .25s', position: 'relative' }}>
      {/* success overlay */}
      {success && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'var(--c1-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{ width: 92, height: 92, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'c1pop .4s cubic-bezier(.2,1.4,.4,1)', boxShadow: `0 14px 34px ${accent}55` }}>
            <Icon name="check" size={48} stroke={3} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c1-text)' }}>{isEdit ? 'Perubahan disimpan' : 'Transaksi tersimpan'}</div>
          <div style={{ fontSize: 14, color: 'var(--c1-muted)' }}>{isTransfer ? 'Transfer dicatat — bukan pengeluaran' : rp(amtNum)}</div>
          <style>{`@keyframes c1pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}
      {/* header */}
      <div style={{ paddingTop: 58, padding: '58px 18px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => go(isEdit ? 'detail' : 'dashboard', isEdit ? editTxn : null)} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name={isEdit ? 'chevron' : 'close'} size={19} style={isEdit ? { transform: 'scaleX(-1)' } : null} />
        </button>
        <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--c1-text)' }}>{isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}</span>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 20px' }}>
        {/* type selector */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 16, padding: 5, marginBottom: 20 }}>
          <TypeTab id="income" label="Pemasukan" icon="up" />
          <TypeTab id="expense" label="Pengeluaran" icon="down" />
          <TypeTab id="transfer" label="Transfer" icon="swap" />
        </div>

        {/* amount */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12.5, color: 'var(--c1-muted)', fontWeight: 600, marginBottom: 4 }}>Jumlah</div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, color: amtNum ? accent : 'var(--c1-line)' }}>
            <span style={{ fontSize: 22, verticalAlign: 'middle', marginRight: 2 }}>Rp</span>{amtNum ? amtNum.toLocaleString('id-ID') : '0'}
          </div>
        </div>

        {/* transfer flow */}
        {isTransfer ? (
          <>
            <div style={{ background: SEM.transfer + '12', border: `1px solid ${SEM.transfer}33`, borderRadius: 14, padding: '10px 13px', display: 'flex', gap: 9, alignItems: 'center', marginBottom: 18 }}>
              <Icon name="swap" size={17} stroke={2.4} style={{ color: SEM.transfer, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--c1-text)', lineHeight: 1.35 }}>Transfer antar rekening <b style={{ color: SEM.transfer }}>tidak dihitung sebagai pengeluaran</b>.</span>
            </div>
            <Label>Dari Rekening</Label>
            <div style={{ marginBottom: 14 }}><AcctPick value={fromId} onPick={(v) => { setFromId(v); if (v === toId) setToId(accounts.find(a => a.id !== v).id); }} /></div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '-4px 0 10px' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: SEM.transfer, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(90deg)' }}>
                <Icon name="down" size={18} stroke={2.6} />
              </div>
            </div>
            <Label>Ke Rekening</Label>
            <div style={{ marginBottom: 18 }}><AcctPick value={toId} onPick={setToId} exclude={fromId} /></div>
          </>
        ) : (
          <>
            <Label>Kategori</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {cats.map(c => {
                const on = catId === c.id;
                return (
                  <button key={c.id} onClick={() => setCatId(c.id)} style={{
                    padding: '8px 13px', borderRadius: 13, cursor: 'pointer', fontFamily: 'inherit',
                    border: on ? `1.5px solid ${catColor(c.hue)}` : '1.5px solid var(--c1-line)',
                    background: on ? catSoft(c.hue) : 'var(--c1-card)', color: on ? catColor(c.hue, 0.45) : 'var(--c1-text)',
                    fontWeight: 600, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    <Icon name={glyphFor[c.id] || 'coins'} size={16} stroke={2.2} style={{ color: catColor(c.hue) }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
            <Label>{type === 'income' ? 'Masuk ke Rekening' : 'Dari Rekening'}</Label>
            <div style={{ marginBottom: 18 }}><AcctPick value={acctId} onPick={setAcctId} /></div>
          </>
        )}

        {/* note */}
        <Label>Catatan</Label>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Tulis catatan (opsional)" style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14,
          border: '1px solid var(--c1-line)', background: 'var(--c1-card)', fontFamily: 'inherit',
          fontSize: 14.5, color: 'var(--c1-text)', outline: 'none', marginBottom: 14,
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 14, padding: '12px 14px', marginBottom: 16 }}>
          <Icon name="calendar" size={18} style={{ color: 'var(--c1-muted)' }} />
          <span style={{ fontSize: 14.5, color: 'var(--c1-text)', flex: 1, fontWeight: 500 }}>Hari ini · 4 Juni 2026</span>
          <Icon name="chevron" size={16} style={{ color: 'var(--c1-muted)' }} />
        </div>
      </div>

      {/* keypad + save */}
      <div style={{ background: 'var(--c1-card)', borderTop: '1px solid var(--c1-line)', padding: '12px 14px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
          {['1','2','3','4','5','6','7','8','9','000','0','del'].map(k => (
            <button key={k} onClick={() => press(k)} style={{
              height: 42, borderRadius: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: 'var(--c1-bg)', color: 'var(--c1-text)', fontSize: k === 'del' ? 16 : 20, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{k === 'del' ? '⌫' : k}</button>
          ))}
        </div>
        <button onClick={save} disabled={!valid} style={{
          width: '100%', height: 52, borderRadius: 16, border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
          background: valid ? accent : 'var(--c1-line)', color: valid ? '#fff' : 'var(--c1-muted)',
          fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: valid ? `0 8px 18px ${accent}40` : 'none',
        }}>
          <Icon name="check" size={20} stroke={2.6} />
          {isEdit ? 'Simpan Perubahan' : (isTransfer ? 'Simpan Transfer' : 'Simpan Transaksi')}
        </button>
      </div>
    </div>
  );
}
window.C1Add = C1Add;
