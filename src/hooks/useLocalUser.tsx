import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { RoleType, StatusType } from "@/lib/store";

// Dependents remain local for now (per earlier decision: handle in backend later)
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
  knotId: string;
  status: StatusType;
  dependents: Dependent[];
}

interface LocalUserContextType {
  user: LocalUser | null;
  isSetup: boolean;
  loading: boolean;
  createKnot: (displayName: string, knotName?: string) => Promise<{ error: Error | null; code?: string }>;
  joinKnot: (code: string, role: RoleType, displayName: string) => Promise<{ error: Error | null }>;
  updateStatus: (status: StatusType) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  addDependent: (dep: Omit<Dependent, "id">) => void;
  removeDependent: (id: string) => void;
}

const DEPENDENTS_KEY = "aegis-dependents"; // temporary, local-only until backed by Supabase

const LocalUserContext = createContext<LocalUserContextType | undefined>(undefined);

export function LocalUserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, member, loading: authLoading, refetchMember } = useAuth();
  const [dependents, setDependents] = useState<Dependent[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEPENDENTS_KEY);
      if (stored) setDependents(JSON.parse(stored));
    } catch {}
  }, []);

  const persistDependents = useCallback((deps: Dependent[]) => {
    setDependents(deps);
    localStorage.setItem(DEPENDENTS_KEY, JSON.stringify(deps));
  }, []);

  const user: LocalUser | null = member
    ? {
        displayName: member.display_name,
        role: member.role,
        knotId: member.knot_id,
        status: member.status as StatusType,
        dependents,
      }
    : null;

  const createKnot = useCallback(async (displayName: string, knotName?: string) => {
    const { data, error } = await supabase.rpc("create_knot", {
      p_display_name: displayName,
      p_knot_name: knotName,
    });
    if (!error) await refetchMember();
    return { error: error as Error | null, code: data?.code };
  }, [refetchMember]);

  const joinKnot = useCallback(async (code: string, role: RoleType, displayName: string) => {
    const { error } = await supabase.rpc("join_knot", {
      p_code: code.toUpperCase(),
      p_role: role,
      p_display_name: displayName,
    });
    if (!error) await refetchMember();
    return { error: error as Error | null };
  }, [refetchMember]);

  const updateStatus = useCallback(async (status: StatusType) => {
    if (!authUser) return;
    await supabase
      .from("members")
      .update({ status, last_check_in: new Date().toISOString() })
      .eq("user_id", authUser.id);
    await refetchMember();
  }, [authUser, refetchMember]);

  const updateName = useCallback(async (name: string) => {
    if (!authUser) return;
    await supabase
      .from("members")
      .update({ display_name: name })
      .eq("user_id", authUser.id);
    await refetchMember();
  }, [authUser, refetchMember]);

  const addDependent = useCallback((dep: Omit<Dependent, "id">) => {
    persistDependents([...dependents, { ...dep, id: Date.now().toString() }]);
  }, [dependents, persistDependents]);

  const removeDependent = useCallback((id: string) => {
    persistDependents(dependents.filter(d => d.id !== id));
  }, [dependents, persistDependents]);

  return (
    <LocalUserContext.Provider value={{
      user,
      isSetup: !!user,
      loading: authLoading,
      createKnot,
      joinKnot,
      updateStatus,
      updateName,
      addDependent,
      removeDependent,
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