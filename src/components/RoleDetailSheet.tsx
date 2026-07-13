import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Heart, Compass, Radio, Package, HardHat, Plus, Trash2, ListChecks, ClipboardList } from "lucide-react";
import { roleLabels, roleDescriptions, type RoleType } from "@/lib/store";
import { roleDefaultContent, type RoleContentItem } from "@/lib/roleContent";
import { cn } from "@/lib/utils";

const roleIcons: Record<RoleType, React.ElementType> = {
  vanguard: Shield,
  medic: Heart,
  navigator: Compass,
  comms: Radio,
  quartermaster: Package,
  builder: HardHat,
};

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
  onClose: () => void;
}

export default function RoleDetailSheet({ role, isCurrentUser, userName, onClose }: Props) {
  const [items, setItems] = useState<RoleContentItem[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (role) setItems(loadItems(role));
  }, [role]);

  if (!role) return null;

  const Icon = roleIcons[role];
  const isVanguard = role === "vanguard";

  const persist = (updated: RoleContentItem[]) => {
    setItems(updated);
    saveItems(role, updated);
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

  return (
    <Sheet open={!!role} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[80vh] bg-card border-t border-primary/20">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Icon className="h-5 w-5 text-primary" />
            {roleLabels[role]}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            {userName} — {roleDescriptions[role]}
          </p>
        </SheetHeader>

        <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
          <div className="flex items-center gap-2 pb-2">
            {isVanguard ? (
              <ClipboardList className="h-4 w-4 text-primary" />
            ) : (
              <ListChecks className="h-4 w-4 text-primary" />
            )}
            <span className="text-xs font-heading text-muted-foreground tracking-wider">
              {isVanguard ? "AGENDA DEL LÍDER" : "INVENTARIO / INSUMOS"}
            </span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              {!isVanguard && (
                <Checkbox
                  checked={!!item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              )}
              <span className={cn(
                "text-sm flex-1",
                !isVanguard && item.checked && "line-through text-muted-foreground"
              )}>
                {isVanguard && "• "}{item.text}
              </span>
              {isCurrentUser && (
                <button onClick={() => removeItem(item.id)} className="text-muted-foreground text-critical p-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Sin elementos registrados</p>
          )}
        </div>

        {isCurrentUser && (
          <div className="flex gap-2 pt-3">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder={isVanguard ? "Agregar punto de agenda..." : "Agregar insumo..."}
              className="bg-secondary border-border text-sm"
            />
            <Button variant="safe" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
