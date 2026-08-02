import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalUser } from "@/hooks/useLocalUser";
import type { Tables, Enums } from "@/integrations/supabase/types";

export type MapMarker = Tables<"map_markers">;
export type MarkerCategory = Enums<"marker_category">;

export function useMapMarkers() {
  const { user } = useLocalUser();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarkers = useCallback(async () => {
    if (!user?.knotId) {
      setMarkers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("map_markers")
      .select("*")
      .eq("knot_id", user.knotId);
    if (!error && data) setMarkers(data);
    setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`map_markers-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "map_markers", filter: `knot_id=eq.${user.knotId}` },
        () => fetchMarkers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchMarkers]);

  const addMarker = useCallback(async (marker: { name: string; category: MarkerCategory; latitude: number; longitude: number }) => {
    if (!user?.knotId) return { error: new Error("No knot") };
    const { data: authData } = await supabase.auth.getUser();
    const { error } = await supabase.from("map_markers").insert({
      knot_id: user.knotId,
      name: marker.name,
      category: marker.category,
      latitude: marker.latitude,
      longitude: marker.longitude,
      created_by: authData.user?.id,
    });
    if (!error) await fetchMarkers();
    return { error };
  }, [user?.knotId, fetchMarkers]);

  const removeMarker = useCallback(async (id: string) => {
    const { error } = await supabase.from("map_markers").delete().eq("id", id);
    if (!error) await fetchMarkers();
    return { error };
  }, [fetchMarkers]);

  return { markers, loading, addMarker, removeMarker, refetch: fetchMarkers };
}