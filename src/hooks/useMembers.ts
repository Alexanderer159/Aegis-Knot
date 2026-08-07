import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalUser } from "@/hooks/useLocalUser";
import type { Tables } from "@/integrations/supabase/types";
import type { RoleType, StatusType } from "@/lib/store";

export type Member = Tables<"members">;

const allRoles: RoleType[] = ["vanguard", "medic", "navigator", "comms", "quartermaster", "builder"];

export interface RosterEntry {
  role: RoleType;
  filled: boolean;
  id?: string;
  displayName: string;
  avatarInitials: string;
  status: StatusType | null;
  lastCheckIn: string | null;
  latitude: number | null;
  longitude: number | null;
}

function initialsFrom(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function cacheKey(knotId: string) {
  return `cached-members-${knotId}`;
}

function loadCachedMembers(knotId: string): Member[] {
  try {
    const raw = localStorage.getItem(cacheKey(knotId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCachedMembers(knotId: string, members: Member[]) {
  try {
    localStorage.setItem(cacheKey(knotId), JSON.stringify(members));
  } catch {
    // ignore, this is just a cache
  }
}

export function useMembers() {
  const { user } = useLocalUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const fetchMembers = useCallback(async (showLoading = false) => {
    if (!user?.knotId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);

    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("knot_id", user.knotId);

      if (error) throw error;
      if (data) {
        setMembers(data);
        saveCachedMembers(user.knotId, data);
        setIsOffline(false);
      }
    } catch {
      setMembers(loadCachedMembers(user.knotId));
      setIsOffline(true);
    }

    if (showLoading) setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchMembers(true);
  }, [fetchMembers]);

  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`members-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members", filter: `knot_id=eq.${user.knotId}` },
        () => fetchMembers(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchMembers]);

  // Once the sync queue drains and we're back online, refetch so any
  // status/location/name changes queued while offline show up for everyone
  useEffect(() => {
    const handler = () => fetchMembers(false);
    window.addEventListener("knot-sync-complete", handler);
    return () => window.removeEventListener("knot-sync-complete", handler);
  }, [fetchMembers]);

  const roster: RosterEntry[] = allRoles.map((role) => {
    const match = members.find((m) => m.role === role);
    if (match) {
      return {
        role,
        filled: true,
        id: match.id,
        displayName: match.display_name,
        avatarInitials: match.avatar_initials || initialsFrom(match.display_name),
        status: match.status,
        lastCheckIn: match.last_check_in,
        latitude: match.latitude,
        longitude: match.longitude,
      };
    }
    return {
      role,
      filled: false,
      displayName: "Role not filled",
      avatarInitials: "—",
      status: null,
      lastCheckIn: null,
      latitude: null,
      longitude: null,
    };
  });

  return { members, roster, loading, isOffline, refetch: () => fetchMembers(true) };
}