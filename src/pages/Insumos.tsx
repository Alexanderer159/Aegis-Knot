import { useState } from "react";
import { Package, Plus, Minus, ShoppingCart, Check, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SupplyItem {
  id: string;
  name: string;
  category: string;
  have: number;
  need: number;
  unit: string;
  acquired: boolean;
}

const STORAGE_KEY = "aegis-supplies";

const defaultSupplies: SupplyItem[] = [
  { id: "w1", name: "Agua potable", category: "Agua", have: 9, need: 18, unit: "L", acquired: false },
  { id: "w2", name: "Pastillas potabilizadoras", category: "Agua", have: 20, need: 50, unit: "uds", acquired: false },
  { id: "w3", name: "Filtro portátil", category: "Agua", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "f1", name: "Raciones de emergencia", category: "Alimentación", have: 12, need: 36, unit: "raciones", acquired: false },
  { id: "f2", name: "Barras energéticas", category: "Alimentación", have: 10, need: 30, unit: "uds", acquired: false },
  { id: "f3", name: "Comida enlatada", category: "Alimentación", have: 6, need: 18, unit: "latas", acquired: false },
  { id: "f4", name: "Sal y azúcar", category: "Alimentación", have: 1, need: 2, unit: "kg", acquired: false },
  { id: "m1", name: "Vendas y gasas", category: "Médico", have: 3, need: 5, unit: "paq", acquired: false },
  { id: "m2", name: "Antiséptico", category: "Médico", have: 1, need: 2, unit: "frascos", acquired: false },
  { id: "m3", name: "Analgésicos", category: "Médico", have: 10, need: 30, unit: "pastillas", acquired: false },
  { id: "m4", name: "Suero oral", category: "Médico", have: 2, need: 6, unit: "sobres", acquired: false },
  { id: "m5", name: "Guantes nitrilo", category: "Médico", have: 10, need: 20, unit: "pares", acquired: false },
  { id: "e1", name: "Baterías AA", category: "Energía", have: 8, need: 24, unit: "uds", acquired: false },
  { id: "e2", name: "Baterías recargables", category: "Energía", have: 2, need: 4, unit: "uds", acquired: false },
  { id: "e3", name: "Combustible", category: "Energía", have: 5, need: 20, unit: "L", acquired: false },
  { id: "e4", name: "Velas", category: "Energía", have: 6, need: 12, unit: "uds", acquired: false },
  { id: "t1", name: "Cuerda / paracord", category: "Herramientas", have: 15, need: 50, unit: "m", acquired: false },
  { id: "t2", name: "Cinta adhesiva", category: "Herramientas", have: 1, need: 3, unit: "rollos", acquired: false },
  { id: "t3", name: "Multiherramienta", category: "Herramientas", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "t4", name: "Lona impermeable", category: "Herramientas", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "c1", name: "Radio portátil", category: "Comunicaciones", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "c2", name: "Silbato emergencia", category: "Comunicaciones", have: 2, need: 6, unit: "uds", acquired: false },
  { id: "c3", name: "Bengalas", category: "Comunicaciones", have: 0, need: 4, unit: "uds", acquired: false },
];

function loadSupplies(): SupplyItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultSupplies;
}

