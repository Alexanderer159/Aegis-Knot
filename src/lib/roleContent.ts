export interface RoleContentItem {
  id: string;
  text: string;
  checked?: boolean;
}

export const roleDefaultContent: Record<string, RoleContentItem[]> = {
  vanguard: [
    { id: "v1", text: "Verificar estado de todos los miembros del pod" },
    { id: "v2", text: "Revisar rutas de evacuación actualizadas" },
    { id: "v3", text: "Coordinar próximo punto de encuentro" },
    { id: "v4", text: "Evaluar amenazas activas en la zona" },
    { id: "v5", text: "Asignar turnos de vigilancia nocturna" },
  ],
  navigator: [
    { id: "n1", text: "Mapas físicos de la zona (escala 1:50,000)"},
    { id: "n2", text: "Brújula militar"},
    { id: "n3", text: "GPS portátil con baterías de repuesto"},
    { id: "n4", text: "Marcadores de ruta (cinta reflectante)"},
    { id: "n5", text: "Altímetro / barómetro"},
    { id: "n6", text: "Rutas de evacuación documentadas"},
  ],
};
