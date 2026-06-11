/**
 * Floating bottom navigation with a center FAB, matching the design's
 * C1BottomNav. The four routes are real tabs; the FAB opens the Add modal.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@/components/Icon';
import { haptics } from '@/lib/haptics';
import { colors, fonts } from '@/theme';

/** Structural subset of expo-router/react-navigation's tabBar props. */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'index', label: 'Beranda', icon: 'home' },
  { name: 'history', label: 'Riwayat', icon: 'history' },
  { name: 'analytics', label: 'Analitik', icon: 'analytics' },
  { name: 'settings', label: 'Atur', icon: 'settings' },
];

export function BottomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const renderTab = (t: (typeof TABS)[number]) => {
    const routeIndex = state.routes.findIndex((r) => r.name === t.name);
    const focused = state.index === routeIndex;
    return (
      <Pressable key={t.name} style={styles.tab} onPress={() => navigation.navigate(t.name)} hitSlop={6}>
        <Icon name={t.icon} size={23} stroke={focused ? 2.4 : 2} color={focused ? colors.primary : colors.muted} />
        <Text
          style={[
            styles.label,
            { color: focused ? colors.primary : colors.muted, fontFamily: focused ? fonts.bold : fonts.medium },
          ]}>
          {t.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom ? insets.bottom : 16 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {renderTab(TABS[0])}
        {renderTab(TABS[1])}
        <Pressable
          style={styles.fab}
          onPress={() => {
            haptics.light();
            router.push('/add');
          }}>
          <Icon name="plus" size={26} stroke={2.6} color="#fff" />
        </Pressable>
        {renderTab(TABS[2])}
        {renderTab(TABS[3])}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 8 },
  bar: {
    marginHorizontal: 14,
    height: 62,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10.5 },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 18,
    marginTop: -22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
