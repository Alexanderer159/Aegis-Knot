import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Shield, Heart, Compass, Radio, Package, HardHat, Plus, Trash2, ListChecks, ClipboardList } from "lucide-react";
import { roleLabels, roleDescriptions, type RoleType, type StatusType } from "@/lib/store";
import { roleDefaultContent, type RoleContentItem } from "@/lib/roleContent";
import { loadSupplies, roleCategoryMap, type SupplyItem } from "@/lib/supplies";
import { cn } from "@/lib/utils";

const roleIcons: Record<RoleType, React.ElementType> = {
  vanguard: Shield,
  medic: Heart,
  navigator: Compass,
  comms: Radio,
  quartermaster: Package,
  builder: HardHat,
};

const taskRoles: RoleType[] = ["vanguard", "navigator"];

function getStorageKey(role: RoleType) {
  return `aegis-role-content-${role}`;
}

function loadItems(role: RoleType): RoleContentItem[] {
  try {
    const stored = localStorage.getItem(getStorageKey(role));
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return roleDefaultContent[role] || [];
}

function saveItems(role: RoleType, items: RoleContentItem[]) {
  localStorage.setItem(getStorageKey(role), JSON.stringify(items));
}

interface Props {
  role: RoleType | null;
  isCurrentUser: boolean;
  userName: string;
  avatar?: string;
  status?: StatusType | null;
  lastCheckIn?: string;
  onClose: () => void;
}

export default function RoleDetailSheet({ role, isCurrentUser, userName, avatar, status, lastCheckIn, onClose }: Props) {
  const [items, setItems] = useState<RoleContentItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);

  const isTaskRole = role ? taskRoles.includes(role) : false;

  useEffect(() => {
    if (!role) return;
    if (taskRoles.includes(role)) {
      setItems(loadItems(role));
    } else {
      setSupplies(loadSupplies());
    }
  }, [role]);

  if (!role) return null;

  const Icon = roleIcons[role];
  const isList = role === "vanguard" || "navigator";

  const persist = (updated: RoleContentItem[]) => {
    setItems(updated);
    saveItems(role, updated);
  };

  const toggleItem = (id: string) => {
    persist(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    persist([...items, { id: Date.now().toString(), text: newItem.trim(), checked: isList ? undefined : false }]);
    setNewItem("");
  };

  const removeItem = (id: string) => {
    persist(items.filter(i => i.id !== id));
  };

  const relevantCategories = roleCategoryMap[role] || [];
  const filteredSupplies = supplies.filter(s => relevantCategories.includes(s.category));

  const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Sheet open={!!role} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[80vh] bg-card border-t border-primary/20">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Icon className="h-5 w-5 text-primary" />
            {roleLabels[role]}
          </SheetTitle>
        </SheetHeader>

        {/* Member Status Block */}
        <div className="flex items-center pb-3">
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold truncate text-xl">{userName}</p>
            {lastCheckIn && (
              <p className="text-xs text-muted-foreground">Last check-in: {lastCheckIn}</p>
            )}
          </div>
          <Button variant={status === "ok" ? "safe" : status === "help" ? "warning" : status === "critical" ? "critical" : "outline"} size="sm" className="shrink-0">
            <span className="text-sm text-white">
              {status === "ok" ? "Ok" : status === "help" ? "Help" : status === "critical" ? "Critical" : "Offline"}
            </span>
          </Button>
        </div>

        <div className="space-y-1 max-h-[45vh] overflow-y-auto pr-1">
          <div className="flex items-center pb-2">
            <span className="text-sm tracking-widest text-center w-full">
              {isTaskRole ? "TASKS" : "INVENTORY"}
            </span>
          </div>

          {isTaskRole ? (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                  {!isList && (
                    <Checkbox checked={!!item.checked} onCheckedChange={() => toggleItem(item.id)}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"/>
                  )}
                  <span className={cn("text-sm flex-1", !isList && item.checked && "line-through text-muted-foreground")}>
                    {isList && "• "}{item.text}
                  </span>
                  {isCurrentUser && (
                    <button onClick={() => removeItem(item.id)} className="text-critical p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Sin elementos registrados</p>
              )}
            </>
          ) : (
            <>
              {relevantCategories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Este rol no gestiona categorías de insumos
                </p>
              )}
              {relevantCategories.length > 0 && filteredSupplies.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay insumos registrados en esta categoría
                </p>
              )}
              {filteredSupplies.map((item) => {
                const percent = item.need > 0 ? Math.round((item.have / item.need) * 100) : 0;
                const isComplete = item.have >= item.need;
                return (
                  <div key={item.id} className="rounded-lg bg-secondary/50 px-3 py-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-heading font-semibold">{item.name}</span>
                      <span className={cn("text-xs font-mono", isComplete ? "text-primary" : "text-warning")}>
                        {item.have}/{item.need} {item.unit}
                      </span>
                    </div>
                    <Progress value={percent} className="h-1" />
                  </div>
                );
              })}
            </>
          )}
        </div>

        {isCurrentUser && isTaskRole && (
          <div className="flex gap-2 pt-3">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder={isList ? "Agregar punto de agenda..." : "Agregar tarea..."}
              className="bg-secondary border-border text-sm"
            />
            <Button variant="safe" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isCurrentUser && !isTaskRole && (
          <p className="text-xs text-muted-foreground text-center pt-3">
            Gestiona estos insumos desde la pestaña Insumos
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}