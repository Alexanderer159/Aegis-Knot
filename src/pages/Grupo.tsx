import { useState } from "react";
import { Shield, Heart, Compass, Radio, Package, HardHat, Users, UserPlus, Bell, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { roleLabels, roleDescriptions, type RoleType } from "@/lib/store";
import { useMembers } from "@/hooks/useMembers";
import { useSupplies } from "@/hooks/useSupplies";
import { roleCategoryMap } from "@/lib/supplies";
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
  const { roster } = useMembers();
  const [sheetRole, setSheetRole] = useState<RoleType | null>(null);
  const { supplies } = useSupplies();

  const relevantCategories = sheetRole ? roleCategoryMap[sheetRole] : [];
  const filteredSupplies = sheetRole ? supplies.filter((s) => relevantCategories.includes(s.category)) : [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [depName, setDepName] = useState("");
  const [depRelation, setDepRelation] = useState("Family member");
  const [depLocation, setDepLocation] = useState("");

  const dependents = user?.dependents ?? [];

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depName.trim()) return;
    addDependent({
      name: depName.trim(),
      relation: depRelation,
      location: depLocation.trim() || "No location set",
      status: null,
    });
    toast({ title: "Node linked", description: `${depName.trim()} added as ${depRelation}` });
    setDepName("");
    setDepRelation("Family member");
    setDepLocation("");
    setDialogOpen(false);
  };

  const sheetEntry = roster.find(r => r.role === sheetRole);

  return (
    <div className="space-y-5">
      <h2 className="text-3xl text-center">YOUR KNOT</h2>

      {/* Role Cards */}
      <div className="space-y-2">
        {roster.map((entry) => {
          const Icon = roleIcons[entry.role];
          const isCurrentUser = user?.role === entry.role;
          return (
            <Card
              key={entry.role}
              className={cn(
                "tactical-border transition-all",
                isCurrentUser && "border-primary/30",
                !entry.filled && "opacity-60"
              )}
              onClick={() => setSheetRole(entry.role)}
            >
              <CardContent className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary/50">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold">
                    {roleLabels[entry.role]}
                    {isCurrentUser && <span className="text-primary text-xs ml-2">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.filled
                      ? `${isCurrentUser ? user!.displayName : entry.displayName} — ${roleDescriptions[entry.role]}`
                      : "Role not filled"}
                  </p>
                </div>

                <span className={cn(
                  "rounded-sm text-secondary font-bold text-xs text-white w-[50px] p-2 text-center",
                  entry.status === "ok" ? "bg-safe/60" :
                  entry.status === "help" ? "bg-warning" :
                  entry.status === "critical" ? "bg-critical" : "bg-muted-foreground"
                )}>
                  {entry.status === "ok" ? "Ok" : entry.status === "help" ? "Help" : entry.status === "critical" ? "Critical" : "Offline"}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Family Nodes */}
      <Card className="tactical-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            FAMILY ({dependents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dependents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No linked family members
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
                  toast({ title: "Node removed", description: `${dep.name} was unlinked` });
                }}
                className="text-muted-foreground transition-all p-1"
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
                  Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Link Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddDependent} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={depName}
                      onChange={(e) => setDepName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-secondary border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select value={depRelation} onValueChange={setDepRelation}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Son/Daughter">Son/Daughter</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Family member">Family member</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Usual Location</Label>
                    <Input value={depLocation} onChange={(e) => setDepLocation(e.target.value)} placeholder="Home, Work, School..." className="bg-secondary border-border" />
                  </div>
                  <Button type="submit" variant="safe" className="w-full text-white font-semibold">
                    <UserPlus className="h-4 w-4 mr-2" /> Link
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="warning" size="sm" className="flex-1 text-white">
              <Bell className="h-4 w-4 mr-1" />
              Reunite Family
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Detail Sheet */}
      <RoleDetailSheet
        role={sheetRole}
        isCurrentUser={user?.role === sheetRole}
        userName={sheetEntry ? (user?.role === sheetRole ? user!.displayName : sheetEntry.displayName) : ""}
        avatar={sheetEntry?.avatarInitials}
        status={sheetEntry?.status}
        lastCheckIn={sheetEntry?.lastCheckIn ?? undefined}
        onClose={() => setSheetRole(null)}
      />
    </div>
  );
}