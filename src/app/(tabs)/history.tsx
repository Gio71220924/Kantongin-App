import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, TxnRow } from '@/components/primitives';
import { dayLabel } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { colors, fonts } from '@/theme';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { txns } = useKantongin();

  // group by date, newest first (txns are already newest-first)
  const groups: { date: string; items: typeof txns }[] = [];
  for (const t of txns) {
    const g = groups.find((x) => x.date === t.date);
    if (g) g.items.push(t);
    else groups.push({ date: t.date, items: [t] });
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 18, paddingBottom: 118 }}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.h1}>Riwayat</Text>
      <Text style={styles.sub}>Semua transaksi · transfer ditandai jelas</Text>

      {groups.map((g) => (
        <View key={g.date} style={{ marginTop: 18 }}>
          <Text style={styles.dayLabel}>{dayLabel(g.date)}</Text>
          <Card pad={0} style={{ paddingHorizontal: 16 }}>
            {g.items.map((t, i) => (
              <View key={t.id} style={i ? styles.divider : undefined}>
                <TxnRow t={t} onPress={() => router.push({ pathname: '/detail', params: { id: t.id } })} />
              </View>
            ))}
          </Card>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.8 },
  sub: { fontSize: 13.5, color: colors.muted, marginTop: 3, fontFamily: fonts.regular },
  dayLabel: { fontSize: 13, fontFamily: fonts.bold, color: colors.muted, marginBottom: 8, marginLeft: 4 },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
});
