import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, glyphFor } from '@/components/Icon';
import { CategoryId, byCategory, cat as catById, rp } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { catColor, catSoft, colors, fonts, mixHex, semantic } from '@/theme';

const NEAR = '#E8893B';

function spentOf(id: CategoryId): number {
  const b = byCategory.find((x) => x.id === id);
  return b ? b.amount : 0;
}

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const { budgets, setBudgets } = useKantongin();
  const [editing, setEditing] = useState<CategoryId | null>(null);

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + spentOf(b.id), 0);
  const pctTotal = Math.min(100, Math.round((totalSpent / totalLimit) * 100));
  const overCount = budgets.filter((b) => spentOf(b.id) > b.limit).length;

  const adjust = (id: CategoryId, delta: number) =>
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, limit: Math.max(100000, b.limit + delta) } : b)));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <Icon name="chevron" size={19} color={colors.text} />
          </View>
        </Pressable>
        <Text style={styles.h1}>Anggaran</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        {/* total ring */}
        <LinearGradient
          colors={[colors.primary, mixHex(colors.primary, '#0b1020', 0.62)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.total}>
          <Text style={styles.totalLabel}>Sisa anggaran bulan ini</Text>
          <Text style={styles.totalValue}>{rp(Math.max(0, totalLimit - totalSpent))}</Text>
          <View style={styles.totalTrack}>
            <View style={{ height: '100%', borderRadius: 999, backgroundColor: '#fff', width: `${pctTotal}%` }} />
          </View>
          <View style={styles.totalFoot}>
            <Text style={styles.totalFootText}>Terpakai {rp(totalSpent)}</Text>
            <Text style={styles.totalFootText}>Batas {rp(totalLimit)}</Text>
          </View>
        </LinearGradient>

        {overCount > 0 ? (
          <View style={styles.warn}>
            <Icon name="bolt" size={18} stroke={2.4} color={semantic.expense} />
            <Text style={styles.warnText}>
              <Text style={{ color: semantic.expense, fontFamily: fonts.bold }}>{overCount} kategori</Text> melebihi anggaran bulan ini.
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Per Kategori</Text>

        <View style={{ gap: 12 }}>
          {budgets.map((b) => {
            const c = catById(b.id);
            const spent = spentOf(b.id);
            const pct = Math.min(100, Math.round((spent / b.limit) * 100));
            const over = spent > b.limit;
            const near = !over && pct >= 80;
            const barColor = over ? semantic.expense : near ? NEAR : catColor(c.hue);
            const isOpen = editing === b.id;
            return (
              <View key={b.id} style={[styles.card, { borderColor: isOpen ? colors.primary : colors.line, borderWidth: isOpen ? 1.5 : 1 }]}>
                <View style={styles.cardHead}>
                  <View style={[styles.cardIcon, { backgroundColor: catSoft(c.hue) }]}>
                    <Icon name={glyphFor[b.id] ?? 'coins'} size={20} stroke={2} color={catColor(c.hue)} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.cardLabel}>{c.label}</Text>
                    <Text style={[styles.cardSub, over ? { color: semantic.expense, fontFamily: fonts.semibold } : null]}>
                      {rp(spent)} dari {rp(b.limit)}
                      {over ? ` · lebih ${rp(spent - b.limit)}` : ''}
                    </Text>
                  </View>
                  <Pressable onPress={() => setEditing(isOpen ? null : b.id)} hitSlop={8}>
                    <Text style={[styles.adjustToggle, { color: isOpen ? colors.primary : colors.muted }]}>{isOpen ? 'Selesai' : 'Atur'}</Text>
                  </Pressable>
                </View>

                <View style={styles.track}>
                  <View style={{ height: '100%', borderRadius: 999, backgroundColor: barColor, width: `${pct}%` }} />
                </View>

                {isOpen ? (
                  <View style={styles.adjustRow}>
                    <Pressable onPress={() => adjust(b.id, -100000)} style={styles.stepBtn}>
                      <Text style={styles.stepText}>−</Text>
                    </Pressable>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={styles.adjustCap}>Batas anggaran</Text>
                      <Text style={styles.adjustValue}>{rp(b.limit)}</Text>
                    </View>
                    <Pressable onPress={() => adjust(b.id, 100000)} style={styles.stepBtn}>
                      <Text style={styles.stepText}>+</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingBottom: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 24, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.5 },
  total: { borderRadius: 24, padding: 20, marginBottom: 18, overflow: 'hidden' },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.medium },
  totalValue: { fontSize: 30, fontFamily: fonts.extrabold, color: '#fff', letterSpacing: -0.7, marginTop: 4 },
  totalTrack: { height: 9, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden', marginTop: 14 },
  totalFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  totalFootText: { fontSize: 12, color: 'rgba(255,255,255,0.92)', fontFamily: fonts.medium },
  warn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: semantic.expense + '12', borderWidth: 1, borderColor: semantic.expense + '33', borderRadius: 14, paddingVertical: 11, paddingHorizontal: 14, marginBottom: 16 },
  warnText: { flex: 1, fontSize: 13, color: colors.text, fontFamily: fonts.medium },
  sectionLabel: { fontSize: 12, fontFamily: fonts.bold, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginHorizontal: 4, marginBottom: 11, marginTop: 4 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 16 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: 14.5, fontFamily: fonts.bold, color: colors.text },
  cardSub: { fontSize: 12, color: colors.muted, marginTop: 1, fontFamily: fonts.regular },
  adjustToggle: { fontSize: 12.5, fontFamily: fonts.bold },
  track: { height: 9, borderRadius: 999, backgroundColor: colors.line, overflow: 'hidden' },
  adjustRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  stepBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 22, fontFamily: fonts.semibold, color: colors.text, lineHeight: 26 },
  adjustCap: { fontSize: 11, color: colors.muted, fontFamily: fonts.semibold },
  adjustValue: { fontSize: 18, fontFamily: fonts.extrabold, color: colors.primary },
});
