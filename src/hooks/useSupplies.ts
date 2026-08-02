import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalUser } from "@/hooks/useLocalUser";
import type { Tables, Enums } from "@/integrations/supabase/types";

export type Supply = Tables<"supplies">;
export type SupplyCategory = Enums<"supply_category">;

export function useSupplies() {
  const { user } = useLocalUser();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);

  // Only used for the initial load and realtime-triggered syncs, never after our own optimistic updates
   const fetchSupplies = useCallback(async (showLoading = false) => {
    if (!user?.knotId) {
      setSupplies([]);
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    const { data, error } = await supabase
      .from("supplies")
      .select("*")
      .eq("knot_id", user.knotId)
      .order("category", { ascending: true })
      .order("created_at", { ascending: true }); // ← add this line
    if (!error && data) setSupplies(data);
    if (showLoading) setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchSupplies(true); // initial load: show the loading state
  }, [fetchSupplies]);

  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`supplies-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "supplies", filter: `knot_id=eq.${user.knotId}` },
        () => fetchSupplies(false) // silent refresh, no loading flash
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchSupplies]);

  const addSupply = useCallback(async (item: { name: string; category: SupplyCategory; need: number; unit: string }) => {
    if (!user?.knotId) return { error: new Error("No knot") };
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
    if (!error && data) {
      setSupplies((prev) => [...prev, data]); // optimistic, no refetch needed
    }
    return { error };
  }, [user?.knotId]);

  const updateSupply = useCallback(async (id: string, changes: Partial<Pick<Supply, "have" | "need" | "acquired">>) => {
    // Optimistic local update: apply instantly, no loading state, no refetch
    setSupplies((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));

    const { error } = await supabase.from("supplies").update(changes).eq("id", id);

    if (error) {
      // Roll back on failure by re-syncing from the server
      fetchSupplies(false);
    }
    return { error };
  }, [fetchSupplies]);

  const removeSupply = useCallback(async (id: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id)); // optimistic
    const { error } = await supabase.from("supplies").delete().eq("id", id);
    if (error) {
      fetchSupplies(false); // roll back on failure
    }
    return { error };
  }, [fetchSupplies]);

  return { supplies, loading, addSupply, updateSupply, removeSupply, refetch: () => fetchSupplies(true) };
}