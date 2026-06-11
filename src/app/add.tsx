import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName, glyphFor } from '@/components/Icon';
import {
  CategoryId,
  Transaction,
  categories,
  cat as catById,
  rp,
} from '@/data/kantongin';
import { haptics } from '@/lib/haptics';
import { useKantongin } from '@/store';
import { Palette, catColor, catSoft, fonts, oklchToHex, semantic, useColors } from '@/theme';

type AddType = 'income' | 'expense' | 'transfer';

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const EXPENSE_CATS: CategoryId[] = ['makan', 'transport', 'belanja', 'tagihan', 'hiburan', 'kesehatan'];
const INCOME_CATS: CategoryId[] = ['gaji', 'freelance', 'hadiah', 'belanja'];

function group(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { addTxn, updateTxn, txns, accounts, addAccount } = useKantongin();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editTxn = id ? txns.find((x) => x.id === id) : undefined;
  const isEdit = !!editTxn;

  const [type, setType] = useState<AddType>(editTxn ? editTxn.type : 'expense');
  const [amount, setAmount] = useState(editTxn ? String(editTxn.amount) : '');
  const [catId, setCatId] = useState<CategoryId>(editTxn && editTxn.type !== 'transfer' ? editTxn.cat : 'makan');
  const [acctId, setAcctId] = useState<string>(editTxn && editTxn.type !== 'transfer' ? editTxn.acct : (accounts[0]?.id ?? 'jago'));
  const [fromId, setFromId] = useState<string>(editTxn && editTxn.type === 'transfer' ? editTxn.from : (accounts[0]?.id ?? 'bca'));
  const [toId, setToId] = useState<string>(editTxn && editTxn.type === 'transfer' ? editTxn.to : (accounts[1]?.id ?? 'jago'));
  const [note, setNote] = useState(editTxn ? editTxn.title : '');
  const [success, setSuccess] = useState(false);
  const popScale = useRef(new Animated.Value(0.4)).current;

  const accent = semantic[type];
  const isTransfer = type === 'transfer';
  const amtNum = parseInt(amount || '0', 10);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [dateISO, setDateISO] = useState(() => (isEdit ? editTxn!.date : todayStr));

  const stepDate = (days: number) => {
    setDateISO((prev) => {
      const d = new Date(prev + 'T00:00:00');
      d.setDate(d.getDate() + days);
      const next = d.toISOString().slice(0, 10);
      return next > todayStr ? prev : next;
    });
  };

  const dateDisplay = useMemo(() => {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yesterdayStr = yest.toISOString().slice(0, 10);
    const [y, m, d] = dateISO.split('-');
    const formatted = `${parseInt(d, 10)} ${MONTHS_ID[parseInt(m, 10) - 1]} ${y}`;
    if (dateISO === todayStr) return `Hari ini · ${formatted}`;
    if (dateISO === yesterdayStr) return `Kemarin · ${formatted}`;
    return formatted;
  }, [dateISO, todayStr]);
  const valid = amtNum > 0 && (!isTransfer || fromId !== toId);
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
    const base = isEdit
      ? { id: editTxn!.id, amount: amtNum, date: dateISO, time: editTxn!.time }
      : { id: 'n' + Date.now(), amount: amtNum, date: dateISO, time: 'Baru' };
    const t: Transaction = isTransfer
      ? { ...base, type: 'transfer', title: note || 'Transfer kantong', from: fromId, to: toId }
      : {
          ...base,
          type,
          title: note || (type === 'income' ? 'Pemasukan' : catById(catId).label),
          cat: catId,
          acct: acctId,
        };
    setSuccess(true);
    haptics.success();
    Animated.spring(popScale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }).start();
    setTimeout(() => {
      if (isEdit) updateTxn(t);
      else addTxn(t);
      router.back();
    }, 1050);
  };

  return (
    <View style={{ flex: 1, backgroundColor: isTransfer ? semantic.transfer + '08' : colors.bg }}>
      {/* success overlay */}
      {success ? (
        <View style={styles.overlay}>
          <Animated.View style={[styles.popCircle, { backgroundColor: accent, shadowColor: accent, transform: [{ scale: popScale }] }]}>
            <Icon name="check" size={48} stroke={3} color="#fff" />
          </Animated.View>
          <Text style={styles.successTitle}>{isEdit ? 'Perubahan disimpan' : 'Transaksi tersimpan'}</Text>
          <Text style={styles.successSub}>{isTransfer ? 'Transfer dicatat — bukan pengeluaran' : rp(amtNum)}</Text>
        </View>
      ) : null}

      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Icon name={isEdit ? 'chevron' : 'close'} size={19} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
        {/* type selector */}
        <View style={styles.selector}>
          <TypeTab id="income" label="Pemasukan" icon="up" active={type} onSelect={setType} />
          <TypeTab id="expense" label="Pengeluaran" icon="down" active={type} onSelect={setType} />
          <TypeTab id="transfer" label="Transfer" icon="swap" active={type} onSelect={setType} />
        </View>

        {/* amount */}
        <View style={styles.amountBlock}>
          <Text style={styles.amountLabel}>Jumlah</Text>
          <Text style={[styles.amountValue, { color: amtNum ? accent : colors.line }]}>
            <Text style={styles.amountRp}>Rp</Text>
            {amtNum ? group(amtNum) : '0'}
          </Text>
        </View>

        {isTransfer ? (
          <>
            <View style={styles.transferNote}>
              <Icon name="swap" size={17} stroke={2.4} color={semantic.transfer} />
              <Text style={styles.transferNoteText}>
                Transfer antar rekening{' '}
                <Text style={{ color: semantic.transfer, fontFamily: fonts.bold }}>tidak dihitung sebagai pengeluaran</Text>.
              </Text>
            </View>

            <FieldLabel>Dari Rekening</FieldLabel>
            <AcctPick
              value={fromId}
              accent={accent}
              onPick={(v) => {
                setFromId(v);
                if (v === toId) setToId(accounts.find((a) => a.id !== v)?.id ?? toId);
              }}
            />

            <View style={styles.arrowRow}>
              <View style={styles.arrowCircle}>
                <Icon name="down" size={18} stroke={2.6} color="#fff" />
              </View>
            </View>

            <FieldLabel>Ke Rekening</FieldLabel>
            <AcctPick value={toId} accent={accent} exclude={fromId} onPick={setToId} />
          </>
        ) : (
          <>
            <FieldLabel>Kategori</FieldLabel>
            <View style={styles.chipWrap}>
              {cats.map((c) => {
                const on = catId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCatId(c.id)}
                    style={[styles.chip, { borderColor: on ? catColor(c.hue) : colors.line, backgroundColor: on ? catSoft(c.hue) : colors.card }]}>
                    <Icon name={glyphFor[c.id] ?? 'coins'} size={16} stroke={2.2} color={catColor(c.hue)} />
                    <Text style={[styles.chipText, { color: on ? catColor(c.hue, 0.45) : colors.text }]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <FieldLabel>{type === 'income' ? 'Masuk ke Rekening' : 'Dari Rekening'}</FieldLabel>
            <AcctPick value={acctId} accent={accent} onPick={setAcctId} />
          </>
        )}

        {/* note */}
        <FieldLabel>Catatan</FieldLabel>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Tulis catatan (opsional)"
          placeholderTextColor={colors.muted}
          maxLength={200}
          style={styles.input}
        />

        {/* date */}
        <View style={styles.dateRow}>
          <Icon name="calendar" size={18} color={colors.muted} />
          <Text style={styles.dateText}>{dateDisplay}</Text>
          <Pressable onPress={() => stepDate(-1)} hitSlop={8} style={styles.dateBtn}>
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Icon name="chevron" size={17} color={colors.text} />
            </View>
          </Pressable>
          <Pressable onPress={() => stepDate(1)} hitSlop={8} disabled={dateISO >= todayStr} style={styles.dateBtn}>
            <Icon name="chevron" size={17} color={dateISO >= todayStr ? colors.line : colors.text} />
          </Pressable>
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
        <Pressable onPress={save} disabled={!valid} style={[styles.saveBtn, { backgroundColor: valid ? accent : colors.line }]}>
          <Icon name="check" size={20} stroke={2.6} color={valid ? '#fff' : colors.muted} />
          <Text style={[styles.saveText, { color: valid ? '#fff' : colors.muted }]}>
            {isEdit ? 'Simpan Perubahan' : isTransfer ? 'Simpan Transfer' : 'Simpan Transaksi'}
          </Text>
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
  id: AddType;
  label: string;
  icon: IconName;
  active: AddType;
  onSelect: (t: AddType) => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const on = active === id;
  return (
    <Pressable onPress={() => onSelect(id)} style={[styles.typeTab, { backgroundColor: on ? semantic[id] : 'transparent' }]}>
      <Icon name={icon} size={18} stroke={2.4} color={on ? '#fff' : colors.muted} />
      <Text style={[styles.typeTabText, { color: on ? '#fff' : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

const ACCT_HUES = [28, 218, 168, 256, 330, 45, 150, 290];

function AcctPick({
  value,
  onPick,
  accent,
  exclude,
}: {
  value: string;
  onPick: (id: string) => void;
  accent: string;
  exclude?: string;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { accounts, addAccount } = useKantongin();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const confirmAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const id = 'u' + Date.now();
    const hue = ACCT_HUES[accounts.length % ACCT_HUES.length];
    addAccount({ id, name, kind: 'Kantong', last4: '', balance: 0, hue });
    onPick(id);
    setNewName('');
    setAdding(false);
  };

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
      {adding ? (
        <View style={[styles.acctPick, { borderColor: accent, backgroundColor: accent + '08', gap: 6 }]}>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Nama kantong"
            placeholderTextColor={colors.muted}
            autoFocus
            onSubmitEditing={confirmAdd}
            style={[styles.acctPickText, { color: colors.text, minWidth: 100, padding: 0 }]}
          />
          <Pressable onPress={confirmAdd} hitSlop={8}>
            <Icon name="check" size={16} stroke={2.6} color={accent} />
          </Pressable>
          <Pressable onPress={() => { setAdding(false); setNewName(''); }} hitSlop={8}>
            <Icon name="close" size={14} stroke={2.4} color={colors.muted} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setAdding(true)}
          style={[styles.acctPick, { borderColor: colors.line, backgroundColor: colors.card, borderStyle: 'dashed' }]}>
          <Icon name="plus" size={14} stroke={2.4} color={colors.muted} />
          <Text style={[styles.acctPickText, { color: colors.muted }]}>Baru</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 60, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 18 },
  popCircle: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.33, shadowRadius: 34, shadowOffset: { width: 0, height: 14 }, elevation: 10 },
  successTitle: { fontSize: 18, fontFamily: fonts.extrabold, color: colors.text },
  successSub: { fontSize: 14, color: colors.muted, fontFamily: fonts.medium },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 6 },
  headerTitle: { fontSize: 16.5, fontFamily: fonts.bold, color: colors.text },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  selector: { flexDirection: 'row', gap: 4, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 5, marginBottom: 20 },
  typeTab: { flex: 1, paddingVertical: 9, paddingHorizontal: 4, borderRadius: 13, alignItems: 'center', gap: 3 },
  typeTabText: { fontFamily: fonts.bold, fontSize: 13 },
  amountBlock: { alignItems: 'center', marginBottom: 20 },
  amountLabel: { fontSize: 12.5, color: colors.muted, fontFamily: fonts.semibold, marginBottom: 4 },
  amountValue: { fontSize: 40, fontFamily: fonts.extrabold, letterSpacing: -1 },
  amountRp: { fontSize: 22 },
  transferNote: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: semantic.transfer + '12', borderWidth: 1, borderColor: semantic.transfer + '33', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 13, marginBottom: 18 },
  transferNoteText: { flex: 1, fontSize: 12, color: colors.text, lineHeight: 17, fontFamily: fonts.regular },
  arrowRow: { alignItems: 'center', marginTop: -4, marginBottom: 10 },
  arrowCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: semantic.transfer, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.muted, marginHorizontal: 2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 13, borderRadius: 13, borderWidth: 1.5 },
  chipText: { fontFamily: fonts.semibold, fontSize: 13.5 },
  acctPick: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 13, borderWidth: 1.5 },
  acctDot: { width: 8, height: 8, borderRadius: 4 },
  acctPickText: { fontFamily: fonts.semibold, fontSize: 13.5 },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, fontSize: 14.5, color: colors.text, fontFamily: fonts.medium, marginBottom: 14 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  dateText: { fontSize: 14.5, color: colors.text, flex: 1, fontFamily: fonts.medium },
  dateBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  keypadWrap: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: 14, paddingTop: 12 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  key: { width: '31%', flexGrow: 1, height: 42, borderRadius: 13, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  keyText: { color: colors.text, fontFamily: fonts.semibold },
  saveBtn: { height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveText: { fontSize: 16, fontFamily: fonts.bold },
});
