import { useState } from "react";
import { Package, Plus, Minus, ShoppingCart, Check, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {type SupplyItem,loadSupplies, saveSupplies, categoryColors,} from "@/lib/supplies";

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
        <h2 className="text-3xl text-center text-foreground">SUMINISTROS</h2>
        <Card className="">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <Package className="h-7 w-7 text-primary" />
                <span className="font-heading font-bold text-lg">{overallPercent}% COMPLETO</span>
              </div>

              <Badge variant="outline" className="border-primary/50">{pendingCount} pendientes</Badge>

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
          <button key={cat} onClick={() => setFilter(cat)} className={cn("shrink-0 rounded-md font-semibold p-2 transition-all", filter === cat ? "bg-primary/70" : "bg-secondary")}>
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
            <Card key={item.id} className="transition-all">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {/* Check button */}
                  <button onClick={() => toggleAcquired(item.id)} className={cn("shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                      item.acquired ? "bg-primary border-primary" : isComplete ? "border-primary" : "border-muted-foreground/30")}>
                    {item.acquired && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-heading font-semibold truncate", item.acquired && "text-muted-foreground")}>
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
                          className="flex items-center gap-1 shrink-0 transition-all"
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
                    <button onClick={() => decrement(item.id)}
                      className="h-7 w-7 rounded bg-secondary flex items-center justify-center transition-all"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => increment(item.id)}
                      className="h-7 w-7 rounded bg-secondary flex items-center justify-center transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 rounded bg-secondary flex items-center justify-center text-muted-foreground transition-all"
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
