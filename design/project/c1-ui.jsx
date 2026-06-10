/* Concept 1 — Modern Fintech : shared UI primitives + charts
   Reads window.KANTONGIN, window.C1Icon. Theme via CSS vars (--c1-*). */
(function () {
  const K = window.KANTONGIN;
  const Icon = window.C1Icon;
  const { rp, acct, cat } = K;

  // Semantic colors (fixed; primary brand color is tweakable via --c1-primary)
  const SEM = { income: '#12936A', expense: '#E5484D', transfer: '#6D4AFF' };
  const catColor = (hue, l = 0.62, c = 0.15) => `oklch(${l} ${c} ${hue})`;
  const catSoft  = (hue) => `oklch(0.95 0.04 ${hue})`;

  const glyphFor = { makan: 'food', transport: 'car', belanja: 'bag', tagihan: 'bolt', hiburan: 'play', kesehatan: 'plus', gaji: 'wallet', transfer: 'swap' };

  // ── Type chip ─────────────────────────────────────────────
  function TypeBadge({ type, small }) {
    const map = {
      income:   { c: SEM.income,   t: 'Pemasukan', i: 'up'   },
      expense:  { c: SEM.expense,  t: 'Pengeluaran', i: 'down' },
      transfer: { c: SEM.transfer, t: 'Transfer',  i: 'swap' },
    };
    const m = map[type];
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: small ? 11 : 12, fontWeight: 600, color: m.c,
        background: m.c + '14', borderRadius: 999, padding: small ? '2px 7px' : '3px 9px',
        letterSpacing: -0.1,
      }}>
        <Icon name={m.i} size={small ? 12 : 13} stroke={2.4} />
        {m.t}
      </span>
    );
  }

  // ── Account mini card (horizontal scroller) ───────────────
  function AccountCard({ a, onClick, active }) {
    const base = `oklch(0.55 0.13 ${a.hue})`;
    const dark = `oklch(0.40 0.12 ${a.hue})`;
    return (
      <button onClick={onClick} style={{
        flex: '0 0 auto', width: 158, textAlign: 'left', cursor: 'pointer',
        border: 'none', borderRadius: 20, padding: 16, color: '#fff',
        background: `linear-gradient(150deg, ${base}, ${dark})`,
        boxShadow: active ? `0 0 0 2.5px var(--c1-bg), 0 0 0 4.5px ${base}` : '0 6px 16px rgba(15,23,42,0.10)',
        position: 'relative', overflow: 'hidden', fontFamily: 'inherit',
      }}>
        <div style={{ position: 'absolute', right: -22, top: -22, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.2 }}>{a.name}</span>
          <span style={{ fontSize: 10.5, opacity: 0.85, fontWeight: 600 }}>•• {a.last4}</span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{a.kind}</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 18, letterSpacing: -0.3 }}>{rp(a.balance)}</div>
      </button>
    );
  }

  // ── Transaction row ───────────────────────────────────────
  function TxnRow({ t, onClick, showDay }) {
    const isTransfer = t.type === 'transfer';
    const c = cat(t.cat);
    const hue = isTransfer ? null : (c ? c.hue : 220);
    const chipColor = isTransfer ? SEM.transfer : catColor(hue);
    const chipBg = isTransfer ? SEM.transfer + '14' : catSoft(hue);
    const glyph = isTransfer ? 'swap' : glyphFor[t.cat] || 'coins';
    let sub, amount, amtColor;
    if (isTransfer) {
      sub = `${acct(t.from).name} → ${acct(t.to).name}`;
      amount = rp(t.amount);
      amtColor = SEM.transfer;
    } else if (t.type === 'income') {
      sub = `${acct(t.acct).name} · ${c ? c.label : ''}`;
      amount = '+' + rp(t.amount);
      amtColor = SEM.income;
    } else {
      sub = `${acct(t.acct).name} · ${c ? c.label : ''}`;
      amount = '−' + rp(t.amount);
      amtColor = '#0F172A';
    }
    return (
      <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        background: 'none', border: 'none', cursor: 'pointer', padding: '11px 0',
        fontFamily: 'inherit', textAlign: 'left',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13, flexShrink: 0,
          background: chipBg, color: chipColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Icon name={glyph} size={21} stroke={2} />
          {isTransfer && (
            <span style={{ position: 'absolute', right: -3, bottom: -3, width: 17, height: 17, borderRadius: '50%', background: SEM.transfer, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--c1-card)' }}>
              <Icon name="swap" size={9} stroke={3} />
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--c1-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--c1-muted)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
            {isTransfer && <span style={{ color: SEM.transfer, fontWeight: 600 }}>Transfer</span>}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: amtColor, letterSpacing: -0.2 }}>{amount}</div>
          <div style={{ fontSize: 11.5, color: 'var(--c1-muted)' }}>{t.time}</div>
        </div>
      </button>
    );
  }

  // ── Donut chart ───────────────────────────────────────────
  function Donut({ segments, size = 150, thickness = 22, centerTop, centerBottom }) {
    const r = (size - thickness) / 2;
    const C = 2 * Math.PI * r;
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let offset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c1-line)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * C;
            const el = (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={s.color} strokeWidth={thickness} strokeLinecap="round"
                strokeDasharray={`${Math.max(len - 3, 0)} ${C}`} strokeDashoffset={-offset} />
            );
            offset += len;
            return el;
          })}
        </g>
        {centerTop && (
          <text x="50%" y="46%" textAnchor="middle" fontSize="12" fill="var(--c1-muted)" fontFamily="inherit">{centerTop}</text>
        )}
        {centerBottom && (
          <text x="50%" y="60%" textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--c1-text)" fontFamily="inherit">{centerBottom}</text>
        )}
      </svg>
    );
  }

  // ── Horizontal bar list ───────────────────────────────────
  function BarList({ rows }) {
    const max = Math.max(...rows.map(r => r.value)) || 1;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {rows.map((r, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--c1-text)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c1-text)', flexShrink: 0, marginLeft: 10 }}>{rp(r.value)}</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'var(--c1-line)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(r.value / max) * 100}%`, borderRadius: 999, background: r.color, transition: 'width .5s cubic-bezier(.2,.8,.2,1)' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Trend (grouped bars: expense vs transfer) ─────────────
  function TrendChart({ data, height = 130 }) {
    const max = Math.max(...data.map(d => Math.max(d.expense, d.transfer))) || 1;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, height, justifyContent: 'space-between' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: height - 22 }}>
              <div title="Pengeluaran" style={{ width: 9, height: `${(d.expense / max) * 100}%`, background: SEM.expense, borderRadius: 5 }} />
              <div title="Transfer" style={{ width: 9, height: `${(d.transfer / max) * 100}%`, background: SEM.transfer, borderRadius: 5, opacity: 0.85 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--c1-muted)', fontWeight: 600 }}>{d.m}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Card wrapper ──────────────────────────────────────────
  function Card({ children, style, pad = 18 }) {
    return (
      <div style={{
        background: 'var(--c1-card)', borderRadius: 'var(--c1-radius)',
        padding: pad, boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)',
        border: '1px solid var(--c1-line)', ...style,
      }}>{children}</div>
    );
  }
  function SectionHead({ title, action, onAction }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 11px' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--c1-text)', letterSpacing: -0.3, whiteSpace: 'nowrap' }}>{title}</h3>
        {action && <button onClick={onAction} style={{ border: 'none', background: 'none', color: 'var(--c1-primary)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{action}</button>}
      </div>
    );
  }

  // ── Bottom navigation ─────────────────────────────────────
  function BottomNav({ screen, go }) {
    const items = [
      { id: 'dashboard', label: 'Beranda', icon: 'home' },
      { id: 'history', label: 'Riwayat', icon: 'history' },
      { id: 'add', label: '', icon: 'plus', fab: true },
      { id: 'analytics', label: 'Analitik', icon: 'analytics' },
      { id: 'settings', label: 'Atur', icon: 'settings' },
    ];
    return (
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
        paddingBottom: 26, paddingTop: 8,
        background: 'linear-gradient(to top, var(--c1-card) 72%, transparent)',
      }}>
        <div style={{
          margin: '0 14px', height: 62, borderRadius: 24, background: 'var(--c1-card)',
          boxShadow: '0 8px 28px rgba(15,23,42,0.12)', border: '1px solid var(--c1-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 6px',
        }}>
          {items.map(it => {
            if (it.fab) {
              return (
                <button key={it.id} onClick={() => go('add')} style={{
                  width: 52, height: 52, borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: 'var(--c1-primary)', color: '#fff', marginTop: -22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 18px color-mix(in oklch, var(--c1-primary) 45%, transparent)',
                }}>
                  <Icon name="plus" size={26} stroke={2.6} />
                </button>
              );
            }
            const on = screen === it.id;
            return (
              <button key={it.id} onClick={() => go(it.id)} style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                color: on ? 'var(--c1-primary)' : 'var(--c1-muted)', fontFamily: 'inherit',
              }}>
                <Icon name={it.icon} size={23} stroke={on ? 2.4 : 2} />
                <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  Object.assign(window, {
    C1: { SEM, catColor, catSoft, glyphFor },
    C1TypeBadge: TypeBadge, C1AccountCard: AccountCard, C1TxnRow: TxnRow,
    C1Donut: Donut, C1BarList: BarList, C1TrendChart: TrendChart,
    C1Card: Card, C1SectionHead: SectionHead, C1BottomNav: BottomNav,
  });
})();
