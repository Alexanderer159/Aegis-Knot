export interface RoleContentItem {
  id: string;
  text: string;
  checked?: boolean;
}

export const roleDefaultContent: Record<string, RoleContentItem[]> = {
  vanguard: [
    { id: "v1", text: "Verify status of all pod members" },
    { id: "v2", text: "Review updated evacuation routes" },
    { id: "v3", text: "Coordinate next meeting point" },
    { id: "v4", text: "Assess active threats in the area" },
    { id: "v5", text: "Assign night watch shifts" },
  ],
  navigator: [
    { id: "n1", text: "Physical maps of the area (1:50,000 scale)" },
    { id: "n2", text: "Military compass" },
    { id: "n3", text: "Portable GPS with spare batteries" },
    { id: "n4", text: "Route markers (reflective tape)" },
    { id: "n5", text: "Altimeter / barometer" },
    { id: "n6", text: "Documented evacuation routes" },
  ],
};