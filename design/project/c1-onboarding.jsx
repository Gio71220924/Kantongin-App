/* Concept 1 — Onboarding (Modern Fintech) */
function C1Onboarding({ onDone }) {
  const K = window.KANTONGIN;
  const { rp, accounts } = K;
  const Icon = window.C1Icon;
  const { SEM, catColor } = window.C1;
  const R = React;

  const [step, setStep] = R.useState(0);          // 0..2 intro, 3 signup, 4 accounts
  const [picked, setPicked] = R.useState({ bca: true, jago: true, seabank: false, bri: false });
  const [guest, setGuest] = R.useState(false);
  const [success, setSuccess] = R.useState(false);

  const slides = [
    { icon: 'wallet', title: 'Semua kantong\ndalam satu tempat', body: 'Gabungkan saldo BCA, Jago, SeaBank, dan rekening lain — lihat total uangmu sekaligus.', hue: 'var(--c1-primary)' },
    { icon: 'analytics', title: 'Tahu ke mana\nuangmu pergi', body: 'Catat pemasukan dan pengeluaran, atur anggaran per kategori, pantau tren tiap bulan.', hue: SEM.income },
    { icon: 'swap', title: 'Transfer ≠\nPengeluaran', body: 'Pindah dana antar rekeningmu sendiri tidak akan dihitung sebagai pengeluaran. Posisi keuanganmu jadi jelas.', hue: SEM.transfer },
  ];

  // ── Intro carousel ────────────────────────────────────────
  if (step <= 2) {
    const s = slides[step];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c1-bg)', padding: '70px 26px 34px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: 19, color: 'var(--c1-text)', letterSpacing: -0.4 }}>Kantongin</span>
          <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: 'var(--c1-muted)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Lewati</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 116, height: 116, borderRadius: 32, background: s.hue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 38, boxShadow: `0 18px 38px color-mix(in oklch, ${s.hue} 36%, transparent)` }}>
            <Icon name={s.icon} size={54} stroke={1.9} />
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.8, lineHeight: 1.12, whiteSpace: 'pre-line' }}>{s.title}</h1>
          <p style={{ margin: '16px 4px 0', fontSize: 15.5, color: 'var(--c1-muted)', lineHeight: 1.5, maxWidth: 300 }}>{s.body}</p>
          <style>{`@keyframes c1ob{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 26 }}>
          {slides.map((_, i) => (
            <span key={i} style={{ height: 8, width: i === step ? 26 : 8, borderRadius: 999, background: i === step ? 'var(--c1-primary)' : 'var(--c1-line)', transition: 'all .25s' }} />
          ))}
        </div>
        <button onClick={() => setStep(step + 1)} style={{ width: '100%', height: 54, borderRadius: 17, border: 'none', background: 'var(--c1-primary)', color: '#fff', fontSize: 16.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 10px 22px color-mix(in oklch, var(--c1-primary) 36%, transparent)' }}>
          {step === 2 ? 'Mulai' : 'Lanjut'}
        </button>
      </div>
    );
  }

  // ── Sign up ───────────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c1-bg)', padding: '70px 26px 34px' }}>
        <button onClick={() => setStep(2)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chevron" size={19} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <div style={{ marginTop: 28 }}>
          <h1 style={{ margin: 0, fontSize: 27, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.6 }}>Buat akun</h1>
          <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--c1-muted)', lineHeight: 1.45 }}>Datamu aman dan terenkripsi. Hanya butuh sebentar.</p>
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[{ l: 'Nama lengkap', v: 'Sapto Wibowo', i: 'user' }, { l: 'Email', v: 'sapto.w@email.com', i: 'bell' }, { l: 'Kata sandi', v: '••••••••', i: 'wallet' }].map(f => (
            <div key={f.l}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--c1-muted)', margin: '0 2px 7px', textTransform: 'uppercase', letterSpacing: 0.3 }}>{f.l}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 14, padding: '13px 14px' }}>
                <span style={{ fontSize: 15, color: 'var(--c1-text)', fontWeight: 500 }}>{f.v}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <button onClick={() => setStep(4)} style={{ width: '100%', height: 54, borderRadius: 17, border: 'none', background: 'var(--c1-primary)', color: '#fff', fontSize: 16.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 10px 22px color-mix(in oklch, var(--c1-primary) 36%, transparent)', marginBottom: 12 }}>Daftar</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <span style={{ flex: 1, height: 1, background: 'var(--c1-line)' }} />
          <span style={{ fontSize: 12.5, color: 'var(--c1-muted)' }}>atau</span>
          <span style={{ flex: 1, height: 1, background: 'var(--c1-line)' }} />
        </div>
        <button onClick={() => { setGuest(false); setStep(4); }} style={{ width: '100%', height: 50, borderRadius: 15, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 10 }}>Lanjut dengan Google</button>
        <button onClick={() => { setGuest(true); setStep(4); }} style={{ width: '100%', height: 50, borderRadius: 15, border: 'none', background: 'transparent', color: 'var(--c1-primary)', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, whiteSpace: 'nowrap' }}>
          <Icon name="user" size={17} stroke={2.2} /> Lanjut sebagai tamu
        </button>
      </div>
    );
  }

  // ── Pick accounts + balances ──────────────────────────────
  const pickedList = accounts.filter(a => picked[a.id]);
  const total = pickedList.reduce((s, a) => s + a.balance, 0);

  const finish = () => { setSuccess(true); setTimeout(() => onDone(guest), 1150); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c1-bg)', position: 'relative' }}>
      {success && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'var(--c1-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 30, textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--c1-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'c1pop .4s cubic-bezier(.2,1.4,.4,1)', boxShadow: '0 14px 34px color-mix(in oklch, var(--c1-primary) 40%, transparent)' }}>
            <Icon name="check" size={50} stroke={3} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--c1-text)' }}>Kantongmu siap!</div>
          <div style={{ fontSize: 14.5, color: 'var(--c1-muted)' }}>{pickedList.length} kantong · total {rp(total)}</div>
          <style>{`@keyframes c1pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}
      <div style={{ padding: '70px 26px 6px' }}>
        <button onClick={() => setStep(3)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--c1-line)', background: 'var(--c1-card)', color: 'var(--c1-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chevron" size={19} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <h1 style={{ margin: '24px 0 0', fontSize: 26, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.6 }}>Pilih kantongmu</h1>
        <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'var(--c1-muted)', lineHeight: 1.45 }}>Tambahkan rekening yang kamu pakai. Saldo bisa diubah nanti.</p>
        {guest && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, background: 'color-mix(in oklch, var(--c1-primary) 9%, transparent)', border: '1px solid color-mix(in oklch, var(--c1-primary) 28%, transparent)', borderRadius: 12, padding: '9px 12px' }}>
            <Icon name="user" size={16} stroke={2.2} style={{ color: 'var(--c1-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: 'var(--c1-text)', fontWeight: 500, lineHeight: 1.35 }}><b style={{ color: 'var(--c1-primary)' }}>Mode Tamu</b> · data disimpan di perangkat ini. Bisa dibuatkan akun nanti.</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 26px 10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {accounts.map(a => {
            const on = picked[a.id];
            return (
              <button key={a.id} onClick={() => setPicked(p => ({ ...p, [a.id]: !p[a.id] }))} style={{
                display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                background: 'var(--c1-card)', border: on ? `1.5px solid var(--c1-primary)` : '1.5px solid var(--c1-line)',
                borderRadius: 18, padding: 15, transition: 'border .15s',
              }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: `oklch(0.55 0.13 ${a.hue})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{a.name.slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--c1-text)' }}>{a.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--c1-muted)' }}>{a.kind} · {rp(a.balance)}</div>
                </div>
                <span style={{ width: 26, height: 26, borderRadius: 9, border: on ? 'none' : '2px solid var(--c1-line)', background: on ? 'var(--c1-primary)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <Icon name="check" size={16} stroke={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '8px 26px 34px', background: 'var(--c1-bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 4px' }}>
          <span style={{ fontSize: 13.5, color: 'var(--c1-muted)', fontWeight: 500 }}>Total saldo awal</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.3 }}>{rp(total)}</span>
        </div>
        <button onClick={finish} disabled={pickedList.length === 0} style={{ width: '100%', height: 54, borderRadius: 17, border: 'none', cursor: pickedList.length ? 'pointer' : 'not-allowed', background: pickedList.length ? 'var(--c1-primary)' : 'var(--c1-line)', color: pickedList.length ? '#fff' : 'var(--c1-muted)', fontSize: 16.5, fontWeight: 700, fontFamily: 'inherit', boxShadow: pickedList.length ? '0 10px 22px color-mix(in oklch, var(--c1-primary) 36%, transparent)' : 'none' }}>
          Masuk ke Kantongin
        </button>
      </div>
    </div>
  );
}
window.C1Onboarding = C1Onboarding;
