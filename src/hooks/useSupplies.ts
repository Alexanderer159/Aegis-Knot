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

  const fetchSupplies = useCallback(async () => {
    if (!user?.knotId) {
      setSupplies([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("supplies")
      .select("*")
      .eq("knot_id", user.knotId)
      .order("category", { ascending: true });
    if (!error && data) setSupplies(data);
    setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchSupplies();
  }, [fetchSupplies]);

  // Realtime: refetch whenever any supply row for this knot changes, from anyone
  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`supplies-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "supplies", filter: `knot_id=eq.${user.knotId}` },
        () => fetchSupplies()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchSupplies]);

  const addSupply = useCallback(async (item: { name: string; category: SupplyCategory; need: number; unit: string }) => {
    if (!user?.knotId) return { error: new Error("No knot") };
    const { error } = await supabase.from("supplies").insert({
      knot_id: user.knotId,
      name: item.name,
      category: item.category,
      need: item.need,
      unit: item.unit,
      have: 0,
      acquired: false,
    });
    if (!error) await fetchSupplies();
    return { error };
  }, [user?.knotId, fetchSupplies]);

  const updateSupply = useCallback(async (id: string, changes: Partial<Pick<Supply, "have" | "need" | "acquired">>) => {
    const { error } = await supabase.from("supplies").update(changes).eq("id", id);
    if (!error) await fetchSupplies();
    return { error };
  }, [fetchSupplies]);

  const removeSupply = useCallback(async (id: string) => {
    const { error } = await supabase.from("supplies").delete().eq("id", id);
    if (!error) await fetchSupplies();
    return { error };
  }, [fetchSupplies]);

  return { supplies, loading, addSupply, updateSupply, removeSupply, refetch: fetchSupplies };
}