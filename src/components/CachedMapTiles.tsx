import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { cachedTileLayer } from "@/lib/cachedTileLayer";

interface Props {
  url: string;
  attribution?: string;
}

export function CachedMapTiles({ url, attribution }: Props) {
  const map = useMap();

  useEffect(() => {
    const layer = cachedTileLayer(url, { attribution });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, url, attribution]);

  return null;
}