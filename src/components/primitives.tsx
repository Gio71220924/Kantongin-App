/**
 * Kantongin — Modern Fintech shared UI primitives.
 * Ported from the design's c1-ui.jsx to React Native.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

import { Icon, IconName, glyphFor } from '@/components/Icon';
import {
  Account,
  Transaction,
  acct,
  cat,
  rp,
} from '@/data/kantongin';
import { catColor, catSoft, colors, fonts, oklchToHex, radius, semantic } from '@/theme';

/* ── Card ────────────────────────────────────────────────── */
export function Card({
  children,
  style,
  pad = 18,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pad?: number;
}) {
  return <View style={[styles.card, { padding: pad }, style]}>{children}</View>;
}

/* ── Section header ──────────────────────────────────────── */
export function SectionHead({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle} numberOfLines={1}>
        {title}
      </Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ── Type badge ──────────────────────────────────────────── */
const TYPE_META = {
  income: { c: semantic.income, t: 'Pemasukan', i: 'up' as IconName },
  expense: { c: semantic.expense, t: 'Pengeluaran', i: 'down' as IconName },
  transfer: { c: semantic.transfer, t: 'Transfer', i: 'swap' as IconName },
};
export function TypeBadge({ type, small }: { type: keyof typeof TYPE_META; small?: boolean }) {
  const m = TYPE_META[type];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: m.c + '14', paddingHorizontal: small ? 7 : 9, paddingVertical: small ? 2 : 3 },
      ]}>
      <Icon name={m.i} size={small ? 12 : 13} stroke={2.4} color={m.c} />
      <Text style={{ color: m.c, fontSize: small ? 11 : 12, fontFamily: fonts.semibold }}>{m.t}</Text>
    </View>
  );
}

/* ── Account mini card ───────────────────────────────────── */
export function AccountCard({ a, onPress }: { a: Account; onPress?: () => void }) {
  const base = oklchToHex(0.55, 0.13, a.hue);
  const dark = oklchToHex(0.4, 0.12, a.hue);
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[base, dark]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.acctCard}>
        <View style={styles.acctBlob} />
        <View style={styles.rowBetween}>
          <Text style={styles.acctName}>{a.name}</Text>
          <Text style={styles.acctLast4}>•• {a.last4}</Text>
        </View>
        <Text style={styles.acctKind}>{a.kind}</Text>
        <Text style={styles.acctBalance}>{rp(a.balance)}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/* ── Transaction row ─────────────────────────────────────── */
export function TxnRow({ t, onPress }: { t: Transaction; onPress?: () => void }) {
  const isTransfer = t.type === 'transfer';
  const c = isTransfer ? null : cat(t.cat);
  const hue = isTransfer ? 220 : c!.hue;
  const chipColor = isTransfer ? semantic.transfer : catColor(hue);
  const chipBg = isTransfer ? semantic.transfer + '14' : catSoft(hue);
  const glyph: IconName = isTransfer ? 'swap' : glyphFor[t.cat] ?? 'coins';

  let sub: string;
  let amount: string;
  let amtColor: string;
  if (isTransfer) {
    sub = `${acct(t.from).name} → ${acct(t.to).name}`;
    amount = rp(t.amount);
    amtColor = semantic.transfer;
  } else if (t.type === 'income') {
    sub = `${acct(t.acct).name} · ${c!.label}`;
    amount = '+' + rp(t.amount);
    amtColor = semantic.income;
  } else {
    sub = `${acct(t.acct).name} · ${c!.label}`;
    amount = '−' + rp(t.amount);
    amtColor = colors.text;
  }

  return (
    <Pressable onPress={onPress} style={styles.txnRow}>
      <View style={[styles.txnChip, { backgroundColor: chipBg }]}>
        <Icon name={glyph} size={21} stroke={2} color={chipColor} />
        {isTransfer ? (
          <View style={styles.txnSwapBadge}>
            <Icon name="swap" size={9} stroke={3} color="#fff" />
          </View>
        ) : null}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.txnTitle} numberOfLines={1}>
          {t.title}
        </Text>
        <View style={styles.txnSubRow}>
          {isTransfer ? <Text style={styles.txnTransferTag}>Transfer</Text> : null}
          <Text style={styles.txnSub} numberOfLines={1}>
            {sub}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.txnAmount, { color: amtColor }]}>{amount}</Text>
        <Text style={styles.txnTime}>{t.time}</Text>
      </View>
    </Pressable>
  );
}

