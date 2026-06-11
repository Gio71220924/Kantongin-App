import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@/components/Icon';
import { AccountId, accounts, rp } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { colors, fonts, oklchToHex, semantic, withAlpha } from '@/theme';

const SLIDES: { icon: IconName; title: string; body: string; hue: string }[] = [
  {
    icon: 'wallet',
    title: 'Semua kantong\ndalam satu tempat',
    body: 'Gabungkan saldo BCA, Jago, SeaBank, dan rekening lain — lihat total uangmu sekaligus.',
    hue: colors.primary,
  },
  {
    icon: 'analytics',
    title: 'Tahu ke mana\nuangmu pergi',
    body: 'Catat pemasukan dan pengeluaran, atur anggaran per kategori, pantau tren tiap bulan.',
    hue: semantic.income,
  },
  {
    icon: 'swap',
    title: 'Transfer ≠\nPengeluaran',
    body: 'Pindah dana antar rekeningmu sendiri tidak akan dihitung sebagai pengeluaran. Posisi keuanganmu jadi jelas.',
    hue: semantic.transfer,
  },
];

const SIGNUP_FIELDS = [
  { label: 'Nama lengkap', value: 'Sapto Wibowo' },
  { label: 'Email', value: 'sapto.w@email.com' },
  { label: 'Kata sandi', value: '••••••••' },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { setGuest, setOnboarded } = useKantongin();

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<AccountId, boolean>>({ bca: true, jago: true, seabank: false, bri: false });
  const [guest, setGuestLocal] = useState(false);
  const [success, setSuccess] = useState(false);
  const popScale = useRef(new Animated.Value(0.4)).current;

  const top = insets.top + 28;
  const bottom = insets.bottom + 20;

  const pickedList = accounts.filter((a) => picked[a.id]);
  const total = pickedList.reduce((s, a) => s + a.balance, 0);

  const finish = () => {
    setSuccess(true);
    Animated.spring(popScale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }).start();
    setTimeout(() => {
      setGuest(guest);
      setOnboarded(true);
      router.replace('/');
    }, 1150);
  };

  // ── Intro carousel ──
  if (step <= 2) {
    const s = SLIDES[step];
    return (
      <View style={[styles.fill, { paddingTop: top, paddingBottom: bottom, paddingHorizontal: 26 }]}>
        <View style={styles.introTop}>
          <Text style={styles.brand}>Kantongin</Text>
          <Pressable onPress={() => setStep(3)} hitSlop={8}>
            <Text style={styles.skip}>Lewati</Text>
          </Pressable>
        </View>

        <View style={styles.introBody}>
          <View style={[styles.introIcon, { backgroundColor: s.hue, shadowColor: s.hue }]}>
            <Icon name={s.icon} size={54} stroke={1.9} color="#fff" />
          </View>
          <Text style={styles.introTitle}>{s.title}</Text>
          <Text style={styles.introText}>{s.body}</Text>
        </View>

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, { width: i === step ? 26 : 8, backgroundColor: i === step ? colors.primary : colors.line }]} />
          ))}
        </View>
        <Pressable style={styles.primaryBtn} onPress={() => setStep(step + 1)}>
          <Text style={styles.primaryBtnText}>{step === 2 ? 'Mulai' : 'Lanjut'}</Text>
        </Pressable>
      </View>
    );
  }

  // ── Sign up ──
  if (step === 3) {
    return (
      <View style={[styles.fill, { paddingTop: top, paddingBottom: bottom, paddingHorizontal: 26 }]}>
        <Pressable onPress={() => setStep(2)} style={styles.backBtn} hitSlop={8}>
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <Icon name="chevron" size={19} color={colors.text} />
          </View>
        </Pressable>

        <View style={{ marginTop: 28 }}>
          <Text style={styles.h1}>Buat akun</Text>
          <Text style={styles.lede}>Datamu aman dan terenkripsi. Hanya butuh sebentar.</Text>
        </View>

        <View style={{ marginTop: 28, gap: 12 }}>
          {SIGNUP_FIELDS.map((f) => (
            <View key={f.label}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <View style={styles.field}>
                <Text style={styles.fieldValue}>{f.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable style={styles.primaryBtn} onPress={() => { setGuestLocal(false); setStep(4); }}>
          <Text style={styles.primaryBtnText}>Daftar</Text>
        </Pressable>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>atau</Text>
          <View style={styles.dividerLine} />
        </View>
        <Pressable style={styles.outlineBtn} onPress={() => { setGuestLocal(false); setStep(4); }}>
          <Text style={styles.outlineBtnText}>Lanjut dengan Google</Text>
        </Pressable>
        <Pressable style={styles.guestLink} onPress={() => { setGuestLocal(true); setStep(4); }}>
          <Icon name="user" size={17} stroke={2.2} color={colors.primary} />
          <Text style={styles.guestLinkText}>Lanjut sebagai tamu</Text>
        </Pressable>
      </View>
    );
  }

  // ── Pick accounts ──
  return (
    <View style={styles.fill}>
      {success ? (
        <View style={styles.successOverlay}>
          <Animated.View style={[styles.popCircle, { transform: [{ scale: popScale }] }]}>
            <Icon name="check" size={50} stroke={3} color="#fff" />
          </Animated.View>
          <Text style={styles.successTitle}>Kantongmu siap!</Text>
          <Text style={styles.successSub}>
            {pickedList.length} kantong · total {rp(total)}
          </Text>
        </View>
      ) : null}

      <View style={{ paddingTop: top, paddingHorizontal: 26 }}>
        <Pressable onPress={() => setStep(3)} style={styles.backBtn} hitSlop={8}>
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <Icon name="chevron" size={19} color={colors.text} />
          </View>
        </Pressable>
        <Text style={[styles.h1, { marginTop: 24 }]}>Pilih kantongmu</Text>
        <Text style={styles.lede}>Tambahkan rekening yang kamu pakai. Saldo bisa diubah nanti.</Text>
        {guest ? (
          <View style={styles.guestBadge}>
            <Icon name="user" size={16} stroke={2.2} color={colors.primary} />
            <Text style={styles.guestBadgeText}>
              <Text style={{ color: colors.primary, fontFamily: fonts.bold }}>Mode Tamu</Text> · data disimpan di perangkat ini. Bisa
              dibuatkan akun nanti.
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 26, paddingTop: 18, paddingBottom: 10, gap: 11 }} showsVerticalScrollIndicator={false}>
        {accounts.map((a) => {
          const on = picked[a.id];
          return (
            <Pressable
              key={a.id}
              onPress={() => setPicked((p) => ({ ...p, [a.id]: !p[a.id] }))}
              style={[styles.acctRow, { borderColor: on ? colors.primary : colors.line }]}>
              <View style={[styles.acctAvatar, { backgroundColor: oklchToHex(0.55, 0.13, a.hue) }]}>
                <Text style={styles.acctAvatarText}>{a.name.slice(0, 2)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.acctName}>{a.name}</Text>
                <Text style={styles.acctMeta}>
                  {a.kind} · {rp(a.balance)}
                </Text>
              </View>
              <View style={[styles.check, on ? { backgroundColor: colors.primary } : { borderWidth: 2, borderColor: colors.line }]}>
                {on ? <Icon name="check" size={16} stroke={3} color="#fff" /> : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ paddingHorizontal: 26, paddingTop: 8, paddingBottom: bottom }}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total saldo awal</Text>
          <Text style={styles.totalValue}>{rp(total)}</Text>
        </View>
        <Pressable
          onPress={finish}
          disabled={pickedList.length === 0}
          style={[styles.primaryBtn, pickedList.length === 0 ? { backgroundColor: colors.line } : null]}>
          <Text style={[styles.primaryBtnText, pickedList.length === 0 ? { color: colors.muted } : null]}>Masuk ke Kantongin</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  introTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontFamily: fonts.extrabold, fontSize: 19, color: colors.text, letterSpacing: -0.4 },
  skip: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 14 },
  introBody: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  introIcon: { width: 116, height: 116, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 38, shadowOpacity: 0.36, shadowRadius: 38, shadowOffset: { width: 0, height: 18 }, elevation: 10 },
  introTitle: { fontSize: 28, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.8, lineHeight: 32, textAlign: 'center' },
  introText: { marginTop: 16, fontSize: 15.5, color: colors.muted, lineHeight: 23, textAlign: 'center', maxWidth: 300, fontFamily: fonts.regular },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 26 },
  dot: { height: 8, borderRadius: 999 },
  primaryBtn: { height: 54, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.36, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  primaryBtnText: { color: '#fff', fontSize: 16.5, fontFamily: fonts.bold },
  backBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 27, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.6 },
  lede: { marginTop: 8, fontSize: 15, color: colors.muted, lineHeight: 22, fontFamily: fonts.regular },
  fieldLabel: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.muted, marginHorizontal: 2, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.3 },
  field: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 14 },
  fieldValue: { fontSize: 15, color: colors.text, fontFamily: fonts.medium },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4, marginTop: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { fontSize: 12.5, color: colors.muted, fontFamily: fonts.regular },
  outlineBtn: { height: 50, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  outlineBtnText: { color: colors.text, fontSize: 15, fontFamily: fonts.bold },
  guestLink: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 4 },
  guestLinkText: { color: colors.primary, fontSize: 15, fontFamily: fonts.bold },
  guestBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, backgroundColor: withAlpha(colors.primary, 0.09), borderWidth: 1, borderColor: withAlpha(colors.primary, 0.28), borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12 },
  guestBadgeText: { flex: 1, fontSize: 12.5, color: colors.text, lineHeight: 17, fontFamily: fonts.medium },
  acctRow: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: colors.card, borderWidth: 1.5, borderRadius: 18, padding: 15 },
  acctAvatar: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  acctAvatarText: { color: '#fff', fontFamily: fonts.extrabold, fontSize: 15 },
  acctName: { fontSize: 15.5, fontFamily: fonts.bold, color: colors.text },
  acctMeta: { fontSize: 12.5, color: colors.muted, fontFamily: fonts.regular },
  check: { width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  totalLabel: { fontSize: 13.5, color: colors.muted, fontFamily: fonts.medium },
  totalValue: { fontSize: 18, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.3 },
  successOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 60, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 30 },
  popCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 34, shadowOffset: { width: 0, height: 14 }, elevation: 10 },
  successTitle: { fontSize: 20, fontFamily: fonts.extrabold, color: colors.text },
  successSub: { fontSize: 14.5, color: colors.muted, fontFamily: fonts.medium },
});
