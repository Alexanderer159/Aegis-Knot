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
  medic: [
    { id: "m1", text: "Vendas y gasas estériles", checked: true },
    { id: "m2", text: "Antiséptico (yodo/alcohol)", checked: true },
    { id: "m3", text: "Analgésicos y antiinflamatorios", checked: false },
    { id: "m4", text: "Torniquete táctico", checked: true },
    { id: "m5", text: "Suero oral / sales de rehidratación", checked: false },
    { id: "m6", text: "Guantes de nitrilo", checked: true },
    { id: "m7", text: "Tijeras de trauma", checked: true },
    { id: "m8", text: "Manual de primeros auxilios", checked: true },
  ],
  navigator: [
    { id: "n1", text: "Mapas físicos de la zona (escala 1:50,000)", checked: true },
    { id: "n2", text: "Brújula militar", checked: true },
    { id: "n3", text: "GPS portátil con baterías de repuesto", checked: false },
    { id: "n4", text: "Marcadores de ruta (cinta reflectante)", checked: true },
    { id: "n5", text: "Altímetro / barómetro", checked: false },
    { id: "n6", text: "Rutas de evacuación documentadas", checked: true },
  ],
  comms: [
    { id: "c1", text: "Radio VHF/UHF portátil", checked: true },
    { id: "c2", text: "Baterías de repuesto para radio", checked: false },
    { id: "c3", text: "Silbato de emergencia", checked: true },
    { id: "c4", text: "Espejo de señalización", checked: true },
    { id: "c5", text: "Tabla de frecuencias de emergencia", checked: true },
    { id: "c6", text: "Código de señales del pod", checked: true },
    { id: "c7", text: "Bengalas / señales luminosas", checked: false },
  ],
  quartermaster: [
    { id: "q1", text: "Agua potable (mín. 3L por persona/día)", checked: true },
    { id: "q2", text: "Raciones de emergencia (72h)", checked: true },
    { id: "q3", text: "Filtro de agua portátil", checked: false },
    { id: "q4", text: "Pastillas potabilizadoras", checked: true },
    { id: "q5", text: "Combustible para cocina portátil", checked: false },
    { id: "q6", text: "Herramientas multiusos", checked: true },
    { id: "q7", text: "Cuerda / paracord (30m)", checked: true },
    { id: "q8", text: "Linternas + baterías", checked: true },
  ],
  builder: [
    { id: "b1", text: "Lona impermeable (3x4m)", checked: true },
    { id: "b2", text: "Cuerda resistente (50m)", checked: true },
    { id: "b3", text: "Cinta adhesiva reforzada (duct tape)", checked: true },
    { id: "b4", text: "Sierra plegable", checked: false },
    { id: "b5", text: "Clavos y alambre", checked: false },
    { id: "b6", text: "Plástico para impermeabilización", checked: true },
    { id: "b7", text: "Pala plegable", checked: false },
  ],
};
