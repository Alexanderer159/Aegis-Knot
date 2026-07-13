import { MapPin, AlertTriangle, Droplets, Home, Navigation, Share2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockMarkers } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { usePodLocations } from "@/hooks/useLocationSharing";


const markerIcons: Record<string, React.ElementType> = {
  meeting: MapPin,
  danger: AlertTriangle,
  resource: Droplets,
  shelter: Home,
};

const markerColors: Record<string, string> = {
  meeting: "text-primary",
  danger: "text-critical",
  resource: "text-blue-400",
  shelter: "text-warning",
};

const statusColors: Record<string, string> = {
  ok: "bg-safe",
  help: "bg-warning",
  critical: "bg-critical",
};

export default function MapaPage() {
  const podMembers = usePodLocations();
  

  return (
    <div className="space-y-5">
      <h2 className="text-lg md:text-2xl text-center text-muted-foreground">Mapa</h2>

      {/* Map Simulation */}
      <Card className="tactical-border overflow-hidden">
        <div className="relative h-64 bg-secondary tactical-grid">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full p-4">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(110 100% 55% / 0.08)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Danger zone */}
              <div className="absolute top-1/3 left-1/3 w-20 h-20 rounded-full bg-critical/10 border border-critical/30 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-critical/60" />
              </div>

              {/* Static markers */}
              {mockMarkers.map((marker, i) => {
                const Icon = markerIcons[marker.type];
                const positions = [
                  "top-6 left-8", "top-12 right-16", "bottom-16 left-1/4",
                  "top-1/2 right-8", "bottom-8 right-12"
                ];
                return (
                  <div key={marker.id} className={cn("absolute flex flex-col items-center", positions[i])}>
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      marker.type === "meeting" ? "bg-primary/20" :
                      marker.type === "danger" ? "bg-critical/20" :
                      marker.type === "resource" ? "bg-blue-400/20" : "bg-warning/20"
                    )}>
                      <Icon className={cn("h-4 w-4", markerColors[marker.type])} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5">{marker.name}</span>
                  </div>
                );
              })}

              {/* Live pod member positions */}
              {podMembers.map((member, i) => {
                const isMe = false;
                // Distribute members around the map based on index
                const angle = (i / Math.max(podMembers.length, 1)) * 2 * Math.PI;
                const cx = 50 + 30 * Math.cos(angle);
                const cy = 50 + 30 * Math.sin(angle);
                return (
                  <div
                    key={member.id}
                    className="absolute flex flex-col items-center transition-all duration-1000"
                    style={{ left: `${cx}%`, top: `${cy}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <div className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold",
                      isMe
                        ? "bg-primary/30 border-primary text-primary"
                        : "bg-accent border-muted-foreground/50 text-foreground"
                    )}>
                      {member.avatar_initials}
                      {member.status && (
                        <span className={cn(
                          "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background",
                          statusColors[member.status] || "bg-muted-foreground"
                        )} />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5 whitespace-nowrap">
                      {isMe ? "TÚ" : member.display_name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Live Pod Members */}
      {podMembers.length > 0 && (
        <Card className="tactical-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              MIEMBROS EN LÍNEA ({podMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {podMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {member.avatar_initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-heading font-semibold">{member.display_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {member.latitude?.toFixed(4)}, {member.longitude?.toFixed(4)}
                    {member.location_updated_at && (
                      <> · {new Date(member.location_updated_at).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</>
                    )}
                  </p>
                </div>
                <span className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  statusColors[member.status || ""] || "bg-muted-foreground"
                )} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Map Controls */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">MAPAS OFFLINE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Descargar Mapas de Ciudad</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Puntos de Recursos</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Points of Interest */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">PUNTOS DE ENCUENTRO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockMarkers.filter(m => m.type === "meeting").map((marker) => (
            <div key={marker.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-heading font-semibold">{marker.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {marker.lat.toFixed(3)}, {marker.lng.toFixed(3)}
                </p>
              </div>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="safe" className="w-full" size="lg">
        <Share2 className="h-5 w-5 mr-2" />
        COMPARTIR UBICACIÓN
      </Button>
    </div>
  );
}
