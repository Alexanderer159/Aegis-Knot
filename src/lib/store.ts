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

export interface MapMarker {
  id: string;
  name: string;
  type: "meeting" | "danger" | "resource" | "shelter";
  lat: number;
  lng: number;
}

// Mock data
export const mockPodMembers: PodMember[] = [
  { id: "1", name: "Carlos R.", role: "vanguard", avatar: "CR", status: "ok", lastCheckIn: "5 min ago" },
  { id: "2", name: "Ana M.", role: "medic", avatar: "AM", status: "critical", lastCheckIn: "12 min ago" },
  { id: "3", name: "Luis P.", role: "navigator", avatar: "LP", status: "help", lastCheckIn: "3 min ago" },
  { id: "4", name: "María G.", role: "comms", avatar: "MG", status: "ok", lastCheckIn: "8 min ago" },
  { id: "5", name: "Diego F.", role: "quartermaster", avatar: "DF", status: null, lastCheckIn: "45 min ago" },
  { id: "6", name: "Tomás V.", role: "builder", avatar: "TV", status: "ok", lastCheckIn: "10 min ago" },
];

export const mockActivity: ActivityItem[] = [
  { id: "1", memberId: "1", memberName: "Carlos R.", action: "reported I´m Ok", timestamp: "14:32", type: "status" },
  { id: "2", memberId: "3", memberName: "Luis P.", action: "Needs Help - Blocked route", timestamp: "14:28", type: "alert" },
  { id: "3", memberId: "2", memberName: "Ana M.", action: "Updated medical inventory", timestamp: "14:15", type: "inventory" },
  { id: "4", memberId: "4", memberName: "María G.", action: "Point Beta Check In", timestamp: "14:05", type: "checkin" },
  { id: "5", memberId: "5", memberName: "Diego F.", action: "Warning: Water at 20%", timestamp: "13:50", type: "alert" },
];

export const mockMarkers: MapMarker[] = [
  { id: "1", name: "Point Alpha", type: "meeting", lat: 40.417211, lng: -3.701757 },
  { id: "2", name: "Point Beta", type: "meeting", lat: 40.411249, lng: -3.708735 },
  { id: "3", name: "Danger Zone", type: "danger", lat: 40.415146, lng: -3.708735 },
  { id: "4", name: "Water resource", type: "resource", lat: 40.408249, lng: -3.708735},
  { id: "5", name: "Northern shelter", type: "shelter", lat: 40.441249, lng: -3.705735 },
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
  vanguard: "Group Leader",
  medic: "Medical Expert",
  navigator: "Navigation & Routes",
  comms: "Communications",
  quartermaster: "Logistics & Supplies",
  builder: "Construction",
};

export function useAppState() {
  const [userStatus, setUserStatus] = useState<StatusType>(null);
  const [activity, setActivity] = useState<ActivityItem[]>(mockActivity);

  const updateStatus = useCallback((status: StatusType) => {
    setUserStatus(status);
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      memberId: "1",
      memberName: "You",
      action: status === "ok" ? "reported I'm Ok" : status === "help" ? "Need Help" : "Critical State",
      timestamp: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
      type: "status",
    };
    setActivity((prev) => [newActivity, ...prev]);
  }, []);

  return { userStatus, updateStatus, activity };
}
