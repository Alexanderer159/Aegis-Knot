// Reads the raw Supabase auth token straight from localStorage, bypassing
// Supabase's own expiry/refresh logic. Only used as a fallback when we're
// offline and the normal getSession() call fails or returns null because
// a token refresh couldn't reach the network.
export function readRawPersistedSession(): { user: any } | null {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed?.user) return parsed;
      }
    }
  } catch {
    // ignore parse errors, treat as no cached session
  }
  return null;
}