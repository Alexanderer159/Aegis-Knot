import { useState, useEffect } from "react";
import { Shield, ShieldAlert, AlertTriangle, CheckCircle2, Radio, MapPin, Package, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppState, mockPodMembers, roleLabels, type StatusType } from "@/lib/store";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: StatusType }) {
  if (!status) return <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />;
  const styles = {
    ok: "bg-safe animate-pulse-glow",
    help: "bg-warning",
    critical: "bg-critical animate-pulse",
  };
  return <span className={cn("h-2.5 w-2.5 rounded-full", styles[status])} />;
}

const WAYPOINTS_KEY = "aegis-waypoints";

interface Waypoint {
  name: string;
  lat: string;
  lng: string;
}

function loadWaypoints(): { alfa: Waypoint; beta: Waypoint } {
  try {
    const stored = localStorage.getItem(WAYPOINTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    alfa: { name: "Punto Alfa", lat: "", lng: "" },
    beta: { name: "Punto Beta", lat: "", lng: "" },
  };
}

export default function Dashboard() {
  const { userStatus, updateStatus, activity } = useAppState();
  const { user } = useLocalUser();
  const navigate = useNavigate();
  const [editingPoint, setEditingPoint] = useState<"alfa" | "beta" | null>(null);
  const [waypoints, setWaypoints] = useState(loadWaypoints);

  // Calculate real supply percentage from localStorage
  const supplyPercent = (() => {
    try {
      const stored = localStorage.getItem("aegis-supplies");
      if (stored) {
        const items = JSON.parse(stored) as { have: number; need: number }[];
        const totalNeed = items.reduce((a, s) => a + s.need, 0);
        if (totalNeed > 0) return Math.round(items.reduce((a, s) => a + s.have, 0) / totalNeed * 100);
      }
    } catch {}
    return 0;
  })();

  useEffect(() => {
    localStorage.setItem(WAYPOINTS_KEY, JSON.stringify(waypoints));
  }, [waypoints]);

  const updateWaypoint = (key: "alfa" | "beta", field: "lat" | "lng", value: string) => {
    setWaypoints(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const hasCoords = (wp: Waypoint) => wp.lat !== "" && wp.lng !== "";

  // Build pod list: replace the member matching user's role with the signed-in user
  const podList = mockPodMembers.map((member) => {
    if (user && member.role === user.role) {
      return {
        ...member,
        name: user.displayName,
        avatar: user.displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      };
    }
    return member;
  });

  return (
    <div className="space-y-5">
      {/* Status Buttons */}
      <section className="space-y-3">

        <div className="grid grid-cols-3 gap-3">
          <Button size="xl" className={cn("flex-col gap-1 bg-secondary text-primary", userStatus === "ok" && "ring-2 ring-safe ")} onClick={() => updateStatus("ok")}>
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-xs">ESTOY BIEN</span>
          </Button>
          <Button size="xl" className={cn("flex-col gap-1 bg-secondary text-warning", userStatus === "help" && "ring-2 ring-warning")} onClick={() => updateStatus("help")}>
            <AlertTriangle className="h-6 w-6" />
            <span className="text-xs">AYUDA</span>
          </Button>
          <Button size="xl" className={cn("flex-col gap-1 bg-secondary text-critical", userStatus === "critical" && "ring-2 ring-critical")} onClick={() => updateStatus("critical")}>
            <ShieldAlert className="h-6 w-6" />
            <span className="text-xs">CRÍTICO</span>
          </Button>
        </div>

      </section>

      {/* Waypoints */}
      <div className="grid grid-cols-2 gap-3">
        {(["alfa", "beta"] as const).map(key => {
          const wp = waypoints[key];
          const label = key.toUpperCase();
          const isEditing = editingPoint === key;

          return (
            <Card key={key} className="cursor-pointer transition-all" onClick={() => !isEditing && setEditingPoint(key)}>
              <CardContent className="py-3 px-3">
                {isEditing ? (
                  <div className="space-y-2" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading text-primary">PUNTO {label}</span>
                      <button onClick={() => setEditingPoint(null)}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <Input placeholder="Latitud" value={wp.lat}  onChange={e => updateWaypoint(key, "lat", e.target.value)} className="h-7 text-xs bg-secondary"/>
                    <Input placeholder="Longitud" value={wp.lng} onChange={e => updateWaypoint(key, "lng", e.target.value)} className="h-7 text-xs bg-secondary"/>
                    <Button size="sm" className="w-full h-7 font-bold text-black" onClick={() => setEditingPoint(null)}>Guardar</Button>
                  </div>
                ) : (
                  <div className="flex gap-1 flex-col items-center">
                    
                    <MapPin className="h-5 w-5 text-primary mb-1" />

                    <span className="text-xs text-muted-foreground">Punto</span>

                    <span className="text-sm font-heading font-bold text-foreground">{label}</span>

                    {hasCoords(wp) ? (

                      <span className="text-xs text-primary font-mono text-center">
                        {parseFloat(wp.lat).toFixed(4)}, {parseFloat(wp.lng).toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Toca para definir</span>
                    )}

                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="tactical-border cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/insumos")}>
          <CardContent className="flex flex-col items-center py-3 px-2">
            <Package className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Suministros</span>
            <span className={cn("text-sm font-heading font-bold", supplyPercent >= 75 ? "text-primary" : supplyPercent >= 40 ? "text-warning" : "text-critical")}>{supplyPercent}%</span>
            <Progress value={supplyPercent} className="h-1 mt-1 w-full" />
          </CardContent>
        </Card>
        <Card className="tactical-border">
          <CardContent className="flex flex-col items-center py-3 px-2">
            <Radio className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Comms</span>
            <span className="text-sm font-heading font-bold text-safe">ONLINE</span>
          </CardContent>
        </Card>
      </div>

      {/* Pod Members */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="h-7 w-7 text-primary" /> MIEMBROS DEL KNOT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {podList.map((member) => {
            const isSelf = user?.role === member.role;
            return (
              <div key={member.id} className={cn(
                "flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5",
                isSelf && "border border-primary/20"
              )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-semibold truncate">
                    {member.name}
                    {isSelf && <span className="text-primary text-xs ml-1">(TÚ)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{roleLabels[member.role]}</p>
                </div>
                <StatusBadge status={member.status} />
                <span className="text-xs text-muted-foreground">{member.lastCheckIn}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">FEED DE ACTIVIDAD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activity.slice(0, 6).map((item) => (
            <div key={item.id} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className={cn(
                "mt-1 h-2 w-2 rounded-full shrink-0",
                item.type === "alert" ? "bg-warning" : item.type === "status" ? "bg-safe" : "bg-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{item.memberName}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0">{item.timestamp}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
