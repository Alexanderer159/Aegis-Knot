import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Shield, Heart, Compass, Radio, Package, HardHat, Plus, Trash2, ListChecks, ClipboardList } from "lucide-react";
import { roleLabels, roleDescriptions, type RoleType, type StatusType } from "@/lib/store";
import { roleDefaultContent, type RoleContentItem } from "@/lib/roleContent";
import { useSupplies } from "@/hooks/useSupplies";
import { roleCategoryMap } from "@/lib/supplies";
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
  const { supplies } = useSupplies();

  // Keep the last non-null role around so content doesn't vanish mid-close-animation
  const [displayRole, setDisplayRole] = useState<RoleType | null>(role);
  useEffect(() => {
    if (role) setDisplayRole(role);
  }, [role]);

  const isTaskRole = displayRole ? taskRoles.includes(displayRole) : false;

  useEffect(() => {
    if (!role) return;
    if (taskRoles.includes(role)) {
      setItems(loadItems(role));
    }
  }, [role]);

  if (!displayRole) return null; // only truly unmount once nothing has ever been shown

  const Icon = roleIcons[displayRole];
  const isVanguard = displayRole === "vanguard";

  const persist = (updated: RoleContentItem[]) => {
    setItems(updated);
    saveItems(displayRole, updated);
  };

  const toggleItem = (id: string) => {
    persist(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    persist([...items, { id: Date.now().toString(), text: newItem.trim(), checked: isVanguard ? undefined : false }]);
    setNewItem("");
  };

  const removeItem = (id: string) => {
    persist(items.filter(i => i.id !== id));
  };

  const relevantCategories = roleCategoryMap[displayRole] || [];
  const filteredSupplies = supplies.filter(s => relevantCategories.includes(s.category));

  return (
    <Sheet open={!!role} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[80vh] bg-card/50 backdrop-blur-md z-[950]">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Icon className="h-5 w-5 text-primary" />
            {roleLabels[displayRole]}
          </SheetTitle>
        </SheetHeader>

        {/* Member Status Block */}
        <div className="flex items-center pb-3">
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold truncate text-xl">{userName}</p>
            {lastCheckIn && (
              <p className="text-xs text-muted-foreground">
                Last check-in: {new Date(lastCheckIn).toLocaleString([], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
          <Button size="sm" className="shrink-0 bg-transparent">
            <span className={cn(
              "text-xl",
              status === "ok" ? "text-safe" : status === "help" ? "text-warning" : status === "critical" ? "text-critical" : "text-outline"
            )}>
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
                  {!isVanguard && (
                    <Checkbox checked={!!item.checked} onCheckedChange={() => toggleItem(item.id)}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  )}
                  <span className={cn("text-sm flex-1", !isVanguard && item.checked && "line-through text-muted-foreground")}>
                    {isVanguard && "• "}{item.text}
                  </span>
                  {isCurrentUser && (
                    <button onClick={() => removeItem(item.id)} className="text-critical p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No registered elements</p>
              )}
            </>
          ) : (
            <>
              {relevantCategories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  This role doesn't manage supplies.
                </p>
              )}
              {relevantCategories.length > 0 && filteredSupplies.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No registered supplies on this category.
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
              placeholder={isVanguard ? "Add entry to list..." : "Add task..."}
              className="bg-secondary border-border text-sm"
            />
            <Button size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isCurrentUser && !isTaskRole && (
          <p className="text-xs text-muted-foreground text-center pt-3">
            Manage these supplies from the supplies tab.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}