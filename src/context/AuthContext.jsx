import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { getMyProfile } from '../services/profileService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  // Sinkronisasi sesi Supabase (login/logout dari tab lain, refresh token, tautan reset password).
  // Jangan memanggil API Supabase lain (await) di dalam callback onAuthStateChange: berisiko deadlock.
  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setSessionLoading(false);
      })
      .catch(() => {
        if (active) setSessionLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
      // Hapus cache saat logout agar data akun sebelumnya tidak terbawa ke akun berikutnya.
      if (event === 'SIGNED_OUT') queryClient.clear();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const userId = session?.user?.id ?? null;

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getMyProfile(userId),
    enabled: Boolean(userId),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const profile = profileQuery.data ?? null;

  // Profil gagal dimuat atau akun dinonaktifkan -> akhiri sesi di perangkat ini.
  useEffect(() => {
    if (!userId) return;
    if (profileQuery.isError) {
      setNotice('Profil akun tidak dapat dimuat. Coba lagi atau hubungi pengurus kelas.');
      void supabase.auth.signOut({ scope: 'local' });
    } else if (profile && !profile.is_active) {
      setNotice('Akun ini dinonaktifkan. Hubungi pengurus kelas.');
      void supabase.auth.signOut({ scope: 'local' });
    }
  }, [userId, profileQuery.isError, profile]);

  const clearNotice = useCallback(() => setNotice(null), []);

  const value = useMemo(() => {
    const user =
      profile && profile.is_active && session
        ? {
            id: profile.id,
            email: session.user.email ?? '',
            name: profile.name,
            nim: profile.nim,
            role: profile.role,
          }
        : null;
    const loading = sessionLoading || (userId !== null && profileQuery.isPending);
    return { user, isAdmin: user?.role === 'admin', session, loading, notice, clearNotice };
  }, [profile, session, sessionLoading, userId, profileQuery.isPending, notice, clearNotice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}
