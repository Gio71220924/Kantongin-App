import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@/components/Icon';
import { accounts } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { Palette, ThemeMode, fonts, oklchToHex, semantic, useColors, useThemeMode, withAlpha } from '@/theme';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.toggle, { backgroundColor: on ? semantic.income : colors.line }]}>
      <View style={[styles.knob, { left: on ? 21 : 3 }]} />
    </Pressable>
  );
}

function Row({
  icon,
  color,
  title,
  detail,
  control,
  onPress,
  last,
}: {
  icon: IconName;
  color: string;
  title: string;
  detail?: string;
  control?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable onPress={onPress} style={[styles.row, last ? null : styles.rowBorder]}>
      <View style={[styles.rowIcon, { backgroundColor: withAlpha(color, 0.094) }]}>
        <Icon name={icon} size={18} stroke={2.2} color={color} />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      {control ?? (onPress ? <Icon name="chevron" size={16} color={colors.line} /> : null)}
    </Pressable>
  );
}

function Group({ header, children }: { header: string; children: React.ReactNode }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={styles.groupHeader}>{header}</Text>
      <View style={styles.groupBody}>{children}</View>
    </View>
  );
}

const APPEARANCE_OPTS: { label: string; value: ThemeMode }[] = [
  { label: 'Sistem', value: 'system' },
  { label: 'Terang', value: 'light' },
  { label: 'Gelap', value: 'dark' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { guest, setGuest } = useKantongin();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { mode, setMode } = useThemeMode();
  const [notif, setNotif] = useState(true);
  const [sync, setSync] = useState(true);
  const [toast, setToast] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flash = (m: string) => {
    setToast(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 1800);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 18, paddingBottom: 6 }}>
        <Text style={styles.h1}>Pengaturan</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 118 }} showsVerticalScrollIndicator={false}>
        {/* profile */}
        <View style={[styles.profile, { marginBottom: guest ? 12 : 22 }]}>
          <View style={[styles.avatar, { backgroundColor: guest ? colors.muted : colors.primary }]}>
            {guest ? <Icon name="user" size={26} stroke={2} color="#fff" /> : <Text style={styles.avatarText}>S</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{guest ? 'Pengguna Tamu' : 'Sapto Wibowo'}</Text>
            <Text style={styles.profileMeta}>{guest ? 'Belum terhubung ke akun' : 'sapto.w@email.com'}</Text>
          </View>
          {!guest ? (
            <Pressable style={styles.editBtn} onPress={() => flash('Edit profil')}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          ) : null}
        </View>

        {guest ? (
          <View style={styles.guestBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.guestTitle}>Simpan datamu</Text>
              <Text style={styles.guestSub}>Buat akun gratis agar data aman saat ganti HP.</Text>
            </View>
            <Pressable style={styles.guestBtn} onPress={() => setGuest(false)}>
              <Text style={styles.guestBtnText}>Buat akun</Text>
            </Pressable>
          </View>
        ) : null}

        <Group header="Tampilan">
          <View style={styles.appearRow}>
            {APPEARANCE_OPTS.map(({ label, value }) => {
              const on = mode === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setMode(value)}
                  style={[styles.appearBtn, on ? { backgroundColor: colors.primary } : null]}>
                  <Text style={[styles.appearBtnText, { color: on ? '#fff' : colors.muted }]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Group>

        <Group header="Preferensi">
          <Row icon="coins" color={semantic.income} title="Mata Uang" detail="IDR · Rupiah" onPress={() => flash('Mata uang: Rupiah')} />
          <Row icon="bell" color="#E8893B" title="Pengingat Notifikasi" control={<Toggle on={notif} onToggle={() => setNotif((v) => !v)} />} last />
        </Group>

        <Group header="Data">
          <Row icon="download" color={colors.primary} title="Ekspor Data" detail="CSV / PDF" onPress={() => flash('Menyiapkan ekspor…')} />
          <Row icon="cloud" color={semantic.transfer} title="Cadangkan & Sinkronisasi" control={<Toggle on={sync} onToggle={() => setSync((v) => !v)} />} />
          <Row icon="history" color="#7A8794" title="Sinkron terakhir" detail="Hari ini, 08:24" last />
        </Group>

        <Group header="Akun & Kantong">
          {accounts.map((a) => (
            <Row key={a.id} icon="wallet" color={oklchToHex(0.55, 0.13, a.hue)} title={a.name} detail={`•• ${a.last4}`} onPress={() => flash(`${a.name} · •• ${a.last4}`)} />
          ))}
          <Row icon="plus" color={colors.primary} title="Tambah Kantong / Rekening" onPress={() => flash('Tambah rekening baru')} last />
        </Group>

        <Group header="Lainnya">
          <Row icon="user" color="#7A8794" title="Manajemen Akun" onPress={() => flash('Manajemen akun')} />
          <Row icon="bolt" color={semantic.expense} title="Keluar" onPress={() => flash('Keluar')} last />
        </Group>

        <Text style={styles.version}>Kantongin · versi 1.0.0</Text>
      </ScrollView>

      {toast ? (
        <View style={[styles.toastWrap, { bottom: insets.bottom + 96 }]} pointerEvents="none">
          <Text style={styles.toast}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  h1: { fontSize: 28, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.6 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 16 },
  avatar: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: fonts.bold, fontSize: 21 },
  profileName: { fontSize: 17, fontFamily: fonts.bold, color: colors.text },
  profileMeta: { fontSize: 13, color: colors.muted, fontFamily: fonts.regular, marginTop: 1 },
  editBtn: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.bg },
  editText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 13 },
  guestBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: withAlpha(colors.primary, 0.08), borderWidth: 1, borderColor: withAlpha(colors.primary, 0.26), borderRadius: 16, paddingVertical: 13, paddingHorizontal: 15, marginBottom: 22 },
  guestTitle: { fontSize: 13.5, fontFamily: fonts.bold, color: colors.text },
  guestSub: { fontSize: 12, color: colors.muted, marginTop: 1, lineHeight: 16, fontFamily: fonts.regular },
  guestBtn: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 12, backgroundColor: colors.primary },
  guestBtnText: { color: '#fff', fontFamily: fonts.bold, fontSize: 13 },
  groupHeader: { fontSize: 12, fontFamily: fonts.bold, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginHorizontal: 4, marginBottom: 9 },
  groupBody: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 15 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { flex: 1, fontSize: 15, fontFamily: fonts.medium, color: colors.text },
  rowDetail: { fontSize: 14, color: colors.muted, fontFamily: fonts.regular },
  toggle: { width: 46, height: 28, borderRadius: 999, justifyContent: 'center' },
  knob: { position: 'absolute', top: 3, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  appearRow: { flexDirection: 'row', padding: 8, gap: 6 },
  appearBtn: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  appearBtnText: { fontSize: 13.5, fontFamily: fonts.semibold },
  version: { textAlign: 'center', fontSize: 12, color: colors.muted, marginTop: 6, fontFamily: fonts.regular },
  toastWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  toast: { backgroundColor: colors.text, color: colors.card, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, fontSize: 13.5, fontFamily: fonts.semibold, overflow: 'hidden' },
});
