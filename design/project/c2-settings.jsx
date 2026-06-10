/* Concept 2 — Settings (Neo-Brutalism) */
function C2Settings({ go, guest, onExitGuest }) {
  const K = window.KANTONGIN;
  const { accounts } = K;
  const Icon = window.C2Icon;
  const { ACCT_COLOR, SH } = window.C2;
  const R = React;
  const [notif, setNotif] = R.useState(true);
  const [sync, setSync] = R.useState(true);
  const [toast, setToast] = R.useState('');
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 1800); };

  const Group = ({ header, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--c2-ink)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 9px' }}>{header}</div>
      <div style={{ background: 'var(--c2-paper)', border: '3px solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, overflow: 'hidden' }}>{children}</div>
    </div>
  );
  const Row = ({ icon, color, white, title, detail, control, onClick, last }) => (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: onClick ? 'pointer' : 'default',
      background: 'none', border: 'none', padding: '12px 14px', fontFamily: 'inherit', textAlign: 'left',
      borderBottom: last ? 'none' : '2.5px solid var(--c2-ink)',
    }}>
      <div style={{ width: 34, height: 34, background: color, color: white ? '#fff' : '#111', border: '2.5px solid var(--c2-ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={18} stroke={2.6} />
      </div>
      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 800, color: 'var(--c2-ink)' }}>{title}</span>
      {detail && <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--c2-muted)', textTransform: 'uppercase' }}>{detail}</span>}
      {control || (onClick && <Icon name="chevron" size={17} stroke={3} style={{ color: 'var(--c2-ink)' }} />)}
    </button>
  );
  const Toggle = ({ on, set }) => (
    <span onClick={(e) => { e.stopPropagation(); set(v => !v); }} style={{
      width: 50, height: 28, border: '2.5px solid var(--c2-ink)', borderRadius: 4, background: on ? 'var(--c2-teal)' : 'var(--c2-paper)',
      position: 'relative', cursor: 'pointer', flexShrink: 0,
    }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 25 : 2, width: 19, height: 19, background: 'var(--c2-ink)', transition: 'left .15s' }} />
    </span>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--c2-bg)' }}>
      <div style={{ padding: '54px 16px 6px' }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: 'var(--c2-ink)', letterSpacing: -1, textTransform: 'uppercase' }}>Atur</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 120px' }}>
        {/* profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, background: guest ? 'var(--c2-ink)' : 'var(--c2-purple)', color: '#fff', border: '3px solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, padding: 15, marginBottom: guest ? 12 : 20 }}>
          <div style={{ width: 50, height: 50, background: 'var(--c2-yellow)', color: '#111', border: '3px solid #111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22 }}>{guest ? <Icon name="user" size={26} stroke={2.8} /> : 'S'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{guest ? 'Pengguna Tamu' : 'Sapto Wibowo'}</div>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9, textTransform: guest ? 'uppercase' : 'none', letterSpacing: guest ? 0.3 : 0 }}>{guest ? 'Belum ada akun' : 'sapto.w@email.com'}</div>
          </div>
          {!guest && <button style={{ padding: '6px 12px', background: '#fff', color: '#111', border: '2.5px solid #111', borderRadius: 5, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}>Edit</button>}
        </div>
        {guest && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--c2-yellow)', border: '3px solid var(--c2-ink)', borderRadius: 8, boxShadow: SH, padding: '13px 14px', marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 0.3 }}>Simpan datamu!</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111', marginTop: 2, lineHeight: 1.3 }}>Buat akun gratis biar data aman saat ganti HP.</div>
            </div>
            <button onClick={onExitGuest} style={{ flexShrink: 0, padding: '10px 14px', background: 'var(--c2-purple)', color: '#fff', border: '3px solid #111', borderRadius: 6, fontWeight: 900, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}>Buat Akun</button>
          </div>
        )}

        <Group header="Preferensi">
          <Row icon="coins" color="var(--c2-teal)" title="Mata Uang" detail="IDR · Rupiah" onClick={() => flash('Mata uang: Rupiah')} />
          <Row icon="bell" color="var(--c2-orange)" title="Pengingat Notifikasi" control={<Toggle on={notif} set={setNotif} />} last />
        </Group>

        <Group header="Data">
          <Row icon="download" color="var(--c2-yellow)" title="Ekspor Data" detail="CSV / PDF" onClick={() => flash('Menyiapkan ekspor…')} />
          <Row icon="cloud" color="var(--c2-purple)" white title="Cadangkan & Sinkronisasi" control={<Toggle on={sync} set={setSync} />} />
          <Row icon="history" color="var(--c2-teal)" title="Sinkron Terakhir" detail="08:24" last />
        </Group>

        <Group header="Akun & Kantong">
          {accounts.map(a => (
            <Row key={a.id} icon="wallet" color={ACCT_COLOR[a.id]} white={a.id === 'bca'} title={a.name} detail={`••${a.last4}`} onClick={() => {}} />
          ))}
          <Row icon="plus" color="var(--c2-yellow)" title="Tambah Kantong" onClick={() => flash('Tambah rekening baru')} last />
        </Group>

        <Group header="Lainnya">
          <Row icon="user" color="var(--c2-teal)" title="Manajemen Akun" onClick={() => {}} />
          <Row icon="bolt" color="var(--c2-orange)" title="Keluar" onClick={() => {}} last />
        </Group>

        <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 800, color: 'var(--c2-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Kantongin · V1.0.0</div>
      </div>

      {toast && (
        <div style={{ position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)', background: 'var(--c2-ink)', color: '#fff', padding: '9px 16px', border: '2.5px solid var(--c2-ink)', borderRadius: 5, fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', zIndex: 50, boxShadow: SH }}>{toast}</div>
      )}
    </div>
  );
}
window.C2Settings = C2Settings;
