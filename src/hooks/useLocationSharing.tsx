import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export function useLocationSharing(enabled = true) {
  const { user } = useAuth();
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !user || !navigator.geolocation) return;

    const updateLocation = (pos: GeolocationPosition) => {
      supabase
        .from("profiles")
        .update({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          location_updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .then();
    };

    watchIdRef.current = navigator.geolocation.watchPosition(updateLocation, () => {}, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000,
    });

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [enabled, user]);
}

export function usePodLocations() {
  const [members, setMembers] = useState<Profile[]>([]);

  useEffect(() => {
    // Initial fetch
    supabase
      .from("profiles")
      .select("*")
      .not("latitude", "is", null)
      .then(({ data }) => {
        if (data) setMembers(data);
      });

    // Real-time subscription
    const channel = supabase
      .channel("pod-locations")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          const updated = payload.new as Profile;
          setMembers((prev) => {
            const idx = prev.findIndex((m) => m.id === updated.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = updated;
              return next;
            }
            if (updated.latitude) return [...prev, updated];
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return members;
}
