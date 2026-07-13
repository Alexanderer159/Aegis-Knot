import { useState } from "react";
import { Shield, Heart, Compass, Radio, Package, HardHat, Users, UserPlus, Bell, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockPodMembers, roleLabels, roleDescriptions, type RoleType, type StatusType } from "@/lib/store";
import { useLocalUser } from "@/hooks/useLocalUser";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import RoleDetailSheet from "@/components/RoleDetailSheet";

const roleIcons: Record<RoleType, React.ElementType> = {
  vanguard: Shield,
  medic: Heart,
  navigator: Compass,
  comms: Radio,
  quartermaster: Package,
  builder: HardHat,
};

export default function Grupo() {
  const { user, addDependent, removeDependent } = useLocalUser();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [sheetRole, setSheetRole] = useState<RoleType | null>(null);
  const selectedMember = selectedRole ? mockPodMembers.find((m) => m.role === selectedRole) : null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [depName, setDepName] = useState("");
  const [depRelation, setDepRelation] = useState("Familiar");
  const [depLocation, setDepLocation] = useState("");

  const dependents = user?.dependents ?? [];

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depName.trim()) return;
    addDependent({
      name: depName.trim(),
      relation: depRelation,
      location: depLocation.trim() || "Sin ubicación",
      status: null,
    });
    toast({ title: "Nodo vinculado", description: `${depName.trim()} agregado como ${depRelation}` });
    setDepName("");
    setDepRelation("Familiar");
    setDepLocation("");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-3xl text-center">KNOT</h2>

      {/* Role Cards */}
      <div className="space-y-2">
        {mockPodMembers.map((member) => {
          const Icon = roleIcons[member.role];
          const isSelected = selectedRole === member.role;
          const isCurrentUser = user?.role === member.role;
          return (
            <Card
              key={member.id}
              className={cn(
                "tactical-border cursor-pointer transition-all",
                isSelected && "border-primary/50 glow-green",
                isCurrentUser && "border-primary/30"
              )}
              onClick={() => setSelectedRole(isSelected ? null : member.role)}
            >
              <CardContent className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-heading font-bold">
                    {roleLabels[member.role]}
                    {isCurrentUser && <span className="text-primary text-xs ml-2">(TÚ)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isCurrentUser ? user!.displayName : member.name} — {roleDescriptions[member.role]}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSheetRole(member.role); }}
                  className="p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className={cn(
                  "h-3 w-3 rounded-full",
                  member.status === "ok" ? "bg-safe" : member.status === "help" ? "bg-warning" : "bg-muted-foreground"
                )} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Role Detail */}
      {selectedMember && (
        <Card className="tactical-border border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {(() => { const Icon = roleIcons[selectedMember.role]; return <Icon className="h-4 w-4 text-primary" />; })()}
              {roleLabels[selectedMember.role]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
                {user?.role === selectedMember.role
                  ? user.displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
                  : selectedMember.avatar}
              </div>
              <div>
                <p className="font-heading font-bold">
                  {user?.role === selectedMember.role ? user.displayName : selectedMember.name}
                </p>
                <p className="text-xs text-muted-foreground">{roleDescriptions[selectedMember.role]}</p>
              </div>
              <Button variant="safe" size="sm" className="ml-auto">
                <span className="text-xs">ESTADO: OK</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Último check-in: {selectedMember.lastCheckIn}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Family Nodes */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            NODOS FAMILIARES ({dependents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dependents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No hay dependientes vinculados
            </p>
          )}
          {dependents.map((dep) => (
            <div key={dep.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold">
                {dep.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-heading font-semibold">{dep.name}</p>
                <p className="text-xs text-muted-foreground">{dep.relation} — {dep.location}</p>
              </div>
              <span className={cn(
                "h-2.5 w-2.5 rounded-full",
                dep.status === "ok" ? "bg-safe" : "bg-muted-foreground"
              )} />
              <button
                onClick={() => {
                  removeDependent(dep.id);
                  toast({ title: "Nodo eliminado", description: `${dep.name} fue desvinculado` });
                }}
                className="text-muted-foreground hover:text-critical transition-colors p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Vincular
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Vincular Dependiente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddDependent} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={depName}
                      onChange={(e) => setDepName(e.target.value)}
                      placeholder="Nombre completo"
                      className="bg-secondary border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relación</Label>
                    <Select value={depRelation} onValueChange={setDepRelation}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                        <SelectItem value="Pareja">Pareja</SelectItem>
                        <SelectItem value="Padre/Madre">Padre/Madre</SelectItem>
                        <SelectItem value="Familiar">Familiar</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ubicación habitual</Label>
                    <Input
                      value={depLocation}
                      onChange={(e) => setDepLocation(e.target.value)}
                      placeholder="Casa, trabajo, escuela..."
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button type="submit" variant="safe" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" /> VINCULAR
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="warning" size="sm" className="flex-1">
              <Bell className="h-4 w-4 mr-1" />
              Reunir Familia
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Role Detail Sheet */}
      <RoleDetailSheet
        role={sheetRole}
        isCurrentUser={user?.role === sheetRole}
        userName={user?.role === sheetRole ? user.displayName : mockPodMembers.find(m => m.role === sheetRole)?.name || ""}
        onClose={() => setSheetRole(null)}
      />
    </div>
  );
}
