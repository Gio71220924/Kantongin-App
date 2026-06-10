import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { TypeBadge } from '@/components/primitives';
import { acct, cat, rp } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { colors, fonts, semantic } from '@/theme';

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { txns } = useKantongin();
  const t = txns.find((x) => x.id === id);

  if (!t) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.close} hitSlop={8}>
          <Icon name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.notFound}>Transaksi tidak ditemukan.</Text>
      </View>
    );
  }

  const isTransfer = t.type === 'transfer';
  const amtColor = isTransfer ? semantic.transfer : t.type === 'income' ? semantic.income : colors.text;
  const sign = isTransfer ? '' : t.type === 'income' ? '+' : '−';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 18, paddingBottom: 40 }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.close} hitSlop={8}>
          <Icon name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.amountBlock}>
        <TypeBadge type={t.type} />
        <Text style={[styles.amount, { color: amtColor }]}>
          {sign}
          {rp(t.amount)}
        </Text>
        <Text style={styles.title}>{t.title}</Text>
      </View>

      <View style={styles.infoCard}>
        {isTransfer ? (
          <Row label="Rute" value={`${acct(t.from).name} → ${acct(t.to).name}`} highlight />
        ) : (
          <>
            <Row label="Kategori" value={cat(t.cat).label} />
            <Row label="Kantong" value={acct(t.acct).name} />
          </>
        )}
        <Row label="Tanggal" value={t.date} />
        <Row label="Waktu" value={t.time} />
      </View>

      {isTransfer ? (
        <Text style={styles.note}>Transfer antar kantong — tidak dihitung sebagai pengeluaran.</Text>
      ) : null}
    </ScrollView>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight ? { color: semantic.transfer, fontFamily: fonts.bold } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerTitle: { fontSize: 17, fontFamily: fonts.bold, color: colors.text },
  close: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountBlock: { alignItems: 'center', gap: 8, marginVertical: 16 },
  amount: { fontSize: 36, fontFamily: fonts.extrabold, letterSpacing: -1 },
  title: { fontSize: 16, fontFamily: fonts.semibold, color: colors.text },
  infoCard: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  rowLabel: { fontSize: 14, color: colors.muted, fontFamily: fonts.medium },
  rowValue: { fontSize: 14, color: colors.text, fontFamily: fonts.semibold },
  note: { marginTop: 16, fontSize: 13, color: semantic.transfer, fontFamily: fonts.medium, textAlign: 'center' },
  notFound: { textAlign: 'center', marginTop: 40, color: colors.muted, fontFamily: fonts.medium },
});
