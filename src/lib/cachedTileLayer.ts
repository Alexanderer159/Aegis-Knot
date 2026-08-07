import L from "leaflet";

const CACHE_NAME = "offline-map-tiles";

export const CachedTileLayer = L.TileLayer.extend({
  createTile(coords: L.Coords, done: (error: Error | null, tile: HTMLElement) => void) {
    const tile = document.createElement("img");
    const url = (this as any).getTileUrl(coords);

    tile.alt = "";
    tile.setAttribute("role", "presentation");

    caches.open(CACHE_NAME).then((cache) => {
      cache.match(url).then((cached) => {
        if (cached) {
          // Found in the offline cache, serve it directly
          cached.blob().then((blob) => {
            tile.src = URL.createObjectURL(blob);
            done(null, tile);
          });
          return;
        }

        // Not cached: fetch from network, and opportunistically cache it
        // for next time (so browsing itself slowly builds up offline coverage too)
        fetch(url)
          .then((res) => {
            if (!res.ok) throw new Error(`Tile fetch failed: ${res.status}`);
            cache.put(url, res.clone());
            return res.blob();
          })
          .then((blob) => {
            tile.src = URL.createObjectURL(blob);
            done(null, tile);
          })
          .catch((err) => {
            done(err, tile);
          });
      });
    });

    return tile;
  },
});

export function cachedTileLayer(url: string, options?: L.TileLayerOptions) {
  return new (CachedTileLayer as any)(url, options);
}