function saveSupplies(items: SupplyItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const categoryColors: Record<string, string> = {
  Agua: "bg-blue-500/20 text-blue-400",
  Alimentación: "bg-amber-500/20 text-amber-400",
  Médico: "bg-red-500/20 text-red-400",
  Energía: "bg-yellow-500/20 text-yellow-400",
  Herramientas: "bg-primary/20 text-primary",
  Comunicaciones: "bg-purple-500/20 text-purple-400",
};

export default function Insumos() {
  const [supplies, setSupplies] = useState<SupplyItem[]>(loadSupplies);
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNeedValue, setEditNeedValue] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Herramientas");
  const [newNeed, setNewNeed] = useState("1");
  const [newUnit, setNewUnit] = useState("uds");

  const update = (items: SupplyItem[]) => {
    setSupplies(items);
    saveSupplies(items);
  };

  const increment = (id: string) => {
    update(supplies.map(s => s.id === id ? { ...s, have: Math.min(s.have + 1, s.need) } : s));
  };

  const decrement = (id: string) => {
    update(supplies.map(s => s.id === id ? { ...s, have: Math.max(s.have - 1, 0) } : s));
  };

  const toggleAcquired = (id: string) => {
    update(supplies.map(s => s.id === id ? { ...s, acquired: !s.acquired, have: !s.acquired ? s.need : s.have } : s));
  };

  const removeItem = (id: string) => {
    update(supplies.filter(s => s.id !== id));
  };

  const startEditNeed = (item: SupplyItem) => {
    setEditingId(item.id);
    setEditNeedValue(item.need.toString());
  };

  const saveEditNeed = (id: string) => {
    const val = parseInt(editNeedValue);
    if (val > 0) {
      update(supplies.map(s => s.id === id ? { ...s, need: val, have: Math.min(s.have, val) } : s));
    }
    setEditingId(null);
  };

  const addItem = () => {
    if (!newName.trim()) return;
    const item: SupplyItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      category: newCategory,
      have: 0,
      need: parseInt(newNeed) || 1,
      unit: newUnit,
      acquired: false,
    };
    update([...supplies, item]);
    setNewName("");
    setNewNeed("1");
    setShowAdd(false);
  };

  const categories = ["all", ...Array.from(new Set(supplies.map(s => s.category)))];
  const filtered = filter === "all" ? supplies : supplies.filter(s => s.category === filter);

  const totalItems = supplies.length;
  const completedItems = supplies.filter(s => s.have >= s.need).length;
  const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const pendingCount = totalItems - completedItems;

  return (
    <div className="space-y-5">
      {/* Header Stats */}
      <section className="space-y-3">
        <h2 className="text-lg md:text-2xl text-center text-muted-foreground">Lista de Insumos</h2>
        <Card className="tactical-border">
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-heading font-bold text-lg">{overallPercent}% COMPLETO</span>
              </div>
              <Badge variant="outline" className="border-warning/50 text-warning">
                {pendingCount} pendientes
              </Badge>
            </div>
            <Progress value={overallPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completedItems} de {totalItems} ítems cubiertos</span>
              <span>{supplies.filter(s => s.have < s.need).reduce((acc, s) => acc + (s.need - s.have), 0)} unidades por adquirir</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Category Filter */}
      <div className="grid grid-cols-2 gap-2 overflow-x-auto pb-1 ">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={cn("shrink-0 rounded-md font-bold p-2 font-heading transition-all", filter === cat ? "bg-primary" : "bg-secondary")}>
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
      </div>

      {/* Supply List */}
      <div className="space-y-2">
        {filtered.map(item => {
          const percent = item.need > 0 ? Math.round((item.have / item.need) * 100) : 0;
          const missing = item.need - item.have;
          const isComplete = item.have >= item.need;

          return (
            <Card key={item.id} className={cn(
              "tactical-border transition-opacity",
              item.acquired && "opacity-50"
            )}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {/* Check button */}
                  <button
                    onClick={() => toggleAcquired(item.id)}
                    className={cn(
                      "shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      item.acquired
                        ? "bg-primary border-primary"
                        : isComplete
                          ? "border-primary/50"
                          : "border-muted-foreground/30"
                    )}
                  >
                    {item.acquired && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-heading font-semibold truncate",
                        item.acquired && "line-through text-muted-foreground"
                      )}>
                        {item.name}
                      </span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                        categoryColors[item.category] || "bg-secondary text-secondary-foreground"
                      )}>
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={percent} className="h-1 flex-1" />
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs font-mono">{item.have}/</span>
                          <input
                            type="number"
                            value={editNeedValue}
                            onChange={e => setEditNeedValue(e.target.value)}
                            onBlur={() => saveEditNeed(item.id)}
                            onKeyDown={e => e.key === "Enter" && saveEditNeed(item.id)}
                            className="w-10 h-5 text-xs font-mono bg-secondary border border-border rounded px-1 text-foreground"
                            autoFocus
                          />
                          <span className="text-xs font-mono">{item.unit}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditNeed(item)}
                          className="flex items-center gap-1 shrink-0 hover:text-primary transition-colors"
                        >
                          <span className={cn(
                            "text-xs font-mono",
                            isComplete ? "text-primary" : missing > 0 ? "text-warning" : "text-muted-foreground"
                          )}>
                            {item.have}/{item.need} {item.unit}
                          </span>
                          <Pencil className="h-2.5 w-2.5 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                    {missing > 0 && !item.acquired && (
                      <span className="text-[10px] text-warning">
                        Faltan {missing} {item.unit}
                      </span>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => decrement(item.id)}
                      className="h-7 w-7 rounded bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => increment(item.id)}
                      className="h-7 w-7 rounded bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 rounded bg-secondary flex items-center justify-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Item */}
      {showAdd ? (
        <Card className="tactical-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AGREGAR INSUMO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Nombre del insumo"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-secondary"
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="rounded-md bg-secondary border border-border px-2 py-2 text-sm text-foreground"
              >
                {["Agua", "Alimentación", "Médico", "Energía", "Herramientas", "Comunicaciones"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Input
                placeholder="Cant."
                type="number"
                value={newNeed}
                onChange={e => setNewNeed(e.target.value)}
                className="bg-secondary"
              />
              <Input
                placeholder="Unidad"
                value={newUnit}
                onChange={e => setNewUnit(e.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addItem} size="sm" className="flex-1">
                <Plus className="h-4 w-4 mr-1" /> Agregar
              </Button>
              <Button onClick={() => setShowAdd(false)} size="sm" variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowAdd(true)} variant="outline" className="w-full tactical-border">
          <Plus className="h-4 w-4 mr-2" /> Agregar insumo
        </Button>
      )}
    </div>
  );
}
