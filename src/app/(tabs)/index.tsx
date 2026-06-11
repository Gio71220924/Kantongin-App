import { LinearGradient } from 'expo-linear-gradient';
import { Href, Redirect, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@/components/Icon';
import { AccountCard, Card, Donut, SectionHead, TxnRow } from '@/components/primitives';
import { accounts, cat, rp } from '@/data/kantongin';
import { computeByCategory, computeSummary, currentYM } from '@/lib/stats';
import { useKantongin } from '@/store';
import { Palette, catColor, fonts, mixHex, radius, semantic, useColors } from '@/theme';

function Tile({ label, value, color, icon }: { label: string; value: number; color: string; icon: IconName }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.tile}>
      <View style={styles.tileHead}>
        <Icon name={icon} size={14} stroke={2.4} color={color} />
        <Text style={[styles.tileLabel, { color }]}>{label}</Text>
      </View>
      <Text style={styles.tileValue}>{rp(value)}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { txns, hidden, setHidden, guest, onboarded, accountBalances, totalBalance } = useKantongin();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const yearMonth = useMemo(() => currentYM(), []);
  const summary = useMemo(() => computeSummary(txns, yearMonth), [txns, yearMonth]);
  const byCategory = useMemo(() => computeByCategory(txns, yearMonth), [txns, yearMonth]);

  if (!onboarded) return <Redirect href={'/onboarding' as Href} />;

  const segs = byCategory.map((b) => ({ value: b.amount, color: catColor(cat(b.id).hue) }));
  const recent = txns.slice(0, 5);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 18, paddingBottom: 118 }}
      showsVerticalScrollIndicator={false}>
      {/* greeting */}
      <View style={styles.greeting}>
        <View style={[styles.avatar, { backgroundColor: guest ? colors.muted : colors.primary }]}>
          {guest ? <Icon name="user" size={22} color="#fff" /> : <Text style={styles.avatarText}>S</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.greetHi}>Selamat pagi,</Text>
          <Text style={styles.greetName}>{guest ? 'Pengguna Tamu' : 'Sapto Wibowo'}</Text>
        </View>
        <View style={styles.bellBtn}>
          <Icon name="bell" size={20} color={colors.text} />
          <View style={styles.bellDot} />
        </View>
      </View>

      {/* total balance hero */}
      <LinearGradient
        colors={[colors.primary, mixHex(colors.primary, '#0b1020', 0.62)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroBlobA} />
        <View style={styles.heroBlobB} />
        <View style={styles.rowBetween}>
          <Text style={styles.heroLabel}>Total Saldo · semua kantong</Text>
          <Pressable onPress={() => setHidden((h) => !h)} style={styles.heroEye}>
            <Icon name={hidden ? 'eyeoff' : 'eye'} size={17} color="#fff" />
          </Pressable>
        </View>
        <Text style={styles.heroBalance}>{hidden ? 'Rp • • • • • • •' : rp(totalBalance)}</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Masuk bulan ini</Text>
            <Text style={styles.heroStatValue}>+{rp(summary.income)}</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Keluar bulan ini</Text>
            <Text style={styles.heroStatValue}>−{rp(summary.expense)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* accounts */}
      <SectionHead title="Kantong Saya" action="Kelola" onAction={() => router.navigate('/settings')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 6 }}
        style={{ marginBottom: 22 }}>
        {accounts.map((a) => (
          <AccountCard key={a.id} a={{ ...a, balance: accountBalances[a.id] ?? a.balance }} onPress={() => router.navigate('/analytics')} />
        ))}
      </ScrollView>

      {/* monthly summary */}
      <SectionHead title={`Ringkasan · ${summary.month}`} />
      <View style={styles.tilesRow}>
        <Tile label="Masuk" value={summary.income} color={semantic.income} icon="up" />
        <Tile label="Keluar" value={summary.expense} color={semantic.expense} icon="down" />
      </View>
      <View style={styles.transferBanner}>
        <View style={styles.transferIcon}>
          <Icon name="swap" size={20} stroke={2.2} color={semantic.transfer} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.transferTitle}>Transfer antar kantong</Text>
          <Text style={styles.transferSub}>
            Pindah dana — <Text style={{ color: semantic.transfer, fontFamily: fonts.bold }}>bukan pengeluaran</Text>
          </Text>
        </View>
        <Text style={styles.transferAmount}>{rp(summary.transfer)}</Text>
      </View>

      {/* spending by category */}
      <SectionHead title="Pengeluaran per Kategori" action="Anggaran" onAction={() => router.push('/budget')} />
      <Card style={styles.categoryCard}>
        <Donut segments={segs} size={132} thickness={20} centerTop="Total keluar" centerBottom={rp(summary.expense)} />
        <View style={{ flex: 1, gap: 8 }}>
          {byCategory.length === 0 ? <Text style={styles.emptyCategory}>Belum ada{'\n'}pengeluaran.</Text> : null}
          {byCategory.slice(0, 5).map((b) => {
            const c = cat(b.id);
            const pct = Math.round((b.amount / summary.expense) * 100);
            return (
              <View key={b.id} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: catColor(c.hue) }]} />
                <Text style={styles.legendLabel}>{c.label}</Text>
                <Text style={styles.legendPct}>{pct}%</Text>
              </View>
            );
          })}
        </View>
      </Card>

      {/* recent transactions */}
      <SectionHead title="Transaksi Terbaru" action="Lihat semua" onAction={() => router.navigate('/history')} />
      <Card pad={0} style={{ paddingHorizontal: 16 }}>
        {recent.map((t, i) => (
          <View key={t.id} style={i ? styles.txnDivider : undefined}>
            <TxnRow t={t} onPress={() => router.push({ pathname: '/detail', params: { id: t.id } })} />
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: fonts.bold, fontSize: 17 },
  greetHi: { fontSize: 13, color: colors.muted, fontFamily: fonts.regular },
  greetName: { fontSize: 17, fontFamily: fonts.bold, color: colors.text },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: { position: 'absolute', top: 10, right: 11, width: 7, height: 7, borderRadius: 3.5, backgroundColor: semantic.expense },
  hero: { borderRadius: 24, padding: 20, marginBottom: 18, overflow: 'hidden' },
  heroBlobA: { position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroBlobB: { position: 'absolute', right: 24, bottom: -40, width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.06)' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.medium },
  heroEye: { backgroundColor: 'rgba(255,255,255,0.18)', width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  heroBalance: { fontSize: 33, fontFamily: fonts.extrabold, color: '#fff', marginTop: 8, letterSpacing: -0.8 },
  heroStats: { flexDirection: 'row', gap: 8, marginTop: 16 },
  heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12, paddingVertical: 7, paddingHorizontal: 11 },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: fonts.regular },
  heroStatValue: { fontSize: 14, fontFamily: fonts.bold, color: '#fff', marginTop: 1 },
  tilesRow: { flexDirection: 'row', gap: 9, marginBottom: 10 },
  tile: { flex: 1, backgroundColor: colors.card, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 13, borderWidth: 1, borderColor: colors.line },
  tileHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tileLabel: { fontSize: 12, fontFamily: fonts.semibold },
  tileValue: { fontSize: 15.5, fontFamily: fonts.bold, color: colors.text, marginTop: 6, letterSpacing: -0.3 },
  transferBanner: {
    backgroundColor: semantic.transfer + '0F',
    borderWidth: 1,
    borderColor: semantic.transfer + '33',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },
  transferIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: semantic.transfer + '1F', alignItems: 'center', justifyContent: 'center' },
  transferTitle: { fontSize: 13.5, fontFamily: fonts.bold, color: colors.text },
  transferSub: { fontSize: 11.5, color: colors.muted, marginTop: 1, fontFamily: fonts.regular },
  transferAmount: { fontSize: 16, fontFamily: fonts.extrabold, color: semantic.transfer },
  categoryCard: { marginBottom: 22, flexDirection: 'row', alignItems: 'center', gap: 16 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 9, height: 9, borderRadius: 3 },
  legendLabel: { fontSize: 12.5, color: colors.text, flex: 1, fontFamily: fonts.medium },
  legendPct: { fontSize: 12, color: colors.muted, fontFamily: fonts.semibold },
  txnDivider: { borderTopWidth: 1, borderTopColor: colors.line },
  emptyCategory: { fontSize: 12.5, color: colors.muted, fontFamily: fonts.medium, textAlign: 'center' },
});
