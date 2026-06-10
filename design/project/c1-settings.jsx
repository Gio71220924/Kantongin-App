/* Concept 1 — Settings (Pengaturan) */
function C1Settings({ go, guest, onExitGuest }) {
  const K = window.KANTONGIN;
  const { accounts } = K;
  const Icon = window.C1Icon;
  const { SEM } = window.C1;
  const R = React;
  const [notif, setNotif] = R.useState(true);
  const [sync, setSync] = R.useState(true);
  const [toast, setToast] = R.useState('');

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 1800); };

  const Group = ({ header, children }) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c1-muted)', textTransform: 'uppercase', letterSpacing: 0.4, margin: '0 4px 9px' }}>{header}</div>
      <div style={{ background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 18, overflow: 'hidden' }}>{children}</div>
    </div>
  );
  const Row = ({ icon, color, title, detail, control, onClick, last }) => (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 13, width: '100%', cursor: onClick ? 'pointer' : 'default',
      background: 'none', border: 'none', padding: '13px 15px', fontFamily: 'inherit', textAlign: 'left',
      borderBottom: last ? 'none' : '1px solid var(--c1-line)',
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={18} stroke={2.2} />
      </div>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--c1-text)' }}>{title}</span>
      {detail && <span style={{ fontSize: 14, color: 'var(--c1-muted)' }}>{detail}</span>}
      {control || (onClick && <Icon name="chevron" size={16} style={{ color: 'var(--c1-line)' }} />)}
    </button>
  );
  const Toggle = ({ on, set }) => (
    <span onClick={(e) => { e.stopPropagation(); set(v => !v); }} style={{
      width: 46, height: 28, borderRadius: 999, background: on ? SEM.income : 'var(--c1-line)',
      position: 'relative', transition: 'background .2s', cursor: 'pointer', flexShrink: 0,
    }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left .2s' }} />
    </span>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '58px 18px 6px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'var(--c1-text)', letterSpacing: -0.6 }}>Pengaturan</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 118px' }}>
        {/* profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--c1-card)', border: '1px solid var(--c1-line)', borderRadius: 18, padding: 16, marginBottom: guest ? 12 : 22 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: guest ? 'var(--c1-muted)' : 'var(--c1-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 21 }}>{guest ? <Icon name="user" size={26} stroke={2} /> : 'S'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--c1-text)' }}>{guest ? 'Pengguna Tamu' : 'Sapto Wibowo'}</div>
            <div style={{ fontSize: 13, color: 'var(--c1-muted)' }}>{guest ? 'Belum terhubung ke akun' : 'sapto.w@email.com'}</div>
          </div>
          {!guest && <button style={{ padding: '7px 13px', borderRadius: 11, border: '1px solid var(--c1-line)', background: 'var(--c1-bg)', color: 'var(--c1-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>}
        </div>
        {guest && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'color-mix(in oklch, var(--c1-primary) 8%, transparent)', border: '1px solid color-mix(in oklch, var(--c1-primary) 26%, transparent)', borderRadius: 16, padding: '13px 15px', marginBottom: 22 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--c1-text)' }}>Simpan datamu</div>
              <div style={{ fontSize: 12, color: 'var(--c1-muted)', marginTop: 1, lineHeight: 1.3 }}>Buat akun gratis agar data aman saat ganti HP.</div>
            </div>
            <button onClick={onExitGuest} style={{ flexShrink: 0, padding: '9px 15px', borderRadius: 12, border: 'none', background: 'var(--c1-primary)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Buat akun</button>
          </div>
        )}

        <Group header="Preferensi">
          <Row icon="coins" color={SEM.income} title="Mata Uang" detail="IDR · Rupiah" onClick={() => flash('Mata uang: Rupiah')} />
          <Row icon="bell" color="#E8893B" title="Pengingat Notifikasi" control={<Toggle on={notif} set={setNotif} />} last />
        </Group>

        <Group header="Data">
          <Row icon="download" color="var(--c1-primary)" title="Ekspor Data" detail="CSV / PDF" onClick={() => flash('Menyiapkan ekspor…')} />
          <Row icon="cloud" color={SEM.transfer} title="Cadangkan & Sinkronisasi" control={<Toggle on={sync} set={setSync} />} />
          <Row icon="history" color="#7A8794" title="Sinkron terakhir" detail="Hari ini, 08:24" last />
        </Group>

        <Group header="Akun & Kantong">
          {accounts.map((a, i) => (
            <Row key={a.id} icon="wallet" color={`oklch(0.55 0.13 ${a.hue})`} title={a.name} detail={`•• ${a.last4}`} onClick={() => {}} last={false} />
          ))}
          <Row icon="plus" color="var(--c1-primary)" title="Tambah Kantong / Rekening" onClick={() => flash('Tambah rekening baru')} last />
        </Group>

        <Group header="Lainnya">
          <Row icon="user" color="#7A8794" title="Manajemen Akun" onClick={() => {}} />
          <Row icon="bolt" color="#E5484D" title="Keluar" onClick={() => {}} last />
        </Group>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--c1-muted)', marginTop: 6 }}>Kantongin · versi 1.0.0</div>
      </div>

      {toast && (
        <div style={{ position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)', background: 'var(--c1-text)', color: 'var(--c1-card)', padding: '10px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, zIndex: 50, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>{toast}</div>
      )}
    </div>
  );
}
window.C1Settings = C1Settings;
