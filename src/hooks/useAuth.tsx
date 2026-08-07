import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { readRawPersistedSession } from "@/lib/offlineAuth";

type Member = Tables<"members">;

const MEMBER_CACHE_KEY = "cached-member";

function cacheMember(member: Member | null) {
  if (member) localStorage.setItem(MEMBER_CACHE_KEY, JSON.stringify(member));
  else localStorage.removeItem(MEMBER_CACHE_KEY);
}

function loadCachedMember(): Member | null {
  try {
    const raw = localStorage.getItem(MEMBER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  member: Member | null;
  isAuthenticated: boolean;
  loading: boolean;
  refetchMember: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMember(userId: string) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      setMember(data ?? null);
      cacheMember(data ?? null);
    } catch {
      // Offline or request failed: use the last known member data instead
      // of wiping membership just because Supabase couldn't be reached
      setMember(loadCachedMember());
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => fetchMember(newSession.user.id), 0);
      } else {
        setMember(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        await fetchMember(initialSession.user.id);
        setLoading(false);
        return;
      }

      // No verified session from Supabase. If we're offline, this may just
      // mean a token refresh couldn't reach the network, not that we were
      // actually logged out. Fall back to the raw persisted token so the
      // app stays usable offline; Supabase re-validates for real once
      // connectivity returns.
      if (!navigator.onLine) {
        const raw = readRawPersistedSession();
        if (raw?.user) {
          setUser(raw.user);
          await fetchMember(raw.user.id);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMember(null);
    cacheMember(null);
  };

  const refetchMember = async () => {
    if (user) await fetchMember(user.id);
  };

  // Authenticated if Supabase confirms a real session, OR we're offline
  // with a valid cached user, either way there's someone logged in on this device
  const isAuthenticated = !!session || !!user;

  return (
    <AuthContext.Provider value={{ session, user, member, isAuthenticated, loading, refetchMember, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}