/* Concept 2 — Onboarding (Neo-Brutalism) */
function C2Onboarding({ onDone }) {
  const K = window.KANTONGIN;
  const { rp, accounts } = K;
  const Icon = window.C2Icon;
  const { ACCT_COLOR, SH, mono } = window.C2;
  const R = React;

  const [step, setStep] = R.useState(0);
  const [picked, setPicked] = R.useState({ bca: true, jago: true, seabank: false, bri: false });
  const [guest, setGuest] = R.useState(false);
  const [success, setSuccess] = R.useState(false);

  const slides = [
    { icon: 'wallet', title: 'SEMUA KANTONG,\nSATU APP', body: 'Gabungkan BCA, Jago, SeaBank & rekening lain. Lihat total uangmu sekaligus.', bg: 'var(--c2-yellow)', ink: '#111' },
    { icon: 'analytics', title: 'LACAK\nSETIAP RUPIAH', body: 'Catat pemasukan & pengeluaran, atur anggaran, pantau tren tiap bulan.', bg: 'var(--c2-teal)', ink: '#111' },
    { icon: 'swap', title: 'TRANSFER ≠\nPENGELUARAN', body: 'Pindah dana antar rekeningmu sendiri TIDAK dihitung pengeluaran. Jelas & jujur.', bg: 'var(--c2-purple)', ink: '#fff' },
  ];

  // ── Intro carousel ────────────────────────────────────────
  if (step <= 2) {
    const s = slides[step];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: s.bg, color: s.ink, padding: '64px 24px 32px', transition: 'background .2s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.8, textTransform: 'uppercase' }}>Kantongin</span>
          <button onClick={() => setStep(3)} style={{ background: s.ink === '#fff' ? '#fff' : '#111', color: s.ink === '#fff' ? '#111' : '#fff', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: '5px 11px', borderRadius: 5, textTransform: 'uppercase' }}>Lewati</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: 104, height: 104, background: '#fff', color: '#111', border: '4px solid #111', borderRadius: 12, boxShadow: '7px 7px 0 #111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 34 }}>
            <Icon name={s.icon} size={52} stroke={2.6} />
          </div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.04, whiteSpace: 'pre-line', textTransform: 'uppercase' }}>{s.title}</h1>
          <p style={{ margin: '18px 0 0', fontSize: 16, fontWeight: 600, lineHeight: 1.5, maxWidth: 320 }}>{s.body}</p>
          <style>{`@keyframes c2ob{from{transform:scale(.5) rotate(-6deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}`}</style>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {slides.map((_, i) => (
            <span key={i} style={{ height: 12, flex: i === step ? 2 : 1, background: i === step ? '#111' : 'transparent', border: '2.5px solid #111', borderRadius: 3, transition: 'flex .25s' }} />
          ))}
        </div>
        <button onClick={() => setStep(step + 1)} style={{ width: '100%', height: 56, background: '#111', color: '#fff', border: '3px solid #111', borderRadius: 8, boxShadow: '5px 5px 0 rgba(0,0,0,0.25)', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {step === 2 ? 'Mulai →' : 'Lanjut →'}
        </button>
      </div>
    );
  }

  // ── Sign up ───────────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)', padding: '64px 24px 32px' }}>
        <button onClick={() => setStep(2)} style={{ width: 42, height: 42, background: 'var(--c2-paper)', border: '3px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Icon name="chevron" size={20} stroke={3} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <div style={{ marginTop: 24 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, textTransform: 'uppercase' }}>Buat Akun</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14.5, fontWeight: 600, color: 'var(--c2-muted)' }}>Data aman & terenkripsi. Cuma butuh sebentar.</p>
        </div>

        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 13 }}>
          {[{ l: 'Nama Lengkap', v: 'Sapto Wibowo' }, { l: 'Email', v: 'sapto.w@email.com' }, { l: 'Kata Sandi', v: '••••••••' }].map(f => (
            <div key={f.l}>
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--c2-ink)', margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: 0.4 }}>{f.l}</div>
              <div style={{ background: 'var(--c2-paper)', border: '3px solid #111', borderRadius: 6, padding: '13px 14px', fontSize: 15, fontWeight: 700, color: 'var(--c2-ink)' }}>{f.v}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <button onClick={() => setStep(4)} style={{ width: '100%', height: 56, background: 'var(--c2-purple)', color: '#fff', border: '3px solid #111', borderRadius: 8, boxShadow: SH, fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Daftar →</button>
        <button onClick={() => { setGuest(false); setStep(4); }} style={{ width: '100%', height: 52, background: 'var(--c2-paper)', color: '#111', border: '3px solid #111', borderRadius: 8, fontSize: 14.5, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', marginBottom: 12 }}>Lanjut dengan Google</button>
        <button onClick={() => { setGuest(true); setStep(4); }} style={{ width: '100%', height: 52, background: '#111', color: '#fff', border: '3px solid #111', borderRadius: 8, boxShadow: SH, fontSize: 13.5, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <Icon name="user" size={17} stroke={2.8} /> Masuk sebagai Tamu
        </button>
      </div>
    );
  }

  // ── Pick accounts ─────────────────────────────────────────
  const pickedList = accounts.filter(a => picked[a.id]);
  const total = pickedList.reduce((s, a) => s + a.balance, 0);
  const finish = () => { setSuccess(true); setTimeout(() => onDone(guest), 1150); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)', position: 'relative' }}>
      {success && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'var(--c2-yellow)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 30, textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, background: '#fff', color: '#111', border: '4px solid #111', borderRadius: 10, boxShadow: '6px 6px 0 #111', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'c2pop .35s cubic-bezier(.2,1.5,.4,1)' }}>
            <Icon name="check" size={54} stroke={3.4} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 0.3 }}>Kantong Siap!</div>
          <div style={{ ...mono, fontSize: 15, fontWeight: 700, color: '#111' }}>{pickedList.length} KANTONG · {rp(total)}</div>
          <style>{`@keyframes c2pop{0%{transform:scale(.4) rotate(-8deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}`}</style>
        </div>
      )}
      <div style={{ padding: '64px 24px 6px' }}>
        <button onClick={() => setStep(3)} style={{ width: 42, height: 42, background: 'var(--c2-paper)', border: '3px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Icon name="chevron" size={20} stroke={3} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <h1 style={{ margin: '20px 0 0', fontSize: 30, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, textTransform: 'uppercase' }}>Pilih Kantong</h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--c2-muted)' }}>Pilih rekening yang kamu pakai. Saldo bisa diubah nanti.</p>
        {guest && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14, background: '#111', color: '#fff', border: '3px solid #111', borderRadius: 6, padding: '9px 12px' }}>
            <Icon name="user" size={17} stroke={2.6} style={{ color: 'var(--c2-yellow)', flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, fontWeight: 800, lineHeight: 1.35, textTransform: 'uppercase', letterSpacing: 0.2 }}>Mode Tamu — data di perangkat ini. Bisa buat akun nanti.</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {accounts.map(a => {
            const on = picked[a.id];
            const col = ACCT_COLOR[a.id];
            const ink = col === 'var(--c2-purple)' ? '#fff' : '#111';
            return (
              <button key={a.id} onClick={() => setPicked(p => ({ ...p, [a.id]: !p[a.id] }))} style={{
                display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                background: on ? col : 'var(--c2-paper)', color: on ? ink : '#111',
                border: '3px solid #111', borderRadius: 8, boxShadow: on ? SH : 'none', padding: 14, transition: 'box-shadow .12s',
              }}>
                <div style={{ width: 46, height: 46, background: '#fff', color: '#111', border: '3px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{a.name.slice(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>{a.name}</div>
                  <div style={{ ...mono, fontSize: 12, fontWeight: 700, opacity: 0.85 }}>{rp(a.balance)}</div>
                </div>
                <span style={{ width: 28, height: 28, border: '3px solid #111', borderRadius: 5, background: on ? '#111' : '#fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <Icon name="check" size={16} stroke={3.4} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '8px 24px 32px', background: 'var(--c2-bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: '#111', color: '#fff', borderRadius: 6, padding: '9px 14px' }}>
          <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.4 }}>Total Saldo Awal</span>
          <span style={{ ...mono, fontSize: 16, fontWeight: 700 }}>{rp(total)}</span>
        </div>
        <button onClick={finish} disabled={pickedList.length === 0} style={{ width: '100%', height: 56, border: '3px solid #111', borderRadius: 8, cursor: pickedList.length ? 'pointer' : 'not-allowed', background: pickedList.length ? 'var(--c2-purple)' : 'var(--c2-line)', color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.5, boxShadow: pickedList.length ? SH : 'none' }}>
          Masuk ke Kantongin →
        </button>
      </div>
    </div>
  );
}
window.C2Onboarding = C2Onboarding;
