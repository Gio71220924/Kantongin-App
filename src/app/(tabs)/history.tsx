import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Card, TxnRow } from '@/components/primitives';
import { TxnType, dayLabel, rp } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { Palette, fonts, oklchToHex, semantic, useColors } from '@/theme';

type TypeFilter = 'all' | TxnType;
type AcctFilter = 'all' | string;

const TYPE_CHIPS: { id: TypeFilter; label: string; color?: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'income', label: 'Pemasukan', color: semantic.income },
  { id: 'expense', label: 'Pengeluaran', color: semantic.expense },
  { id: 'transfer', label: 'Transfer', color: semantic.transfer },
];

function Chip({ on, color, label, onPress }: { on: boolean; color: string; label: string; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { borderColor: on ? color : colors.line, backgroundColor: on ? color + '15' : colors.card }]}>
      <Text style={[styles.chipText, { color: on ? color : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { txns, accounts } = useKantongin();
  const [typeF, setTypeF] = useState<TypeFilter>('all');
  const [acctF, setAcctF] = useState<AcctFilter>('all');
  const [q, setQ] = useState('');
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const filtered = txns.filter((t) => {
    if (typeF !== 'all' && t.type !== typeF) return false;
    if (acctF !== 'all') {
      const hit = t.type === 'transfer' ? t.from === acctF || t.to === acctF : t.acct === acctF;
      if (!hit) return false;
    }
    if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const groups: { date: string; items: typeof filtered }[] = [];
  for (const t of filtered) {
    const g = groups.find((x) => x.date === t.date);
    if (g) g.items.push(t);
    else groups.push({ date: t.date, items: [t] });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 18, paddingBottom: 10 }}>
        <Text style={styles.h1}>Riwayat</Text>

        {/* search */}
        <View style={styles.search}>
          <Icon name="search" size={18} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Cari transaksi"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>

        {/* type filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
          {TYPE_CHIPS.map((c) => (
            <Chip key={c.id} on={typeF === c.id} color={c.color ?? colors.primary} label={c.label} onPress={() => setTypeF(c.id)} />
          ))}
        </ScrollView>

        {/* account filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          <Chip on={acctF === 'all'} color={colors.primary} label="Semua Kantong" onPress={() => setAcctF('all')} />
          {accounts.map((a) => (
            <Chip key={a.id} on={acctF === a.id} color={oklchToHex(0.5, 0.13, a.hue)} label={a.name} onPress={() => setAcctF(a.id)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 6, paddingBottom: 118 }} showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? <Text style={styles.empty}>Tidak ada transaksi yang cocok.</Text> : null}
        {groups.map((g) => {
          const dayExpense = g.items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          return (
            <View key={g.date} style={{ marginBottom: 14 }}>
              <View style={styles.dayHead}>
                <Text style={styles.dayLabel}>{dayLabel(g.date)}</Text>
                {dayExpense > 0 ? <Text style={styles.dayExpense}>−{rp(dayExpense)}</Text> : null}
              </View>
              <Card pad={0} style={{ paddingHorizontal: 16 }}>
                {g.items.map((t, i) => (
                  <View key={t.id} style={i ? styles.divider : undefined}>
                    <TxnRow t={t} onPress={() => router.push({ pathname: '/detail', params: { id: t.id } })} />
                  </View>
                ))}
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  h1: { fontSize: 28, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.6, marginBottom: 14 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 13, marginBottom: 12 },
  searchInput: { flex: 1, fontFamily: fonts.medium, fontSize: 14.5, color: colors.text, padding: 0 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5 },
  chipText: { fontFamily: fonts.semibold, fontSize: 13 },
  dayHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginHorizontal: 4, marginBottom: 6, marginTop: 6 },
  dayLabel: { fontSize: 13, fontFamily: fonts.bold, color: colors.muted },
  dayExpense: { fontSize: 12, color: colors.muted, fontFamily: fonts.medium },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 60, fontSize: 14, fontFamily: fonts.medium },
});
