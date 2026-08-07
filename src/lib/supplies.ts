import type { RoleType } from "@/lib/store";
import type { Enums } from "@/integrations/supabase/types";

export type SupplyCategory = Enums<"supply_category">;

export const categoryColors: Record<string, string> = {
  Water: " text-blue-400 font-semibold bg-secondary",
  Food: " text-amber-400 font-semibold bg-secondary",
  Medicine: " text-red-400 font-semibold bg-secondary",
  Energy: "text-yellow-400 font-semibold bg-secondary",
  Tools: " text-primary font-semibold bg-secondary",
  Communications: "text-purple-400 font-semibold bg-secondary",
};

export const roleCategoryMap: Record<RoleType, string[]> = {
  vanguard: [],
  medic: ["Medicine"],
  navigator: [],
  comms: ["Communications"],
  quartermaster: ["Water", "Food", "Energy"],
  builder: ["Tools"],
};