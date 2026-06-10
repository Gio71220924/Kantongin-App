/** Temporary stub for screens not yet ported. Keeps navigation wired. */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/theme';

export function ComingSoon({
  title,
  subtitle,
  canClose,
}: {
  title: string;
  subtitle?: string;
  canClose?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 12 }}>
      {canClose ? (
        <Pressable onPress={() => router.back()} style={[styles.close, { marginLeft: 18 }]} hitSlop={8}>
          <Icon name="close" size={22} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle ?? 'Layar ini sedang dibangun.'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 6 },
  title: { fontSize: 26, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.6 },
  sub: { fontSize: 14, color: colors.muted, fontFamily: fonts.regular, textAlign: 'center' },
});
