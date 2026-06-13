import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { createClient } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function signInWithGoogle(): Promise<'success' | 'cancelled' | 'error'> {
  const redirectTo = AuthSession.makeRedirectUri();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) return 'error';

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'success') {
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
    return sessionError ? 'error' : 'success';
  }

  return result.type === 'cancel' ? 'cancelled' : 'error';
}

export async function signOut() {
  await supabase.auth.signOut();
}
