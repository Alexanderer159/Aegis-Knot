export interface KBSection {
  title: string;
  content: string;
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  type: "pdf" | "video" | "guide";
  progress: number;
  sections: KBSection[];
}

export const knowledgeBase: KBArticle[] = [
  // === PRIMEROS AUXILIOS ===
  {
    id: "fa-1",
    title: "Primeros Auxilios Básicos",
    category: "Primeros Auxilios",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Evaluación inicial (ABCDE)",
        content: `A — Vía Aérea: Verificar que no esté obstruida. Inclinar cabeza, elevar mentón.\nB — Respiración: Observar movimiento del pecho 10 segundos. ¿Respira?\nC — Circulación: Buscar pulso carotídeo. Controlar hemorragias con presión directa.\nD — Déficit neurológico: ¿Responde a estímulos? Escala AVDI (Alerta, Voz, Dolor, Inconsciente).\nE — Exposición: Revisar todo el cuerpo buscando lesiones ocultas. Prevenir hipotermia.`,
      },
      {
        title: "Control de hemorragias",
        content: `1. Presión directa: Aplicar con gasa o tela limpia sobre la herida durante 15 min.\n2. Elevación: Si es en extremidad, elevar por encima del corazón.\n3. Torniquete (último recurso): Aplicar 5-7 cm por encima de la herida. Anotar hora de aplicación. NO aflojar sin asistencia médica.\n4. Empacamiento de herida: Para heridas profundas, rellenar con gasa estéril y aplicar presión.`,
      },
      {
        title: "Posición lateral de seguridad",
        content: `Para víctima inconsciente que respira:\n1. Arrodillarse junto a la víctima\n2. Brazo más cercano en ángulo recto\n3. Llevar el brazo lejano al hombro cercano\n4. Flexionar rodilla lejana y girar hacia ti\n5. Ajustar cabeza para mantener vía aérea abierta\n6. Verificar respiración cada minuto`,
      },
    ],
  },
  {
    id: "fa-2",
    title: "RCP — Reanimación Cardiopulmonar",
    category: "Primeros Auxilios",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "RCP en adultos",
        content: `1. Confirmar que no responde y no respira normalmente\n2. Llamar a emergencias (o enviar a alguien)\n3. Colocar talón de la mano en el centro del pecho\n4. Comprimir 5-6 cm de profundidad, a ritmo de 100-120/min\n5. Cada 30 compresiones dar 2 ventilaciones (si estás entrenado)\n6. NO detenerse hasta que llegue ayuda o la víctima se mueva\n\nTruco: Comprimir al ritmo de "Stayin' Alive" de los Bee Gees.`,
      },
      {
        title: "RCP en niños (1-8 años)",
        content: `Misma técnica pero:\n- Usar UNA sola mano para comprimir\n- Profundidad: 5 cm (un tercio del pecho)\n- 5 ventilaciones de rescate ANTES de iniciar ciclo 30:2\n- Comprimir con la base de la palma`,
      },
      {
        title: "Uso del DEA (Desfibrilador)",
        content: `1. Encender el DEA y seguir instrucciones de voz\n2. Colocar parches: uno bajo clavícula derecha, otro bajo axila izquierda\n3. NO tocar a la víctima mientras el DEA analiza\n4. Si indica descarga: verificar que nadie toque a la víctima y presionar botón\n5. Reanudar RCP inmediatamente después de la descarga\n6. Continuar hasta que llegue ayuda profesional`,
      },
    ],
  },
  {
    id: "fa-3",
    title: "Fracturas e Inmovilización",
    category: "Primeros Auxilios",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Identificación de fracturas",
        content: `Señales: Dolor intenso, deformidad, inflamación, crepitación, incapacidad de mover.\nTipos: Cerrada (piel intacta), Abierta (hueso expuesto — riesgo de infección).\n\nREGLA: En caso de duda, tratar como fractura.`,
      },
      {
        title: "Inmovilización improvisada",
        content: `Materiales: Ramas, revistas, cartón, mochilas rígidas, tela, cinturones.\n\n1. NO intentar realinear el hueso\n2. Inmovilizar la articulación ARRIBA y ABAJO de la fractura\n3. Acolchar entre férula y piel\n4. Verificar circulación distal (pulso, color, sensibilidad)\n5. Revisar cada 15 min que no esté muy apretado`,
      },
    ],
  },
  {
    id: "fa-4",
    title: "Quemaduras y Tratamiento",
    category: "Primeros Auxilios",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Clasificación de quemaduras",
        content: `Grado 1: Enrojecimiento, dolor (quemadura solar). Tratar con agua fría 10-20 min.\nGrado 2: Ampollas, dolor intenso. NO reventar ampollas. Cubrir con gasa estéril húmeda.\nGrado 3: Piel blanca/carbonizada, sin dolor (nervios destruidos). Emergencia médica. Cubrir con tela limpia y húmeda.`,
      },
      {
        title: "Tratamiento de campo",
        content: `1. Retirar de la fuente de calor\n2. Enfriar con agua corriente limpia (NO hielo) 10-20 minutos\n3. Retirar anillos, relojes, ropa suelta antes de que inflame\n4. Cubrir con gasa estéril o tela limpia sin pelusa\n5. NO aplicar: mantequilla, pasta dental, aceite\n6. Hidratar al paciente (beber agua a sorbos)`,
      },
    ],
  },

  // === SUPERVIVENCIA BÁSICA ===
  {
    id: "sv-1",
    title: "Regla de los 3 — Prioridades de Supervivencia",
    category: "Supervivencia",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "La regla de los 3",
        content: `3 MINUTOS sin aire\n3 HORAS sin refugio (en condiciones extremas)\n3 DÍAS sin agua\n3 SEMANAS sin comida\n\nEsta regla define tus prioridades de supervivencia. Siempre en este orden:\n1. Respiración y seguridad inmediata\n2. Refugio y protección del clima\n3. Agua potable\n4. Alimento`,
      },
      {
        title: "Mentalidad de supervivencia",
        content: `S — Size up the situation (Evaluar la situación)\nU — Undue haste makes waste (No actuar precipitadamente)\nR — Remember where you are (Orientación)\nV — Vanquish fear and panic (Controlar el miedo)\nI — Improvise and improve (Improvisar)\nV — Value living (Voluntad de vivir)\nA — Act like the natives (Observar el entorno)\nL — Learn basic skills (Practicar antes de necesitarlo)`,
      },
    ],
  },
  {
    id: "sv-2",
    title: "Purificación de Agua",
    category: "Supervivencia",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Métodos de purificación",
        content: `1. HERVIR: Mínimo 1 minuto a ebullición (3 min en altitud >2000m). Método más confiable.\n2. PASTILLAS: Cloro o yodo. Seguir instrucciones del fabricante. Esperar 30 min.\n3. FILTRO: Filtros cerámicos o de carbón. Elimina bacterias y protozoos. NO todos eliminan virus.\n4. UV: Exponer en botella PET transparente al sol 6+ horas (método SODIS).\n5. CLORO CASERO: 2 gotas de lejía (5%) por litro. Esperar 30 min. Debe oler levemente a cloro.`,
      },
      {
        title: "Fuentes de agua en emergencia",
        content: `PREFERIR: Agua de lluvia, manantiales, agua corriente de ríos.\nEVITAR: Agua estancada, charcos cerca de industria, agua de mar sin destilar.\n\nRecolección de rocío: Pasar tela absorbente por hierba al amanecer, exprimir en recipiente.\nCondensación solar: Cavar hoyo, colocar recipiente al centro, cubrir con plástico, piedra en el centro. El agua se condensa y gotea al recipiente.`,
      },
    ],
  },
  {
    id: "sv-3",
    title: "Fuego — Técnicas de Encendido",
    category: "Supervivencia",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Preparación del fuego",
        content: `Necesitas 3 componentes:\n1. YESCA: Material que enciende fácilmente (pelusa, corteza de abedul, algodón con vaselina, viruta fina)\n2. LEÑA FINA: Ramitas del grosor de un lápiz, secas\n3. COMBUSTIBLE: Ramas más gruesas, troncos\n\nEstructuras:\n- Tipi: Yesca al centro, leña fina en cono alrededor\n- Cabaña de troncos: Capas alternas formando cuadrado\n- Estrella: Troncos en estrella, empujar al centro según se consumen`,
      },
      {
        title: "Métodos de encendido sin fósforos",
        content: `1. Pedernal y acero: Raspar con cuchillo para crear chispas sobre yesca\n2. Lente: Concentrar luz solar con lupa, fondo de lata pulido o bolsa con agua\n3. Batería: Conectar cables al + y — tocando yesca con el contacto\n4. Arco de fricción: Método difícil, requiere práctica. Madera seca blanda + husillo + arco\n5. Kit de emergencia: Siempre llevar encendedor BIC como respaldo`,
      },
    ],
  },
  {
    id: "sv-4",
    title: "Navegación sin Tecnología",
    category: "Supervivencia",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Orientación por el sol",
        content: `Hemisferio Norte:\n- El sol sale por el ESTE y se pone por el OESTE\n- Al mediodía, la sombra más corta apunta al NORTE\n\nMétodo del reloj: Apuntar la manecilla de hora hacia el sol. El punto medio entre la manecilla y las 12 indica el SUR.\n\nMétodo de la sombra: Clavar palo vertical. Marcar punta de sombra. Esperar 15 min. Marcar nueva posición. La línea entre ambas marcas va Este-Oeste.`,
      },
      {
        title: "Orientación nocturna",
        content: `Estrella Polar (hemisferio norte):\n1. Buscar la Osa Mayor (forma de cazo)\n2. Las dos estrellas del borde del cazo apuntan a la Estrella Polar\n3. La Estrella Polar está sobre el Norte\n\nCruz del Sur (hemisferio sur):\n1. Prolongar el eje largo de la cruz 4.5 veces\n2. Bajar vertical al horizonte: ese punto es el SUR`,
      },
    ],
  },

  // === COMUNICACIONES DE EMERGENCIA ===
  {
    id: "co-1",
    title: "Frecuencias de Radio de Emergencia",
    category: "Comunicaciones",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Frecuencias esenciales",
        content: `EMERGENCIAS INTERNACIONALES:\n- 156.800 MHz (Canal 16 VHF Marítimo) — Emergencia marítima\n- 121.500 MHz — Emergencia aérea\n- 243.000 MHz — Emergencia militar\n\nBANDAS CIVILES:\n- FRS/GMRS: Canales 1-22 (462/467 MHz) — Radios portátiles comunes\n- CB Canal 9: 27.065 MHz — Emergencia en Banda Ciudadana\n- CB Canal 19: 27.185 MHz — Carretera/camioneros\n\nNOAA Weather Radio: 162.400 – 162.550 MHz (7 frecuencias)`,
      },
      {
        title: "Protocolo MAYDAY",
        content: `Para emergencias con riesgo de vida:\n\n"MAYDAY, MAYDAY, MAYDAY\nAquí [tu identificación], [tu identificación], [tu identificación]\nMAYDAY [tu identificación]\nMi posición es [coordenadas o ubicación]\nNaturaleza de la emergencia: [descripción]\nTipo de ayuda requerida: [especificar]\nNúmero de personas: [cantidad]\nSobre [cambio]"\n\nRepetir cada 2 minutos hasta recibir respuesta.`,
      },
    ],
  },
  {
    id: "co-2",
    title: "Código Morse — Guía Rápida",
    category: "Comunicaciones",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Señales esenciales",
        content: `SOS: ••• ——— ••• (señal universal de socorro)\nS: •••    O: ———\n\nAlfabeto básico:\nA: •—     N: —•\nB: —•••   O: ———\nC: —•—•   P: •——•\nD: —••    Q: ——•—\nE: •      R: •—•\nF: ••—•   S: •••\nH: ••••   T: —\nI: ••     U: ••—\nL: •—••   W: •——\nM: ——     Y: —•——`,
      },
      {
        title: "Medios de transmisión",
        content: `Sin radio puedes usar Morse con:\n- LINTERNA: Destello corto = punto, destello largo = raya\n- SILBATO: Pitido corto/largo\n- ESPEJO: Reflejos del sol (señalización heliográfica)\n- GOLPES: Contra superficie dura\n- FUEGO: Tapar/destapar hoguera\n\nTimings:\n- Punto = 1 unidad\n- Raya = 3 unidades\n- Espacio entre símbolos = 1 unidad\n- Espacio entre letras = 3 unidades\n- Espacio entre palabras = 7 unidades`,
      },
    ],
  },
  {
    id: "co-3",
    title: "Señalización Visual de Emergencia",
    category: "Comunicaciones",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Señales tierra-aire",
        content: `Símbolos internacionales (hacer con piedras, troncos, tela, 3m mínimo):\n\nV — Requiero asistencia\nX — Requiero asistencia médica\nI — Necesito medicinas\nF — Necesito comida y agua\n→ — Viajo en esta dirección\nLL — Todo bien\nN — No (negativo)\nY — Sí (afirmativo)\n\nTriángulo de fuegos: 3 hogueras en triángulo = señal de socorro universal`,
      },
      {
        title: "Espejo de señales",
        content: `El destello de un espejo puede verse a 50+ km en día claro.\n\n1. Sostener espejo cerca del ojo\n2. Extender otra mano con dedos en V hacia el objetivo\n3. Mover espejo hasta que el destello aparezca entre los dedos\n4. Hacer destellos rápidos (3 destellos = SOS)\n\nSin espejo: CD, papel aluminio, pantalla de celular, cualquier superficie reflectante.`,
      },
    ],
  },

  // === CONSTRUCCIÓN DE REFUGIOS ===
  {
    id: "sh-1",
    title: "Refugio A-Frame (Dos Aguas)",
    category: "Refugio",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Construcción paso a paso",
        content: `Tiempo estimado: 1-2 horas | Capacidad: 1-2 personas\n\n1. Buscar dos árboles separados 2.5m o clavar estacas en Y\n2. Colocar viga horizontal (ridgepole) entre los soportes a 1m de altura\n3. Apoyar ramas largas en ángulo de 45° a ambos lados\n4. Espaciar ramas cada 20-30 cm\n5. Cubrir con capas de hojas, ramas de pino, corteza (de abajo hacia arriba como tejas)\n6. Capa final: más ramas encima para evitar que el viento levante la cubierta\n\nIMPORTANTE: La entrada debe estar opuesta al viento dominante.`,
      },
      {
        title: "Aislamiento del suelo",
        content: `El suelo roba más calor que el aire. SIEMPRE aislar:\n- Capa de ramas de pino (15+ cm de grosor)\n- Hojas secas compactadas\n- Corteza de árbol\n- Mochila, lona, bolsa de basura\n\nRegla: Si puedes sentir el frío del suelo, necesitas más aislamiento.`,
      },
    ],
  },
  {
    id: "sh-2",
    title: "Refugio con Lona / Tarp",
    category: "Refugio",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Configuraciones de tarp",
        content: `A-Frame con tarp:\n- Cuerda tensa entre dos árboles\n- Drape la lona sobre la cuerda\n- Tensar esquinas con estacas o piedras\n\nLean-To (cobertizo):\n- Cuerda alta entre árboles\n- Lona inclinada a un lado\n- Ideal para reflejar calor de fogata\n\nDiamond (Diamante):\n- Esquina superior atada a un árbol\n- Esquina inferior estacada al suelo\n- Lados tensados. Compacto y rápido.`,
      },
      {
        title: "Nudos esenciales",
        content: `1. As de guía (Bowline): Lazo que no se aprieta. Para anclar cuerda a árbol.\n2. Ballestrinque (Clove hitch): Rápido de hacer, ajustable. Para postes.\n3. Tensor (Taut-line): Se desliza para tensar pero no afloja bajo carga.\n4. Prusik: Nudo deslizante sobre cuerda más gruesa. Para ajustar altura.\n\nRegla: Aprende estos 4 nudos y podrás construir cualquier refugio con cuerda.`,
      },
    ],
  },
  {
    id: "sh-3",
    title: "Refugio de Escombros (Debris Hut)",
    category: "Refugio",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Construcción",
        content: `El mejor refugio para aislamiento térmico en climas fríos:\n\n1. Viga principal: Rama de 3m apoyada sobre tronco o roca (60cm de alto en un extremo)\n2. Costillas: Ramas apoyadas a ambos lados cada 15cm\n3. Enrejado: Ramas pequeñas cruzadas sobre las costillas\n4. Relleno: MUCHO material de hojas, hierba, agujas de pino (60+ cm de grosor)\n5. Capa final: Ramas encima para evitar que el viento disperse el relleno\n\nEl espacio interior debe ser JUSTO para tu cuerpo — más pequeño = más cálido.`,
      },
      {
        title: "Consideraciones de ubicación",
        content: `BUSCAR:\n✓ Terreno elevado (evitar acumulación de agua fría)\n✓ Cerca de materiales de construcción\n✓ Protección natural del viento (rocas, arboles densos)\n✓ Cerca de fuente de agua (pero no en zona inundable)\n\nEVITAR:\n✗ Cauces secos (flash floods)\n✗ Bajo árboles muertos (riesgo de caída)\n✗ Cimas expuestas al viento\n✗ Zonas bajas donde se acumula aire frío\n✗ Cerca de panales, hormigueros, madrigueras`,
      },
    ],
  },
  {
    id: "sh-4",
    title: "Refugio Urbano Post-Desastre",
    category: "Refugio",
    type: "guide",
    progress: 100,
    sections: [
      {
        title: "Evaluación de estructuras",
        content: `Antes de entrar a un edificio dañado:\n\n1. Observar desde fuera: ¿Hay inclinación? ¿Grietas en muros de carga?\n2. ¿Hay olor a gas? NO entrar.\n3. Verificar que puertas y ventanas no estén atascadas (podría colapsar)\n4. Revisar el techo — grietas grandes = riesgo de colapso\n5. Evitar pisos superiores en estructuras dañadas\n6. Preferir esquinas de muros de carga (más resistentes)\n\nEdificios de concreto reforzado > mampostería > madera (en sismos)`,
      },
      {
        title: "Acondicionamiento rápido",
        content: `Con materiales urbanos disponibles:\n- VENTANAS: Sellar con plástico, cartón, cortinas para aislar\n- PUERTAS: Bloquear entradas no usadas para retener calor\n- SUELO: Alfombras, cartón, periódicos como aislamiento\n- CALOR: Velas en latas (calentador improvisado), calor corporal grupal\n- AGUA: Calentadores, tuberías, tanques de WC (sin químicos) como fuente\n- SEÑALIZACIÓN: Marcar edificio como ocupado con tela visible desde fuera`,
      },
    ],
  },
];
