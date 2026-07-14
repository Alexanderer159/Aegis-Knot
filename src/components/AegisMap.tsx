import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Maximize2 } from "lucide-react";
import { mockMarkers } from "@/lib/store";
import { usePodLocations } from "@/hooks/useLocationSharing";
import { cn } from "@/lib/utils";

// Fix Leaflet's default icon paths breaking under Vite/webpack bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const markerColors: Record<string, string> = {
  meeting: "#22c55e", // primary/safe green
  danger: "#ef4444",
  resource: "#3b82f6",
  shelter: "#eab308",
};

function poiIcon(type: string) {
  const color = markerColors[type] || "#9ca3af";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 16px; height: 16px; border-radius: 9999px;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function memberIcon(status: string | null | undefined) {
  const color = status === "ok" ? "#22c55e" : status === "help" ? "#eab308" : status === "critical" ? "#ef4444" : "#9ca3af";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 20px; height: 20px; border-radius: 9999px;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 0 6px rgba(0,0,0,0.6);
      display:flex; align-items:center; justify-content:center;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// Forces Leaflet to recalculate size once the fullscreen container is mounted/resized
function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

function getDefaultCenter(): [number, number] {
  if (mockMarkers.length > 0) {
    const avgLat = mockMarkers.reduce((s, m) => s + m.lat, 0) / mockMarkers.length;
    const avgLng = mockMarkers.reduce((s, m) => s + m.lng, 0) / mockMarkers.length;
    return [avgLat, avgLng];
  }
  return [38.6989, -0.4738]; // fallback: Alcoy
}

interface Props {
  heightClass?: string;
}

export default function AegisMap({ heightClass = "h-48" }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const podMembers = usePodLocations();
  const center = getDefaultCenter();

  const MapBody = ({ interactive }: { interactive: boolean }) => (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      zoomControl={interactive}
      touchZoom={interactive}
      attributionControl={interactive}
      className="w-full h-full"
    >
      {fullscreen && <InvalidateOnMount />}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {mockMarkers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={poiIcon(marker.type)}>
          <Popup>
            <span className="font-semibold">{marker.name}</span>
          </Popup>
        </Marker>
      ))}

      {podMembers.map((member) => (
        member.latitude && member.longitude && (
          <Marker
            key={member.id}
            position={[member.latitude, member.longitude]}
            icon={memberIcon(member.status)}
          >
            <Popup>
              <span className="font-semibold">{member.display_name}</span>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );

  return (
    <>
      {/* Compact Preview */}
      <div
        onClick={() => setFullscreen(true)}
        className={cn(
          "relative w-full rounded-lg overflow-hidden tactical-border cursor-pointer group",
          heightClass
        )}
      >
        <div className="pointer-events-none absolute inset-0 z-[400]">
          <MapBody interactive={false} />
        </div>
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 rounded-full p-2">
            <Maximize2 className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-[1000] bg-background">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-[1100] bg-card border border-border rounded-full p-2 shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="w-full h-full">
            <MapBody interactive={true} />
          </div>
        </div>
      )}
    </>
  );
}