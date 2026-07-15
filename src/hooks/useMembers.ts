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
}

function initialsFrom(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function useMembers() {
  const { user } = useLocalUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!user?.knotId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("knot_id", user.knotId);
    if (!error && data) setMembers(data);
    setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Realtime: refetch whenever any member row in this knot changes (status updates, joins, etc.)
  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`members-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members", filter: `knot_id=eq.${user.knotId}` },
        () => fetchMembers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchMembers]);

  // Always return all 6 roles, filling gaps with placeholders
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
      };
    }
    return {
      role,
      filled: false,
      displayName: "Role not filled",
      avatarInitials: "—",
      status: null,
      lastCheckIn: null,
    };
  });

  return { members, roster, loading, refetch: fetchMembers };
}