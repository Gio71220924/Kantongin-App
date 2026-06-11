import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Palette, fonts, useColors } from '@/theme';

export function AppLock({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [unlocked, setUnlocked] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [failed, setFailed] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const authenticating = useRef(false);
  const unlockedRef = useRef(false); // ref copy so listeners always see current value

  const attempt = async () => {
    if (authenticating.current || unlockedRef.current) return;
    authenticating.current = true;
    setFailed(false);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Buka Kantongin',
        fallbackLabel: 'Gunakan kode',
        cancelLabel: 'Batal',
        disableDeviceFallback: false,
      });
      if (result.success) {
        unlockedRef.current = true;
        setUnlocked(true);
      } else {
        setFailed(true);
      }
    } finally {
      authenticating.current = false;
    }
  };

  useEffect(() => {
    (async () => {
      const hw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hw || !enrolled) {
        setUnlocked(true);
        return;
      }
      setBiometricAvailable(true);
      attempt();
    })();
  }, []);

  useEffect(() => {
    if (!biometricAvailable) return;
    const sub = AppState.addEventListener('change', (next) => {
      if (
        appState.current === 'active' &&
        (next === 'background' || next === 'inactive')
      ) {
        // Don't re-lock if the Face ID / passcode sheet is what caused the transition
        if (!authenticating.current) {
          unlockedRef.current = false;
          setUnlocked(false);
          setFailed(false);
        }
      } else if (appState.current !== 'active' && next === 'active') {
        if (!authenticating.current && !unlockedRef.current) {
          attempt();
        }
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [biometricAvailable]);

  if (unlocked) return <>{children}</>;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + '1A' }]}>
        <Icon name="wallet" size={44} color={colors.primary} />
      </View>
      <Text style={styles.title}>Kantongin</Text>
      <Text style={styles.sub}>
        {failed ? 'Autentikasi gagal. Coba lagi.' : 'Buka kunci untuk melanjutkan'}
      </Text>
      <Pressable onPress={attempt} style={[styles.btn, { backgroundColor: colors.primary }]}>
        <Icon name="user" size={18} color="#fff" />
        <Text style={styles.btnText}>Buka dengan Face ID</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  iconWrap: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.6 },
  sub: { fontSize: 14, color: colors.muted, fontFamily: fonts.regular, textAlign: 'center', marginBottom: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, marginTop: 4 },
  btnText: { fontSize: 15.5, fontFamily: fonts.bold, color: '#fff' },
});
