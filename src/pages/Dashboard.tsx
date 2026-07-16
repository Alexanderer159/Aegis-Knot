import { useState, useEffect } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Radio, MapPin, Package, X, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppState, roleLabels } from "@/lib/store"; // activity feed only now
import { useLocalUser } from "@/hooks/useLocalUser";
import { useMembers } from "@/hooks/useMembers";
import { useSupplies } from "@/hooks/useSupplies";
import { cn } from "@/lib/utils";
import type { StatusType } from "@/lib/store";

function StatusBadge({ status }: { status: StatusType | null }) {
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
    alfa: { name: "Point Alfa", lat: "", lng: "" },
    beta: { name: "Point Beta", lat: "", lng: "" },
  };
}

export default function Dashboard() {
  const { activity } = useAppState(); // activity feed still mock for now
  const { user, updateStatus } = useLocalUser();
  const { roster } = useMembers();
  const { supplies } = useSupplies();
  const navigate = useNavigate();
  const [editingPoint, setEditingPoint] = useState<"alfa" | "beta" | null>(null);
  const [waypoints, setWaypoints] = useState(loadWaypoints);
  const [updating, setUpdating] = useState(false);

  const supplyPercent = (() => {
    const totalNeed = supplies.reduce((a, s) => a + s.need, 0);
    if (totalNeed === 0) return 0;
    return Math.round(supplies.reduce((a, s) => a + s.have, 0) / totalNeed * 100);
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

  // Current user's real status comes from their own member row, not local mock state
  const myEntry = roster.find(r => user && r.role === user.role);
  const myStatus = myEntry?.status ?? null;

  const handleStatusClick = async (status: StatusType) => {
    setUpdating(true);
    await updateStatus(status);
    setUpdating(false);
  };

  return (
    <div className="space-y-5">
      {/* Status Buttons */}
      <section className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Button size="xl" disabled={updating} className={cn("flex-col gap-1 bg-secondary text-primary", myStatus === "ok" && "ring-2 ring-safe")} onClick={() => handleStatusClick("ok")}>
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-xs">I´M OK</span>
          </Button>
          <Button size="xl" disabled={updating} className={cn("flex-col gap-1 bg-secondary text-warning", myStatus === "help" && "ring-2 ring-warning")} onClick={() => handleStatusClick("help")}>
            <AlertTriangle className="h-6 w-6" />
            <span className="text-xs">HELP</span>
          </Button>
          <Button size="xl" disabled={updating} className={cn("flex-col gap-1 bg-secondary text-critical", myStatus === "critical" && "ring-2 ring-critical")} onClick={() => handleStatusClick("critical")}>
            <ShieldAlert className="h-6 w-6" />
            <span className="text-xs">CRITICAL</span>
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
            <Card key={key} className=" transition-all" onClick={() => !isEditing && setEditingPoint(key)}>
              <CardContent className="py-3 px-3">
                {isEditing ? (
                  <div className="space-y-2" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading text-primary">POINT {label}</span>
                      <button onClick={() => setEditingPoint(null)}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <Input placeholder="Latitude" value={wp.lat} onChange={e => updateWaypoint(key, "lat", e.target.value)} className="h-7 text-xs bg-secondary" />
                    <Input placeholder="Longitude" value={wp.lng} onChange={e => updateWaypoint(key, "lng", e.target.value)} className="h-7 text-xs bg-secondary" />
                    <Button size="sm" className="w-full h-7 font-bold text-black" onClick={() => setEditingPoint(null)}>Save</Button>
                  </div>
                ) : (
                  <div className="flex gap-1 flex-col items-center">
                    <MapPin className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Point</span>
                    <span className="text-sm font-heading font-bold text-foreground">{label}</span>
                    {hasCoords(wp) ? (
                      <span className="text-xs text-primary font-mono text-center">
                        {parseFloat(wp.lat).toFixed(4)}, {parseFloat(wp.lng).toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Tap to define</span>
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
        <Card className="tactical-border transition-all" onClick={() => navigate("/insumos")}>
          <CardContent className="flex flex-col items-center py-3 px-2">
            <Package className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Supplies</span>
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

      {/* Knot Members */}
      <Card className="">
        <NavLink to="/grupo">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="h-7 w-7 text-primary" /> KNOT MEMBERS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {roster.map((entry) => {
              const isSelf = user?.role === entry.role;
              return (
                <div key={entry.role} className={cn("flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5", isSelf && "border border-primary/20", !entry.filled && "opacity-60")}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {entry.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading font-semibold truncate">
                      {entry.filled ? (isSelf ? user!.displayName : entry.displayName) : "Role not filled"}
                      {isSelf && <span className="text-primary text-xs ml-1">(YOU)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{roleLabels[entry.role]}</p>
                  </div>
                  <StatusBadge status={entry.status} />
                  <span className="text-xs text-muted-foreground">
                    {entry.lastCheckIn ? new Date(entry.lastCheckIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </NavLink>
      </Card>

      {/* Activity Feed */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-center">ACTIVITY FEED</CardTitle>
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