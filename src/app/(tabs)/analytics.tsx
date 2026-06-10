import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { BarList, Card, Donut, SectionHead, TrendChart } from '@/components/primitives';
import { acct, byAccount, byCategory, cat, rp, summary, trend } from '@/data/kantongin';
import { catColor, colors, fonts, mixHex, oklchToHex, radius, semantic } from '@/theme';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [month, setMonth] = useState('Jun');

  const catSegs = byCategory.map((b) => ({ value: b.amount, color: catColor(cat(b.id).hue) }));
  const catRows = byCategory.map((b) => ({ label: cat(b.id).label, value: b.amount, color: catColor(cat(b.id).hue) }));
  const acctRows = byAccount.map((b) => ({ label: acct(b.id).name, value: b.amount, color: oklchToHex(0.55, 0.13, acct(b.id).hue) }));
  const transferTotal = trend.find((d) => d.m === 'Jun')!.transfer;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 18, paddingBottom: 8 }}>
        <Text style={styles.h1}>Analitik</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 4 }}>
          {trend.map((d) => {
            const on = month === d.m;
            return (
              <Pressable
                key={d.m}
                onPress={() => setMonth(d.m)}
                style={[styles.chip, on ? { backgroundColor: colors.primary } : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line }]}>
                <Text style={[styles.chipText, { color: on ? '#fff' : colors.muted }]}>{d.m}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 118 }} showsVerticalScrollIndicator={false}>
        {/* spending by category */}
        <SectionHead title="Pengeluaran per Kategori" action="Anggaran" onAction={() => router.push('/budget')} />
        <Card style={{ marginBottom: 20 }}>
          <View style={styles.catTop}>
            <Donut segments={catSegs} size={120} thickness={19} centerTop="Total" centerBottom={rp(summary.expense)} />
            <View style={{ flex: 1 }}>
              <Text style={styles.catTopLabel}>Total pengeluaran {summary.month}</Text>
              <Text style={styles.catTopValue}>{rp(summary.expense)}</Text>
              <Text style={styles.catTopDelta}>↓ 7,5% dari bulan lalu</Text>
            </View>
          </View>
          <BarList rows={catRows} />
        </Card>

        {/* spending per account */}
        <SectionHead title="Pengeluaran per Kantong" />
        <Card style={{ marginBottom: 20 }}>
          <BarList rows={acctRows} />
        </Card>

        {/* monthly trend */}
        <SectionHead title="Tren Bulanan" />
        <Card style={{ marginBottom: 20 }}>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: semantic.expense }]} />
              <Text style={styles.legendText}>Pengeluaran</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: semantic.transfer }]} />
              <Text style={styles.legendText}>Transfer</Text>
            </View>
          </View>
          <TrendChart data={trend} />
        </Card>

        {/* transfer activity — kept separate */}
        <SectionHead title="Aktivitas Transfer" />
        <LinearGradient
          colors={[semantic.transfer, mixHex(semantic.transfer, '#14102e', 0.6)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.transferCard}>
          <View style={styles.transferHead}>
            <View style={styles.transferIcon}>
              <Icon name="swap" size={22} stroke={2.4} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.transferLabel}>Total dipindahkan {summary.month}</Text>
              <Text style={styles.transferValue}>{rp(transferTotal)}</Text>
            </View>
          </View>
          <Text style={styles.transferNote}>
            Transfer antar kantong <Text style={{ fontFamily: fonts.bold }}>tidak termasuk</Text> dalam total pengeluaran — hanya
            perpindahan dana milikmu sendiri.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.6, marginBottom: 12 },
  chip: { paddingVertical: 7, paddingHorizontal: 15, borderRadius: 999 },
  chipText: { fontFamily: fonts.semibold, fontSize: 13 },
  catTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  catTopLabel: { fontSize: 12.5, color: colors.muted, fontFamily: fonts.regular },
  catTopValue: { fontSize: 23, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.5, marginTop: 2, marginBottom: 6 },
  catTopDelta: { fontSize: 12, color: semantic.income, fontFamily: fonts.semibold },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 12.5, color: colors.text, fontFamily: fonts.semibold },
  transferCard: { borderRadius: radius, padding: 18, overflow: 'hidden' },
  transferHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transferIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  transferLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.regular },
  transferValue: { fontSize: 24, fontFamily: fonts.extrabold, color: '#fff', letterSpacing: -0.5 },
  transferNote: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13, marginTop: 14, fontSize: 12.5, lineHeight: 18, color: '#fff', fontFamily: fonts.regular, overflow: 'hidden' },
});
