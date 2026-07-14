import { useState, useCallback } from "react";

export type StatusType = "ok" | "help" | "critical" | null;
export type RoleType = "vanguard" | "medic" | "navigator" | "comms" | "quartermaster" | "builder";

export interface PodMember {
  id: string;
  name: string;
  role: RoleType;
  avatar: string;
  status: StatusType;
  lastCheckIn: string;
}

export interface ActivityItem {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  timestamp: string;
  type: "status" | "checkin" | "alert" | "inventory";
}

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  maxQuantity: number;
  unit: string;
  expiryDate?: string;
}

export interface VaultArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  progress: number;
  type: "pdf" | "video" | "guide";
}

export interface MapMarker {
  id: string;
  name: string;
  type: "meeting" | "danger" | "resource" | "shelter";
  lat: number;
  lng: number;
}

// Mock data
export const mockPodMembers: PodMember[] = [
  { id: "1", name: "Carlos R.", role: "vanguard", avatar: "CR", status: "ok", lastCheckIn: "Hace 5 min" },
  { id: "2", name: "Ana M.", role: "medic", avatar: "AM", status: "critical", lastCheckIn: "Hace 12 min" },
  { id: "3", name: "Luis P.", role: "navigator", avatar: "LP", status: "help", lastCheckIn: "Hace 3 min" },
  { id: "4", name: "María G.", role: "comms", avatar: "MG", status: "ok", lastCheckIn: "Hace 8 min" },
  { id: "5", name: "Diego F.", role: "quartermaster", avatar: "DF", status: null, lastCheckIn: "Hace 45 min" },
  { id: "6", name: "Tomás V.", role: "builder", avatar: "TV", status: "ok", lastCheckIn: "Hace 10 min" },
];

export const mockActivity: ActivityItem[] = [
  { id: "1", memberId: "1", memberName: "Carlos R.", action: "reportó ESTOY BIEN", timestamp: "14:32", type: "status" },
  { id: "2", memberId: "3", memberName: "Luis P.", action: "solicita AYUDA - Ruta bloqueada", timestamp: "14:28", type: "alert" },
  { id: "3", memberId: "2", memberName: "Ana M.", action: "actualizó inventario médico", timestamp: "14:15", type: "inventory" },
  { id: "4", memberId: "4", memberName: "María G.", action: "check-in desde Punto Beta", timestamp: "14:05", type: "checkin" },
  { id: "5", memberId: "5", memberName: "Diego F.", action: "alerta: Agua al 20%", timestamp: "13:50", type: "alert" },
];

export const mockSupplies: SupplyItem[] = [
  { id: "1", name: "Agua", category: "Hidratación", quantity: 150, maxQuantity: 500, unit: "L", expiryDate: "2026-06-01" },
  { id: "2", name: "Comida", category: "Alimentación", quantity: 300, maxQuantity: 500, unit: "raciones" },
  { id: "3", name: "Baterías", category: "Energía", quantity: 12, maxQuantity: 50, unit: "unidades" },
  { id: "4", name: "Botiquín", category: "Médico", quantity: 1, maxQuantity: 1, unit: "completo" },
  { id: "5", name: "Combustible", category: "Energía", quantity: 30, maxQuantity: 100, unit: "L", expiryDate: "2027-01-01" },
];

export const mockVault: VaultArticle[] = [
  { id: "1", title: "Primeros Auxilios Básicos", category: "Primeros Auxilios", icon: "heart-pulse", progress: 80, type: "pdf" },
  { id: "2", title: "RCP y Desfibrilador", category: "Primeros Auxilios", icon: "activity", progress: 60, type: "video" },
  { id: "3", title: "Protocolo 72 Horas", category: "Protocolo 72h", icon: "clock", progress: 100, type: "guide" },
  { id: "4", title: "Construcción de Refugio", category: "Refugio", icon: "home", progress: 45, type: "pdf" },
  { id: "5", title: "Purificación de Agua", category: "Supervivencia", icon: "droplets", progress: 90, type: "guide" },
  { id: "6", title: "Plagas y Mordeduras", category: "Primeros Auxilios", icon: "bug", progress: 30, type: "pdf" },
  { id: "7", title: "Señales de Emergencia", category: "Comunicaciones", icon: "radio", progress: 70, type: "guide" },
];

export const mockMarkers: MapMarker[] = [
  { id: "1", name: "Punto Alfa", type: "meeting", lat: 19.43, lng: -99.13 },
  { id: "2", name: "Punto Beta", type: "meeting", lat: 19.44, lng: -99.15 },
  { id: "3", name: "Zona Peligro", type: "danger", lat: 19.42, lng: -99.14 },
  { id: "4", name: "Fuente de Agua", type: "resource", lat: 19.435, lng: -99.12 },
  { id: "5", name: "Refugio Norte", type: "shelter", lat: 19.45, lng: -99.11 },
];

export const roleLabels: Record<RoleType, string> = {
  vanguard: "Vanguard",
  medic: "The Medic",
  navigator: "The Navigator",
  comms: "The Comms",
  quartermaster: "Quartermaster",
  builder: "The Builder",
};

export const roleDescriptions: Record<RoleType, string> = {
  vanguard: "Líder de Grupo",
  medic: "Experta Sanitaria",
  navigator: "Navegación y Rutas",
  comms: "Comunicaciones",
  quartermaster: "Logística y Suministros",
  builder: "Construcción y Refugios",
};

export function useAppState() {
  const [userStatus, setUserStatus] = useState<StatusType>(null);
  const [activity, setActivity] = useState<ActivityItem[]>(mockActivity);

  const updateStatus = useCallback((status: StatusType) => {
    setUserStatus(status);
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      memberId: "1",
      memberName: "Tú",
      action: status === "ok" ? "reportó ESTOY BIEN" : status === "help" ? "solicita AYUDA" : "estado CRÍTICO",
      timestamp: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
      type: "status",
    };
    setActivity((prev) => [newActivity, ...prev]);
  }, []);

  return { userStatus, updateStatus, activity };
}
