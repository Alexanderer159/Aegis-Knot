import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalUser } from "@/hooks/useLocalUser";
import type { Tables, Enums } from "@/integrations/supabase/types";

export type Supply = Tables<"supplies">;
export type SupplyCategory = Enums<"supply_category">;

function cacheKey(knotId: string) {
  return `cached-supplies-${knotId}`;
}

function loadCachedSupplies(knotId: string): Supply[] {
  try {
    const raw = localStorage.getItem(cacheKey(knotId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCachedSupplies(knotId: string, supplies: Supply[]) {
  try {
    localStorage.setItem(cacheKey(knotId), JSON.stringify(supplies));
  } catch {
    // storage full or unavailable, safe to ignore, this is just a cache
  }
}

export function useSupplies() {
  const { user } = useLocalUser();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const fetchSupplies = useCallback(async (showLoading = false) => {
    if (!user?.knotId) {
      setSupplies([]);
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);

    try {
      const { data, error } = await supabase
        .from("supplies")
        .select("*")
        .eq("knot_id", user.knotId)
        .order("category", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) {
        setSupplies(data);
        saveCachedSupplies(user.knotId, data);
        setIsOffline(false);
      }
    } catch {
      // Network failed: fall back to the last known cached data
      setSupplies(loadCachedSupplies(user.knotId));
      setIsOffline(true);
    }

    if (showLoading) setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchSupplies(true);
  }, [fetchSupplies]);

  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`supplies-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "supplies", filter: `knot_id=eq.${user.knotId}` },
        () => fetchSupplies(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchSupplies]);

  const addSupply = useCallback(async (item: { name: string; category: SupplyCategory; need: number; unit: string }) => {
    if (!user?.knotId) return { error: new Error("No knot") };
    try {
      const { data, error } = await supabase
        .from("supplies")
        .insert({
          knot_id: user.knotId,
          name: item.name,
          category: item.category,
          need: item.need,
          unit: item.unit,
          have: 0,
          acquired: false,
        })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setSupplies((prev) => {
          const next = [...prev, data];
          saveCachedSupplies(user.knotId, next);
          return next;
        });
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user?.knotId]);

  const updateSupply = useCallback(async (id: string, changes: Partial<Pick<Supply, "have" | "need" | "acquired">>) => {
    setSupplies((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...changes } : s));
      if (user?.knotId) saveCachedSupplies(user.knotId, next);
      return next;
    });

    try {
      const { error } = await supabase.from("supplies").update(changes).eq("id", id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      // Offline: keep the optimistic local/cached update, don't roll back,
      // the realtime sync (or a future auto-sync queue) reconciles once online
      return { error: error as Error };
    }
  }, [user?.knotId]);

  const removeSupply = useCallback(async (id: string) => {
    setSupplies((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (user?.knotId) saveCachedSupplies(user.knotId, next);
      return next;
    });

    try {
      const { error } = await supabase.from("supplies").delete().eq("id", id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user?.knotId]);

  return { supplies, loading, isOffline, addSupply, updateSupply, removeSupply, refetch: () => fetchSupplies(true) };
}