/* ── Donut chart ─────────────────────────────────────────── */
export function Donut({
  segments,
  size = 150,
  thickness = 22,
  centerTop,
  centerBottom,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerTop?: string;
  centerBottom?: string;
}) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const half = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G originX={half} originY={half} rotation={-90}>
        <Circle cx={half} cy={half} r={r} fill="none" stroke={colors.line} strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <Circle
              key={i}
              cx={half}
              cy={half}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(len - 3, 0)} ${C}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </G>
      {centerTop ? (
        <SvgText x={half} y={size * 0.46} textAnchor="middle" fontSize={12} fill={colors.muted}>
          {centerTop}
        </SvgText>
      ) : null}
      {centerBottom ? (
        <SvgText
          x={half}
          y={size * 0.6}
          textAnchor="middle"
          fontSize={17}
          fontWeight="700"
          fill={colors.text}>
          {centerBottom}
        </SvgText>
      ) : null}
    </Svg>
  );
}

/* ── Horizontal bar list ─────────────────────────────────── */
export function BarList({ rows }: { rows: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...rows.map((r) => r.value)) || 1;
  return (
    <View style={{ gap: 13 }}>
      {rows.map((r, i) => (
        <View key={i}>
          <View style={styles.barLabelRow}>
            <Text style={styles.barLabel} numberOfLines={1}>
              {r.label}
            </Text>
            <Text style={styles.barValue}>{rp(r.value)}</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={{ height: '100%', borderRadius: 999, backgroundColor: r.color, width: `${(r.value / max) * 100}%` }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ── Trend (grouped bars: expense vs transfer) ───────────── */
export function TrendChart({
  data,
  height = 130,
}: {
  data: { m: string; expense: number; transfer: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.expense, d.transfer))) || 1;
  const barArea = height - 22;
  return (
    <View style={[styles.trendRow, { height }]}>
      {data.map((d, i) => (
        <View key={i} style={styles.trendCol}>
          <View style={[styles.trendBars, { height: barArea }]}>
            <View style={{ width: 9, borderRadius: 5, backgroundColor: semantic.expense, height: (d.expense / max) * barArea }} />
            <View style={{ width: 9, borderRadius: 5, backgroundColor: semantic.transfer, opacity: 0.85, height: (d.transfer / max) * barArea }} />
          </View>
          <Text style={styles.trendLabel}>{d.m}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 11,
  },
  sectionTitle: { fontSize: 16, fontFamily: fonts.bold, color: colors.text, letterSpacing: -0.3, flexShrink: 1 },
  sectionAction: { color: colors.primary, fontSize: 13.5, fontFamily: fonts.semibold },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 999, alignSelf: 'flex-start' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  acctCard: { width: 158, borderRadius: 20, padding: 16, overflow: 'hidden' },
  acctBlob: { position: 'absolute', right: -22, top: -22, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.10)' },
  acctName: { fontSize: 15, fontFamily: fonts.bold, color: '#fff', letterSpacing: 0.2 },
  acctLast4: { fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontFamily: fonts.semibold },
  acctKind: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  acctBalance: { fontSize: 19, fontFamily: fonts.bold, color: '#fff', marginTop: 18, letterSpacing: -0.3 },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  txnChip: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  txnSwapBadge: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: semantic.transfer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  txnTitle: { fontSize: 15, fontFamily: fonts.semibold, color: colors.text },
  txnSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  txnTransferTag: { color: semantic.transfer, fontFamily: fonts.semibold, fontSize: 12.5 },
  txnSub: { fontSize: 12.5, color: colors.muted, flexShrink: 1 },
  txnAmount: { fontSize: 15, fontFamily: fonts.bold, letterSpacing: -0.2 },
  txnTime: { fontSize: 11.5, color: colors.muted },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 },
  barLabel: { fontSize: 13.5, fontFamily: fonts.semibold, color: colors.text, flexShrink: 1 },
  barValue: { fontSize: 13, fontFamily: fonts.bold, color: colors.text, marginLeft: 10 },
  barTrack: { height: 9, borderRadius: 999, backgroundColor: colors.line, overflow: 'hidden' },
  trendRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  trendCol: { flex: 1, alignItems: 'center', gap: 6 },
  trendBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  trendLabel: { fontSize: 11, color: colors.muted, fontFamily: fonts.semibold },
});
