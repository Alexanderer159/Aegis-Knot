import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { RoleType, StatusType } from "@/lib/store";

export interface Dependent {
  id: string;
  name: string;
  relation: string;
  location: string;
  status: StatusType;
}

interface LocalUser {
  displayName: string;
  role: RoleType;
  groupCode: string;
  dependents: Dependent[];
}

interface LocalUserContextType {
  user: LocalUser | null;
  isSetup: boolean;
  setupUser: (name: string, role: RoleType, code: string) => void;
  updateRole: (role: RoleType) => void;
  updateName: (name: string) => void;
  addDependent: (dep: Omit<Dependent, "id">) => void;
  removeDependent: (id: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "aegis-knot-user";
const GROUP_CODE = "AEGIS2026";

const LocalUserContext = createContext<LocalUserContextType | undefined>(undefined);

export function LocalUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = useCallback((u: LocalUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }, []);

  const setupUser = useCallback((name: string, role: RoleType, code: string) => {
    persist({ displayName: name, role, groupCode: code, dependents: [] });
  }, [persist]);

  const updateRole = useCallback((role: RoleType) => {
    if (user) persist({ ...user, role });
  }, [user, persist]);

  const updateName = useCallback((name: string) => {
    if (user) persist({ ...user, displayName: name });
  }, [user, persist]);

  const addDependent = useCallback((dep: Omit<Dependent, "id">) => {
    if (user) {
      persist({ ...user, dependents: [...user.dependents, { ...dep, id: Date.now().toString() }] });
    }
  }, [user, persist]);

  const removeDependent = useCallback((id: string) => {
    if (user) {
      persist({ ...user, dependents: user.dependents.filter(d => d.id !== id) });
    }
  }, [user, persist]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <LocalUserContext.Provider value={{
      user,
      isSetup: !!user,
      setupUser,
      updateRole,
      updateName,
      addDependent,
      removeDependent,
      logout,
    }}>
      {children}
    </LocalUserContext.Provider>
  );
}

export function useLocalUser() {
  const ctx = useContext(LocalUserContext);
  if (!ctx) throw new Error("useLocalUser must be used within LocalUserProvider");
  return ctx;
}

export { GROUP_CODE };
