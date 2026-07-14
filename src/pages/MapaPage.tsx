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
      <h2 className="text-3xl text-center">MAPA</h2>



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

      <Button variant="safe" className="w-full text-white font-bold" size="lg" >
        <Share2 className="h-5 w-5 mr-2" />
        COMPARTIR UBICACIÓN
      </Button>
    </div>
  );
}
