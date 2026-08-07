import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalUser } from "@/hooks/useLocalUser";
import type { Tables, Enums } from "@/integrations/supabase/types";

export type MapMarker = Tables<"map_markers">;
export type MarkerCategory = Enums<"marker_category">;

function cacheKey(knotId: string) {
  return `cached-markers-${knotId}`;
}

function loadCachedMarkers(knotId: string): MapMarker[] {
  try {
    const raw = localStorage.getItem(cacheKey(knotId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCachedMarkers(knotId: string, markers: MapMarker[]) {
  try {
    localStorage.setItem(cacheKey(knotId), JSON.stringify(markers));
  } catch {
    // ignore, this is just a cache
  }
}

export function useMapMarkers() {
  const { user } = useLocalUser();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const fetchMarkers = useCallback(async (showLoading = false) => {
    if (!user?.knotId) {
      setMarkers([]);
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);

    try {
      const { data, error } = await supabase
        .from("map_markers")
        .select("*")
        .eq("knot_id", user.knotId);

      if (error) throw error;
      if (data) {
        setMarkers(data);
        saveCachedMarkers(user.knotId, data);
        setIsOffline(false);
      }
    } catch {
      setMarkers(loadCachedMarkers(user.knotId));
      setIsOffline(true);
    }

    if (showLoading) setLoading(false);
  }, [user?.knotId]);

  useEffect(() => {
    fetchMarkers(true);
  }, [fetchMarkers]);

  useEffect(() => {
    if (!user?.knotId) return;
    const channel = supabase
      .channel(`map_markers-${user.knotId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "map_markers", filter: `knot_id=eq.${user.knotId}` },
        () => fetchMarkers(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.knotId, fetchMarkers]);

  const addMarker = useCallback(async (marker: { name: string; category: MarkerCategory; latitude: number; longitude: number }) => {
    if (!user?.knotId) return { error: new Error("No knot") };
    try {
      const { data: authData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("map_markers")
        .insert({
          knot_id: user.knotId,
          name: marker.name,
          category: marker.category,
          latitude: marker.latitude,
          longitude: marker.longitude,
          created_by: authData.user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setMarkers((prev) => {
          const next = [...prev, data];
          saveCachedMarkers(user.knotId, next);
          return next;
        });
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user?.knotId]);

  const removeMarker = useCallback(async (id: string) => {
    setMarkers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (user?.knotId) saveCachedMarkers(user.knotId, next);
      return next;
    });

    try {
      const { error } = await supabase.from("map_markers").delete().eq("id", id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user?.knotId]);

  return { markers, loading, isOffline, addMarker, removeMarker, refetch: () => fetchMarkers(true) };
}