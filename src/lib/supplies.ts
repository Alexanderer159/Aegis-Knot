import type { RoleType } from "@/lib/store";

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  have: number;
  need: number;
  unit: string;
  acquired: boolean;
}

const STORAGE_KEY = "aegis-supplies";

export const defaultSupplies: SupplyItem[] = [
  { id: "w1", name: "Agua potable", category: "Water", have: 9, need: 18, unit: "L", acquired: false },
  { id: "w2", name: "Pastillas potabilizadoras", category: "Water", have: 20, need: 50, unit: "uds", acquired: false },
  { id: "w3", name: "Filtro portátil", category: "Water", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "f1", name: "Raciones de emergencia", category: "Food", have: 12, need: 36, unit: "raciones", acquired: false },
  { id: "f2", name: "Barras energéticas", category: "Food", have: 10, need: 30, unit: "uds", acquired: false },
  { id: "f3", name: "Comida enlatada", category: "Food", have: 6, need: 18, unit: "latas", acquired: false },
  { id: "f4", name: "Sal y azúcar", category: "Food", have: 1, need: 2, unit: "kg", acquired: false },
  { id: "m1", name: "Vendas y gasas", category: "Medicine", have: 3, need: 5, unit: "paq", acquired: false },
  { id: "m2", name: "Antiséptico", category: "Medicine", have: 1, need: 2, unit: "frascos", acquired: false },
  { id: "m3", name: "Analgésicos", category: "Medicine", have: 10, need: 30, unit: "pastillas", acquired: false },
  { id: "m4", name: "Suero oral", category: "Medicine", have: 2, need: 6, unit: "sobres", acquired: false },
  { id: "m5", name: "Guantes nitrilo", category: "Medicine", have: 10, need: 20, unit: "pares", acquired: false },
  { id: "e1", name: "Baterías AA", category: "Energy", have: 8, need: 24, unit: "uds", acquired: false },
  { id: "e2", name: "Baterías recargables", category: "Energy", have: 2, need: 4, unit: "uds", acquired: false },
  { id: "e3", name: "Combustible", category: "Energy", have: 5, need: 20, unit: "L", acquired: false },
  { id: "e4", name: "Velas", category: "Energy", have: 6, need: 12, unit: "uds", acquired: false },
  { id: "t1", name: "Cuerda / paracord", category: "Tools", have: 15, need: 50, unit: "m", acquired: false },
  { id: "t2", name: "Cinta adhesiva", category: "Tools", have: 1, need: 3, unit: "rollos", acquired: false },
  { id: "t3", name: "Multiherramienta", category: "Tools", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "t4", name: "Lona impermeable", category: "Tools", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "c1", name: "Radio portátil", category: "Communications", have: 1, need: 2, unit: "uds", acquired: false },
  { id: "c2", name: "Silbato emergencia", category: "Communications", have: 2, need: 6, unit: "uds", acquired: false },
  { id: "c3", name: "Bengalas", category: "Communications", have: 0, need: 4, unit: "uds", acquired: false },
];

export function loadSupplies(): SupplyItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultSupplies;
}

export function saveSupplies(items: SupplyItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const categoryColors: Record<string, string> = {
  Water: "border-blue-500/40 border-2 text-blue-400 font-semibold bg-secondary",
  Food: "border-amber-500/40 border-2 text-amber-400 font-semibold bg-secondary",
  Medicine: "border-red-500/20 border-2 text-red-400 font-semibold bg-secondary",
  Energy: "border-yellow-500/20 border-2 text-yellow-400 font-semibold bg-secondary",
  Tools: "border-primary/20 border-2 text-primary font-semibold bg-secondary",
  Communications: "border-purple-500/20 border-2 text-purple-400 font-semibold bg-secondary",
};

// Which supply categories each pod role is responsible for.
// Later this should live in the backend (per-group role config), for now it's a static map
// used purely to filter the local supplies list on the Grupo page.
export const roleCategoryMap: Record<RoleType, string[]> = {
  vanguard: [],
  medic: ["Medicine"],
  navigator: [],
  comms: ["Communications"],
  quartermaster: ["Water", "Food", "Energy"],
  builder: ["Tools"],
};