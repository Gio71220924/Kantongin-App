/* Concept 2 — Neo-Brutalism : shared UI primitives + charts
   Reads window.KANTONGIN, window.C2Icon. Theme via CSS vars (--c2-*). */
(function () {
  const K = window.KANTONGIN;
  const Icon = window.C2Icon;
  const { rp, acct, cat } = K;

  const SEM = { income: 'var(--c2-teal)', expense: 'var(--c2-orange)', transfer: 'var(--c2-purple)' };
  const ACCT_COLOR = { bca: 'var(--c2-purple)', jago: 'var(--c2-orange)', seabank: 'var(--c2-teal)', bri: 'var(--c2-yellow)' };
  const CAT_COLOR = { makan: 'var(--c2-orange)', transport: 'var(--c2-teal)', belanja: 'var(--c2-purple)', tagihan: 'var(--c2-yellow)', hiburan: 'var(--c2-pink)', kesehatan: 'var(--c2-teal)', gaji: 'var(--c2-teal)', transfer: 'var(--c2-purple)' };
  const glyphFor = { makan: 'food', transport: 'car', belanja: 'bag', tagihan: 'bolt', hiburan: 'play', kesehatan: 'plus', gaji: 'wallet', transfer: 'swap' };
  const SH = '4px 4px 0 var(--c2-ink)';
  const mono = { fontFamily: "'Space Mono', monospace" };

  // ── Block (bordered hard-shadow card) ─────────────────────
  function Block({ children, color, pad = 16, shadow = true, style, onClick }) {
    return (
      <div onClick={onClick} style={{
        background: color || 'var(--c2-paper)',
        border: 'var(--c2-bw) solid var(--c2-ink)',
        borderRadius: 'var(--c2-radius)',
        boxShadow: shadow ? SH : 'none',
        padding: pad, ...style,
      }}>{children}</div>
    );
  }

  // ── Type tag ──────────────────────────────────────────────
  function Tag({ type, size = 'md' }) {
    const map = { income: { c: SEM.income, t: 'MASUK', i: 'up' }, expense: { c: SEM.expense, t: 'KELUAR', i: 'down' }, transfer: { c: SEM.transfer, t: 'TRANSFER', i: 'swap' } };
    const m = map[type];
    const sm = size === 'sm';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, background: m.c, color: m.c === SEM.transfer ? '#fff' : '#111',
        border: '2px solid var(--c2-ink)', borderRadius: 4, padding: sm ? '1px 6px' : '2px 8px',
        fontSize: sm ? 10 : 11.5, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase',
      }}>
        <Icon name={m.i} size={sm ? 11 : 12} stroke={3} />{m.t}
      </span>
    );
  }

  // ── Account block ─────────────────────────────────────────
  function AccountBlock({ a, onClick }) {
    const col = ACCT_COLOR[a.id];
    const ink = col === 'var(--c2-purple)' ? '#fff' : '#111';
    return (
      <button onClick={onClick} style={{
        textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
        background: col, color: ink, border: 'var(--c2-bw) solid var(--c2-ink)',
        borderRadius: 'var(--c2-radius)', boxShadow: SH, padding: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: -0.3 }}>{a.name}</span>
          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.8 }}>••{a.last4}</span>
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', opacity: 0.75, letterSpacing: 0.3 }}>{a.kind}</div>
        <div style={{ ...mono, fontSize: 17, fontWeight: 700, marginTop: 12, letterSpacing: -0.5 }}>{rp(a.balance)}</div>
      </button>
    );
  }

  // ── Transaction row ───────────────────────────────────────
  function TxnRow({ t, onClick, last }) {
    const isTransfer = t.type === 'transfer';
    const c = cat(t.cat);
    const col = isTransfer ? SEM.transfer : CAT_COLOR[t.cat] || 'var(--c2-teal)';
    const glyph = isTransfer ? 'swap' : glyphFor[t.cat] || 'coins';
    let sub, amount, amtColor;
    if (isTransfer) { sub = `${acct(t.from).name} → ${acct(t.to).name}`; amount = rp(t.amount); amtColor = 'var(--c2-purple)'; }
    else if (t.type === 'income') { sub = `${acct(t.acct).name} · ${c ? c.label : ''}`; amount = '+' + rp(t.amount); amtColor = 'var(--c2-ink)'; }
    else { sub = `${acct(t.acct).name} · ${c ? c.label : ''}`; amount = '−' + rp(t.amount); amtColor = 'var(--c2-ink)'; }
    const iconInk = col === 'var(--c2-purple)' ? '#fff' : '#111';
    return (
      <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
        background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', fontFamily: 'inherit',
        borderBottom: last ? 'none' : '2px solid var(--c2-ink)',
      }}>
        <div style={{ width: 42, height: 42, flexShrink: 0, background: col, color: iconInk, border: '2.5px solid var(--c2-ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={glyph} size={21} stroke={2.6} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--c2-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            {isTransfer && <Tag type="transfer" size="sm" />}
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--c2-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ ...mono, fontSize: 14.5, fontWeight: 700, color: amtColor }}>{amount}</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--c2-muted)' }}>{t.time}</div>
        </div>
      </button>
    );
  }

  // ── Horizontal bar chart (bordered) ───────────────────────
  function BarRows({ rows }) {
    const max = Math.max(...rows.map(r => r.value)) || 1;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((r, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.2, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
              <span style={{ ...mono, fontSize: 12.5, fontWeight: 700, color: 'var(--c2-ink)', flexShrink: 0 }}>{rp(r.value)}</span>
            </div>
            <div style={{ height: 16, border: '2.5px solid var(--c2-ink)', borderRadius: 4, background: 'var(--c2-paper)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(r.value / max) * 100}%`, background: r.color, borderRight: r.value < max ? '2.5px solid var(--c2-ink)' : 'none' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Vertical bar chart (trend: expense vs transfer) ───────
  function BarChart({ data, height = 140 }) {
    const max = Math.max(...data.map(d => Math.max(d.expense, d.transfer))) || 1;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, height, justifyContent: 'space-between' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: height - 24 }}>
              <div style={{ width: 11, height: `${(d.expense / max) * 100}%`, background: 'var(--c2-orange)', border: '2px solid var(--c2-ink)', borderBottom: 'none' }} />
              <div style={{ width: 11, height: `${(d.transfer / max) * 100}%`, background: 'var(--c2-purple)', border: '2px solid var(--c2-ink)', borderBottom: 'none' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--c2-ink)', textTransform: 'uppercase' }}>{d.m}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Section heading ───────────────────────────────────────
  function Head({ title, action, onAction }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{title}</h3>
        {action && <button onClick={onAction} style={{ border: '2px solid var(--c2-ink)', background: 'var(--c2-yellow)', color: '#111', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.3 }}>{action}</button>}
      </div>
    );
  }

  // ── Bottom navigation ─────────────────────────────────────
  function BottomNav({ screen, go }) {
    const items = [
      { id: 'dashboard', label: 'HOME', icon: 'home' },
      { id: 'history', label: 'RIWAYAT', icon: 'history' },
      { id: 'add', icon: 'plus', fab: true },
      { id: 'analytics', label: 'STATS', icon: 'analytics' },
      { id: 'settings', label: 'ATUR', icon: 'settings' },
    ];
    return (
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'var(--c2-paper)', borderTop: '3px solid var(--c2-ink)', padding: '8px 10px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        {items.map(it => {
          if (it.fab) {
            return (
              <button key={it.id} onClick={() => go('add')} style={{
                width: 54, height: 54, marginTop: -30, cursor: 'pointer', fontFamily: 'inherit',
                background: 'var(--c2-purple)', color: '#fff', border: '3px solid var(--c2-ink)', borderRadius: 10,
                boxShadow: '4px 4px 0 var(--c2-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="plus" size={28} stroke={3.2} />
              </button>
            );
          }
          const on = screen === it.id;
          return (
            <button key={it.id} onClick={() => go(it.id)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: on ? 'var(--c2-purple)' : 'var(--c2-ink)',
            }}>
              <Icon name={it.icon} size={24} stroke={on ? 3 : 2.4} />
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.3 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  Object.assign(window, {
    C2: { SEM, ACCT_COLOR, CAT_COLOR, glyphFor, SH, mono },
    C2Block: Block, C2Tag: Tag, C2AccountBlock: AccountBlock, C2TxnRow: TxnRow,
    C2BarRows: BarRows, C2BarChart: BarChart, C2Head: Head, C2BottomNav: BottomNav,
  });
})();
