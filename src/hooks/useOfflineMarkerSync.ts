import { useState, useEffect, useCallback, useRef } from "react";
import { useMapMarkers, type MapMarker } from "@/hooks/useMapMarkers";
import { useToast } from "@/hooks/use-toast";

const CACHE_NAME = "offline-map-tiles"; // same cache CachedMapTiles reads from
const MANIFEST_KEY = "offline-map-manifest"; // { [markerId]: tileUrl[] }
const ENABLED_KEY = "offline-maps-enabled";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const SUBDOMAINS = ["a", "b", "c", "d"];

const BUFFER_KM = 5;   // radius cached around each marker
const MIN_ZOOM = 12;
const MAX_ZOOM = 16;

function lonToTileX(lon: number, zoom: number) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}
function latToTileY(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * Math.pow(2, zoom));
}

// Rough km-to-degree conversion, fine for a caching buffer, not precision geodesy
function boundsAround(lat: number, lng: number, km: number) {
  const latDelta = km / 111;
  const lngDelta = km / (111 * Math.cos((lat * Math.PI) / 180) || 1);
  return { north: lat + latDelta, south: lat - latDelta, east: lng + lngDelta, west: lng - lngDelta };
}

function tileUrlsForMarker(marker: MapMarker): string[] {
  const bounds = boundsAround(marker.latitude, marker.longitude, BUFFER_KM);
  const urls: string[] = [];
  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    const xMin = lonToTileX(bounds.west, z);
    const xMax = lonToTileX(bounds.east, z);
    const yMin = latToTileY(bounds.north, z);
    const yMax = latToTileY(bounds.south, z);
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        const sub = SUBDOMAINS[(x + y) % SUBDOMAINS.length];
        urls.push(TILE_URL.replace("{s}", sub).replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y)).replace("{r}", ""));
      }
    }
  }
  return urls;
}

function loadManifest(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(MANIFEST_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function saveManifest(manifest: Record<string, string[]>) {
  localStorage.setItem(MANIFEST_KEY, JSON.stringify(manifest));
}

export function useOfflineMarkerSync() {
  const { markers } = useMapMarkers();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(() => localStorage.getItem(ENABLED_KEY) === "true");
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const syncingRef = useRef(false);

  const syncMarkers = useCallback(async (currentMarkers: MapMarker[]) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setSyncing(true);

    const cache = await caches.open(CACHE_NAME);
    const manifest = loadManifest();
    const currentIds = new Set(currentMarkers.map((m) => m.id));

    // Drop tiles for markers that no longer exist, unless another live marker still needs them
    for (const markerId of Object.keys(manifest)) {
      if (!currentIds.has(markerId)) {
        const staleUrls = manifest[markerId];
        const stillNeeded = new Set<string>();
        for (const [id, urls] of Object.entries(manifest)) {
          if (id !== markerId && currentIds.has(id)) urls.forEach((u) => stillNeeded.add(u));
        }
        await Promise.all(staleUrls.filter((u) => !stillNeeded.has(u)).map((u) => cache.delete(u)));
        delete manifest[markerId];
      }
    }

    // Download tiles for any marker not yet cached
    const newMarkers = currentMarkers.filter((m) => !manifest[m.id]);
    const total = newMarkers.reduce((sum, m) => sum + tileUrlsForMarker(m).length, 0);
    let done = 0;
    setProgress({ done: 0, total });

    for (const marker of newMarkers) {
      const urls = tileUrlsForMarker(marker);
      const BATCH_SIZE = 12;
      for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (url) => {
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const res = await fetch(url);
              if (res.ok) await cache.put(url, res.clone());
            }
          } catch {
            // skip individual failures, don't block the whole sync
          }
        }));
        done += batch.length;
        setProgress({ done, total });
      }
      manifest[marker.id] = urls;
    }

    saveManifest(manifest);
    setSyncing(false);
    syncingRef.current = false;
  }, []);

  // Whenever markers change while enabled, keep the offline cache in sync automatically
  useEffect(() => {
    if (!enabled) return;
    syncMarkers(markers);
  }, [enabled, markers, syncMarkers]);

  const enable = useCallback(() => {
    localStorage.setItem(ENABLED_KEY, "true");
    setEnabled(true);
    toast({ title: "Offline maps enabled", description: "Downloading areas around your points..." });
  }, [toast]);

  const disable = useCallback(async () => {
    await caches.delete(CACHE_NAME);
    localStorage.removeItem(MANIFEST_KEY);
    localStorage.setItem(ENABLED_KEY, "false");
    setEnabled(false);
    toast({ title: "Offline maps disabled", description: "Cached map data was cleared." });
  }, [toast]);

  return { enabled, enable, disable, syncing, progress };
}