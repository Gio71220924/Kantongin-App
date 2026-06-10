import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName, glyphFor } from '@/components/Icon';
import {
  AccountId,
  CategoryId,
  Transaction,
  accounts,
  categories,
  cat as catById,
} from '@/data/kantongin';
import { useKantongin } from '@/store';
import { catColor, catSoft, colors, fonts, oklchToHex, semantic } from '@/theme';

type FlowType = 'income' | 'expense';

const EXPENSE_CATS: CategoryId[] = ['makan', 'transport', 'belanja', 'tagihan', 'hiburan', 'kesehatan'];
const INCOME_CATS: CategoryId[] = ['gaji', 'belanja'];

function group(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const { addTxn } = useKantongin();

  const [type, setType] = useState<FlowType>('expense');
  const [amount, setAmount] = useState('');
  const [catId, setCatId] = useState<CategoryId>('makan');
  const [acctId, setAcctId] = useState<AccountId>('jago');
  const [note, setNote] = useState('');

  const accent = semantic[type];
  const amtNum = parseInt(amount || '0', 10);
  const valid = amtNum > 0;
  const cats = categories.filter((c) => (type === 'income' ? INCOME_CATS : EXPENSE_CATS).includes(c.id));

  const press = (k: string) => {
    setAmount((prev) => {
      if (k === 'del') return prev.slice(0, -1);
      if (k === '000') return prev === '' ? '' : (prev + '000').slice(0, 12);
      return (prev + k).replace(/^0+/, '').slice(0, 12);
    });
  };

  const save = () => {
    if (!valid) return;
    const t: Transaction = {
      id: 'n' + Date.now(),
      type,
      title: note || (type === 'income' ? 'Pemasukan' : catById(catId).label),
      amount: amtNum,
      date: '2026-06-04',
      time: 'Baru',
      cat: catId,
      acct: acctId,
    };
    addTxn(t);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Icon name="close" size={19} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Tambah Transaksi</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
        {/* type selector */}
        <View style={styles.selector}>
          <TypeTab id="income" label="Pemasukan" icon="up" active={type} onSelect={setType} />
          <TypeTab id="expense" label="Pengeluaran" icon="down" active={type} onSelect={setType} />
        </View>

        {/* amount */}
        <View style={styles.amountBlock}>
          <Text style={styles.amountLabel}>Jumlah</Text>
          <Text style={[styles.amountValue, { color: amtNum ? accent : colors.line }]}>
            <Text style={styles.amountRp}>Rp</Text>
            {amtNum ? group(amtNum) : '0'}
          </Text>
        </View>

        {/* category */}
        <FieldLabel>Kategori</FieldLabel>
        <View style={styles.chipWrap}>
          {cats.map((c) => {
            const on = catId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCatId(c.id)}
                style={[
                  styles.chip,
                  {
                    borderColor: on ? catColor(c.hue) : colors.line,
                    backgroundColor: on ? catSoft(c.hue) : colors.card,
                  },
                ]}>
                <Icon name={glyphFor[c.id] ?? 'coins'} size={16} stroke={2.2} color={catColor(c.hue)} />
                <Text style={[styles.chipText, { color: on ? catColor(c.hue, 0.45) : colors.text }]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* account */}
        <FieldLabel>{type === 'income' ? 'Masuk ke Rekening' : 'Dari Rekening'}</FieldLabel>
        <AcctPick value={acctId} onPick={setAcctId} accent={accent} />

        {/* note */}
        <FieldLabel>Catatan</FieldLabel>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Tulis catatan (opsional)"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        {/* date */}
        <View style={styles.dateRow}>
          <Icon name="calendar" size={18} color={colors.muted} />
          <Text style={styles.dateText}>Hari ini · 4 Juni 2026</Text>
          <Icon name="chevron" size={16} color={colors.muted} />
        </View>
      </ScrollView>

      {/* keypad + save */}
      <View style={[styles.keypadWrap, { paddingBottom: insets.bottom ? insets.bottom + 8 : 26 }]}>
        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'del'].map((k) => (
            <Pressable key={k} onPress={() => press(k)} style={styles.key}>
              <Text style={[styles.keyText, { fontSize: k === 'del' ? 16 : 20 }]}>{k === 'del' ? '⌫' : k}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={save}
          disabled={!valid}
          style={[styles.saveBtn, { backgroundColor: valid ? accent : colors.line }]}>
          <Icon name="check" size={20} stroke={2.6} color={valid ? '#fff' : colors.muted} />
          <Text style={[styles.saveText, { color: valid ? '#fff' : colors.muted }]}>Simpan Transaksi</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TypeTab({
  id,
  label,
  icon,
  active,
  onSelect,
}: {
  id: FlowType;
  label: string;
  icon: IconName;
  active: FlowType;
  onSelect: (t: FlowType) => void;
}) {
  const on = active === id;
  return (
    <Pressable onPress={() => onSelect(id)} style={[styles.typeTab, { backgroundColor: on ? semantic[id] : 'transparent' }]}>
      <Icon name={icon} size={18} stroke={2.4} color={on ? '#fff' : colors.muted} />
      <Text style={[styles.typeTabText, { color: on ? '#fff' : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

function AcctPick({
  value,
  onPick,
  accent,
  exclude,
}: {
  value: AccountId;
  onPick: (id: AccountId) => void;
  accent: string;
  exclude?: AccountId;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }} style={{ marginBottom: 18 }}>
      {accounts
        .filter((a) => a.id !== exclude)
        .map((a) => {
          const on = value === a.id;
          return (
            <Pressable
              key={a.id}
              onPress={() => onPick(a.id)}
              style={[styles.acctPick, { borderColor: on ? accent : colors.line, backgroundColor: on ? accent + '12' : colors.card }]}>
              <View style={[styles.acctDot, { backgroundColor: oklchToHex(0.55, 0.13, a.hue) }]} />
              <Text style={[styles.acctPickText, { color: on ? accent : colors.text }]}>{a.name}</Text>
            </Pressable>
          );
        })}
    </ScrollView>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 6 },
  headerTitle: { fontSize: 16.5, fontFamily: fonts.bold, color: colors.text },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selector: { flexDirection: 'row', gap: 4, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 5, marginBottom: 20 },
  typeTab: { flex: 1, paddingVertical: 9, paddingHorizontal: 4, borderRadius: 13, alignItems: 'center', gap: 3 },
  typeTabText: { fontFamily: fonts.bold, fontSize: 13 },
  amountBlock: { alignItems: 'center', marginBottom: 20 },
  amountLabel: { fontSize: 12.5, color: colors.muted, fontFamily: fonts.semibold, marginBottom: 4 },
  amountValue: { fontSize: 40, fontFamily: fonts.extrabold, letterSpacing: -1 },
  amountRp: { fontSize: 22 },
  fieldLabel: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.muted, marginHorizontal: 2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 13, borderRadius: 13, borderWidth: 1.5 },
  chipText: { fontFamily: fonts.semibold, fontSize: 13.5 },
  acctPick: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 13, borderWidth: 1.5 },
  acctDot: { width: 8, height: 8, borderRadius: 4 },
  acctPickText: { fontFamily: fonts.semibold, fontSize: 13.5 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14.5,
    color: colors.text,
    fontFamily: fonts.medium,
    marginBottom: 14,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14 },
  dateText: { fontSize: 14.5, color: colors.text, flex: 1, fontFamily: fonts.medium },
  keypadWrap: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: 14, paddingTop: 12 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  key: { width: '31%', flexGrow: 1, height: 42, borderRadius: 13, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  keyText: { color: colors.text, fontFamily: fonts.semibold },
  saveBtn: { height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveText: { fontSize: 16, fontFamily: fonts.bold },
});
