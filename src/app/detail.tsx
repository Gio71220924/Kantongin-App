import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName, glyphFor } from '@/components/Icon';
import { acct, cat as catById, dayLabel, rp } from '@/data/kantongin';
import { useKantongin } from '@/store';
import { catColor, catSoft, colors, fonts, oklchToHex, semantic } from '@/theme';

const TYPE_LABEL = { income: 'Pemasukan', expense: 'Pengeluaran', transfer: 'Transfer' } as const;

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { txns, deleteTxn } = useKantongin();
  const [confirm, setConfirm] = useState(false);
  const txn = txns.find((x) => x.id === id);

  if (!txn) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <Icon name="chevron" size={19} color={colors.text} />
          </View>
        </Pressable>
        <Text style={styles.notFound}>Transaksi tidak ditemukan.</Text>
      </View>
    );
  }

  const isTransfer = txn.type === 'transfer';
  const c = isTransfer ? null : catById(txn.cat);
  const hue = c ? c.hue : 220;
  const accent = semantic[txn.type];
  const sign = txn.type === 'income' ? '+' : txn.type === 'expense' ? '−' : '';
  const amtColor = txn.type === 'income' ? semantic.income : txn.type === 'transfer' ? semantic.transfer : colors.text;
  const glyph: IconName = isTransfer ? 'swap' : glyphFor[txn.cat] ?? 'coins';
  const typeIcon: IconName = txn.type === 'income' ? 'up' : txn.type === 'expense' ? 'down' : 'swap';

  const openEdit = () => router.push({ pathname: '/add', params: { id: txn.id } });

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <Icon name="chevron" size={19} color={colors.text} />
          </View>
        </Pressable>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <Pressable onPress={openEdit} style={styles.iconBtn} hitSlop={8}>
          <Icon name="settings" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        {/* hero amount */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: isTransfer ? semantic.transfer + '15' : catSoft(hue) }]}>
            <Icon name={glyph} size={32} stroke={2} color={isTransfer ? semantic.transfer : catColor(hue)} />
          </View>
          <Text style={[styles.heroAmount, { color: amtColor }]}>
            {sign}
            {rp(txn.amount)}
          </Text>
          <Text style={styles.heroTitle}>{txn.title}</Text>
          <View style={[styles.badge, { backgroundColor: accent + '14' }]}>
            <Icon name={typeIcon} size={14} stroke={2.6} color={accent} />
            <Text style={[styles.badgeText, { color: accent }]}>{TYPE_LABEL[txn.type]}</Text>
          </View>
        </View>

        {/* transfer route */}
        {isTransfer ? (
          <View style={styles.routeCard}>
            <View style={styles.routeRow}>
              {[acct(txn.from), acct(txn.to)].map((a, i) => (
                <View key={a.id} style={styles.routeItemWrap}>
                  <View style={styles.routeItem}>
                    <Text style={styles.routeCap}>{i === 0 ? 'DARI' : 'KE'}</Text>
                    <View style={[styles.routeAvatar, { backgroundColor: oklchToHex(0.55, 0.13, a.hue) }]}>
                      <Text style={styles.routeAvatarText}>{a.name.slice(0, 2)}</Text>
                    </View>
                    <Text style={styles.routeName}>{a.name}</Text>
                    <Text style={styles.routeLast4}>•• {a.last4}</Text>
                  </View>
                  {i === 0 ? (
                    <View style={styles.routeChevron}>
                      <Icon name="chevron" size={16} stroke={2.6} color="#fff" />
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
            <Text style={styles.routeNote}>Perpindahan dana — tidak mengurangi total pengeluaran</Text>
          </View>
        ) : null}

        {/* fields */}
        <View style={styles.fieldsCard}>
          {!isTransfer ? <Field label="Kategori" value={c ? c.label : '—'} /> : null}
          {!isTransfer ? (
            <Field label={txn.type === 'income' ? 'Masuk ke' : 'Rekening'} value={`${acct(txn.acct).name} ·· ${acct(txn.acct).last4}`} />
          ) : null}
          <Field label="Tanggal" value={`${dayLabel(txn.date)}, 2026`} />
          <Field label="Waktu" value={txn.time === 'Baru' ? 'Baru saja' : txn.time} />
          <Field label="ID Transaksi" value={`#${txn.id.toUpperCase()}`} mono last />
        </View>

        {/* note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Catatan</Text>
          <Text style={styles.noteText}>{txn.title}</Text>
        </View>

        {/* actions */}
        <View style={styles.actions}>
          <Pressable onPress={openEdit} style={styles.editBtn}>
            <Icon name="settings" size={18} color={colors.text} />
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
          <Pressable onPress={() => setConfirm(true)} style={styles.deleteBtn}>
            <Icon name="close" size={18} stroke={2.4} color={semantic.expense} />
            <Text style={styles.deleteText}>Hapus</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* delete confirmation sheet */}
      <Modal visible={confirm} transparent animationType="slide" onRequestClose={() => setConfirm(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setConfirm(false)}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetIcon}>
              <Icon name="close" size={28} stroke={2.4} color={semantic.expense} />
            </View>
            <Text style={styles.sheetTitle}>Hapus transaksi ini?</Text>
            <Text style={styles.sheetSub}>
              {txn.title} · {rp(txn.amount)}. Tindakan ini tidak bisa dibatalkan.
            </Text>
            <Pressable
              style={styles.sheetDelete}
              onPress={() => {
                deleteTxn(txn.id);
                setConfirm(false);
                router.back();
              }}>
              <Text style={styles.sheetDeleteText}>Ya, hapus</Text>
            </Pressable>
            <Pressable style={styles.sheetCancel} onPress={() => setConfirm(false)}>
              <Text style={styles.sheetCancelText}>Batal</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Field({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <View style={[styles.field, last ? null : styles.fieldBorder]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={[styles.fieldValue, mono ? styles.fieldMono : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 6 },
  headerTitle: { fontSize: 16.5, fontFamily: fonts.bold, color: colors.text },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 22 },
  heroIcon: { width: 66, height: 66, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroAmount: { fontSize: 32, fontFamily: fonts.extrabold, letterSpacing: -0.8 },
  heroTitle: { fontSize: 15, color: colors.muted, marginTop: 4, fontFamily: fonts.medium },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 14, marginTop: 12 },
  badgeText: { fontSize: 13, fontFamily: fonts.bold },
  routeCard: { backgroundColor: semantic.transfer + '0D', borderWidth: 1, borderColor: semantic.transfer + '33', borderRadius: 18, padding: 16, marginBottom: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  routeItemWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  routeItem: { flex: 1, alignItems: 'center' },
  routeCap: { fontSize: 11, color: colors.muted, fontFamily: fonts.semibold, marginBottom: 5 },
  routeAvatar: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  routeAvatarText: { color: '#fff', fontFamily: fonts.extrabold, fontSize: 13 },
  routeName: { fontSize: 13.5, fontFamily: fonts.bold, color: colors.text },
  routeLast4: { fontSize: 11, color: colors.muted },
  routeChevron: { width: 30, height: 30, borderRadius: 15, backgroundColor: semantic.transfer, alignItems: 'center', justifyContent: 'center' },
  routeNote: { marginTop: 14, textAlign: 'center', fontSize: 12, color: semantic.transfer, fontFamily: fonts.semibold, backgroundColor: colors.card, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, overflow: 'hidden' },
  fieldsCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 18, paddingHorizontal: 16, marginBottom: 16 },
  field: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  fieldLabel: { fontSize: 13.5, color: colors.muted, fontFamily: fonts.medium },
  fieldValue: { fontSize: 14.5, color: colors.text, fontFamily: fonts.semibold, textAlign: 'right', maxWidth: '62%' },
  fieldMono: { fontFamily: 'monospace', fontSize: 12.5 },
  noteCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 16, marginBottom: 22 },
  noteLabel: { fontSize: 12, color: colors.muted, fontFamily: fonts.bold, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 },
  noteText: { fontSize: 14.5, color: colors.text, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, height: 50, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  editText: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  deleteBtn: { flex: 1, height: 50, borderRadius: 15, backgroundColor: semantic.expense + '15', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  deleteText: { fontFamily: fonts.bold, fontSize: 15, color: semantic.expense },
  notFound: { textAlign: 'center', marginTop: 40, color: colors.muted, fontFamily: fonts.medium },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 24 },
  sheetIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: semantic.expense + '15', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { textAlign: 'center', fontSize: 18, fontFamily: fonts.extrabold, color: colors.text },
  sheetSub: { textAlign: 'center', fontSize: 14, color: colors.muted, marginTop: 6, marginBottom: 20, fontFamily: fonts.regular },
  sheetDelete: { height: 52, borderRadius: 15, backgroundColor: semantic.expense, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  sheetDeleteText: { color: '#fff', fontFamily: fonts.bold, fontSize: 15.5 },
  sheetCancel: { height: 52, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  sheetCancelText: { color: colors.text, fontFamily: fonts.bold, fontSize: 15.5 },
});
