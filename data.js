/* ==========================================================================
   Contenido editable de la landing.
   Fuente: ..\..\proyectos\00_quienes_somos.md (definición del 11-oct-2026)
   y las fichas de ..\..\proyectos\.
   Respeta las cautelas de cada ficha: casos sin nombre, estados reales,
   sin cifras de impacto no medidas y demos con datos ficticios.
   ========================================================================== */

// Cambiar acá cuando la marca esté definida (se reemplaza en nav y footer).
const BRAND = "Peirone & Bonafé";

// Casilla que abre el formulario de contacto. Reemplazar cuando exista la nueva.
const CONTACT_EMAIL = "labotech.analytics@gmail.com";

// Estado real de cada caso. Es una referencia interna: la página no lo muestra.
const ESTADOS = {
  prod:  "En producción",
  pilot: "Listo para piloto",
  proto: "Prototipo funcional",
  prop:  "Propuesta en curso",
  exp:   "Experiencia del equipo",
};

// Datos verificables de los casos, para la franja bajo el inicio.
// Solo cantidades que constan en las fichas; nada de impacto no medido.
const PRUEBAS = [
  [2200, "+", "gestiones migradas y activas en una plataforma de gobierno en uso diario"],
  [300, "+", "pruebas de integración en el sistema de gestión de un exportador"],
  [25, "+", "decisiones de arquitectura documentadas en un solo proyecto"],
  [7, "", "demos interactivas para probar en esta página"],
];

// Nombre con el que la página se refiere a conectar, medir y gestionar.
const EJES = "los tres ejes";

/* --------------------------------------------------------------------------
   Los tres ejes. `id` se usa para etiquetar cada caso. Cada uno se cuenta
   en tres pasos: el problema, lo que hacemos y lo que cambia.
   -------------------------------------------------------------------------- */
const SERVICIOS = [
  {
    id: "integracion", verbo: "conectar",
    t: "Integración, Automatización e IA",
    frase: "De sistemas sueltos y planillas a una empresa que se gestiona con números.",
    problema: "Hoy tus sistemas viven aislados: el ERP, el banco, la planta y el área comercial guardan cada uno su parte y no dialogan entre sí. Para obtener un dato útil hay que consultar varias planillas, exportar, copiar y pegar. Cuando el número llega, ya es viejo o no coincide con el de otra área.",
    solucion: "Reunimos todas tus fuentes en una base de datos propia, que se actualiza sola. Sobre esa base armamos los tableros, automatizamos las tareas repetitivas y sumamos agentes de IA que leen documentos y responden consultas.",
    mejora: "Un mismo número para toda la empresa, disponible en el momento en que lo necesitás, y horas de trabajo manual que vuelven al equipo.",
    items: [
      ["Integración de fuentes", "ERP, sistema contable, bancos, planta, área comercial, CRM y planillas, en una capa de datos propia."],
      ["Inteligencia de negocios", "Tableros y herramientas de análisis sobre los sistemas que ya usás."],
      ["Automatización de procesos", "Lo que hoy es exportar, pegar y transcribir pasa a ser automático."],
      ["Agentes de IA", "Lectura de documentos, consulta de datos en lenguaje natural y clasificación, con controles."],
    ],
  },
  {
    id: "finanzas", verbo: "medir",
    t: "Consultoría de Costos y Finanzas",
    frase: "Decidí con tus números reales, no con la planilla del mes pasado.",
    problema: "Sabés cuánto vendés, pero no siempre cuánto ganás con cada producto ni cuánta caja vas a tener en dos meses. El costeo se revisa de vez en cuando o vive en una planilla que solo entiende quien la armó, y los precios y la producción se deciden con números desactualizados.",
    solucion: "Armamos tu esquema de costeo, tu estado de resultados de gestión y tu flujo de fondos proyectado con criterio contable. Después los dejamos conectados a tus sistemas, para que se actualicen solos.",
    mejora: "Sabés cuánto deja cada producto, cuánto necesitás vender para cubrir tus costos y cuándo puede faltar caja, con tiempo para decidir.",
    items: [
      ["Esquemas de costeo", "Por producto, por línea y por centro de costos."],
      ["Modelo económico", "Estado de resultados de gestión, margen de contribución y punto de equilibrio."],
      ["Modelo financiero", "Flujo de fondos proyectado, capital de trabajo y escenarios."],
      ["Seguimiento", "Se actualiza solo, en lugar de vivir en una planilla que depende de una persona."],
    ],
  },
  {
    id: "software", verbo: "gestionar",
    t: "Software de Gestión a Medida",
    frase: "Sistemas adaptados a las necesidades de tu empresa.",
    problema: "Los sistemas estándar resuelven lo general. Lo que distingue a tu empresa queda afuera: esa parte de la operación termina en planillas, en correos y en la memoria de quien la lleva. Y cuando el sistema no se adapta, es tu equipo el que tiene que cambiar su forma de trabajar.",
    solucion: "Relevamos tu proceso real y construimos un sistema hecho para tu forma de trabajar, que convive con lo que ya usás. Es a medida porque parte de cómo opera tu empresa, y no de un producto armado para otras. Se entrega por módulos, cada uno validado con quien lo va a usar.",
    mejora: "Tu operación sale de las planillas: cada pedido, lote o contrato queda registrado con su historial, y los informes y tableros salen del mismo sistema.",
    items: [
      ["Gestión", "Planta y proceso productivo, stock, pedidos, contratos, clientes, embarques y ventas."],
      ["Reportería", "Generación de informes y documentos."],
      ["Análisis", "Tableros financieros, comerciales y de marketing dentro del mismo sistema."],
      ["Optimización", "Modelos matemáticos que proponen la mejor asignación donde hoy hay una decisión manual repetida."],
    ],
  },
];

/* --------------------------------------------------------------------------
   Sectores: cómo suele estar cada uno y qué hacemos ahí en cada eje.
   `casos` es el id de la pestaña de VERTICALES; `grafico` elige el elemento
   gráfico ("bars" o "map") y `graficoNota` su leyenda.
   -------------------------------------------------------------------------- */
const SECTORES = [
  {
    id: "industria", nombre: "Industria", casos: "industria", grafico: "bars",
    graficoEje: ["S1", "alerta en S9", "S13"],
    graficoNota: "flujo de fondos proyectado · datos de ejemplo",
    frase: "Tus costos, tu caja y tu operación, en un solo lugar y al día.",
    d: "Empresas productivas y exportadoras: fábricas, agroindustria y alimentos. Tienen un ERP que registra bien la operación, pero las respuestas de gestión se siguen armando a mano.",
    rasgos: [
      ["El ERP registra, pero no explica", "Saber cuánto deja cada producto o cuánto hay que vender para cubrir los costos exige exportar y armar planillas."],
      ["Costos y caja dependen de una persona", "El modelo vive en un archivo que solo entiende quien lo hizo."],
      ["Planta, laboratorio, ventas y administración no se hablan", "Cada área tiene su sistema o su planilla, y los datos se pasan a mano."],
      ["Decisiones repetidas que se toman a ojo", "Qué lote va a qué contrato, qué producir primero, cuánto comprar."],
    ],
    servicios: [
      ["integracion", "Unimos el ERP con planta, laboratorio y bancos. Los informes y comprobantes que llegan por correo se leen y se cargan solos, y los tableros se arman sobre lo que ya tenés."],
      ["finanzas", "Costeo por producto y por línea, margen de contribución y punto de equilibrio sobre tus datos reales, y flujo de fondos a 13 semanas con alertas, para ver la caja antes de que falte."],
      ["software", "Sistemas para planta, stock, contratos y embarques, con trazabilidad de punta a punta y modelos que proponen la mejor asignación de producto."],
    ],
  },
  {
    id: "gobierno", nombre: "Gobierno", casos: "gobierno", grafico: "map",
    graficoEje: ["menos gestiones", "más gestiones"],
    graficoNota: "gestiones por zona del territorio · datos de ejemplo",
    frase: "La gestión a la vista, sin pedir informes.",
    d: "Ministerios, secretarías y municipios. Hacen mucho y lo registran en muchos lugares distintos, por eso cuesta ver la gestión completa y responderle al ciudadano.",
    rasgos: [
      ["Cada área en su planilla, su sistema o en papel", "No hay un lugar donde ver todo junto."],
      ["La conducción pide informes para ver su propia gestión", "Cada dato consolidado es un pedido y varios días de espera."],
      ["La información se va con las personas", "En cada cambio de equipo o de gestión se pierde historial."],
      ["El vecino reclama por varios canales", "Teléfono, WhatsApp, redes y mesa de entradas, sin saber en qué quedó."],
    ],
    servicios: [
      ["integracion", "Sincronizamos las planillas que un área todavía no puede dejar, armamos tableros territoriales y sumamos agentes que responden consultas en lenguaje natural sobre los datos del organismo."],
      ["finanzas", "Costo por programa y por área, y seguimiento de lo ejecutado contra lo previsto, con el mismo método que aplicamos en empresas."],
      ["software", "Plataforma institucional por áreas, con roles, historial y auditoría de cada cambio. Reclamos y atención al vecino con número de seguimiento. Se implementa por partes, con herramientas abiertas."],
    ],
  },
];

const PASOS = [
  ["Relevamiento", "Analizamos el proceso real, los sistemas y las planillas, hasta el nivel de las fórmulas."],
  ["Especificación", "Documentamos qué va a hacer cada módulo y lo validamos con quienes lo van a usar."],
  ["Desarrollo por fases", "Construimos en etapas cortas, con pruebas automatizadas y avances que podés ver en todo momento."],
  ["Puesta en marcha", "Desplegamos, migramos los datos y capacitamos a los equipos."],
  ["Acompañamiento", "Medimos el uso, corregimos y sumamos lo que sigue sobre una base ordenada."],
];

const DIFERENCIALES = [
  ["Entendemos el número antes de programar", "En el equipo conviven la consultoría de costos y finanzas con el desarrollo de datos e IA. Por eso el sistema calcula lo que tu negocio necesita saber."],
  ["No solo recomendamos: lo dejamos funcionando", "El modelo de costos no termina en un informe. Termina conectado a tus sistemas y actualizándose solo."],
  ["Convivimos con lo que ya existe", "Sistemas viejos, planillas que un área no quiere dejar, desarrollos internos: los integramos en lugar de exigirte reemplazarlos."],
  ["IA con criterio, no como promesa", "La usamos donde resuelve algo concreto y con controles: el sistema propone y la persona decide."],
  ["Fases cortas con alcance cerrado", "Cada etapa tiene un entregable usable y un alcance definido de antemano. Sabés qué recibís y cuándo."],
  ["Lo que dejamos se puede mantener", "Decisiones documentadas, pruebas automatizadas y tecnología extendida. Tus datos y el conocimiento del sistema quedan de tu lado."],
];

/* --------------------------------------------------------------------------
   Casos por vertical. `demo` referencia una función de demos.js,
   `servicios` los ids de SERVICIOS que intervienen y `arq` las capas de
   la arquitectura (`arqTitulo` cambia el rótulo cuando todavía es un diseño).
   -------------------------------------------------------------------------- */
const VERTICALES = [
  {
    id: "industria",
    nombre: "Industria",
    bajada: "Producción y exportación",
    intro: "Para empresas productivas cuyo ERP registra bien la operación pero no responde las preguntas de gestión, y para exportadores que comprometen producto por calidad y contrato.",
    grupos: [
      {
        nombre: "Fabricante de maquinaria",
        nota: "Costos y finanzas sobre el ERP",
        proyectos: [
          {
            id: "costeo",
            titulo: "Costos, resultados y caja conectados al ERP",
            cliente: "Fabricante de maquinaria para la industria alimenticia",
            servicios: ["finanzas", "integracion"],
            estado: "prop",
            lead: "El modelo de costos y la proyección de caja, que hoy viven en planillas y dependen de una persona, pasan a un sistema conectado al ERP que se actualiza solo y avisa antes de que el problema llegue a la caja.",
            problema: [
              "Resultado económico y flujo de fondos en la notebook de una persona",
              "Exportar y pegar reportes del ERP varias veces por semana",
              "Criterios de costeo copiados a mano en fórmulas",
              "Un cambio de nombre de cuenta rompe el reporte sin aviso",
            ],
            solucion: [
              "Vista de rentabilidad: margen, punto de equilibrio, apalancamiento",
              "Vista de finanzas: caja a 13 semanas y alertas",
              "Reglas de clasificación como dato, con historial de vigencia",
              "Extracción incremental del ERP, reutilizable por módulos futuros",
            ],
            mas: "El diagnóstico llegó al nivel de fórmulas y código y detectó inconsistencias que el proceso arrastraba. El plan está dividido en fases: validación técnica, extracción, finanzas, rentabilidad y cierre. Todavía no hay resultados medidos.",
            arqTitulo: "arquitectura propuesta",
            arq: [
              ["Origen", "El ERP (Odoo). Los tableros nunca consultan en vivo la base de producción."],
              ["Extracción", "Réplica incremental, por fecha de modificación, hacia una base analítica (BigQuery)."],
              ["Modelo de datos", "Hechos y dimensiones, con las reglas de clasificación guardadas como dato y con vigencia."],
              ["Servicio", "Un servicio de negocio (FastAPI) con costeo y tesorería sobre la misma base."],
              ["Interfaz", "Panel web (React), reportes y alertas. Cada número se puede conciliar contra el asiento de origen."],
            ],
            stack: ["Odoo", "FastAPI", "BigQuery", "React", "Cloud Run"],
            demo: "costeo",
            demoQue: "Mové precio, volumen y costos y mirá cómo cambian el margen, el punto de equilibrio y la caja a 13 semanas.",
            demoTitulo: "Rentabilidad y caja a 13 semanas",
          },
        ],
      },
      {
        nombre: "Exportador agroindustrial",
        nota: "Sistema de gestión, optimización y lectura de documentos",
        proyectos: [
          {
            id: "cruce",
            titulo: "Sistema integral de gestión para un exportador",
            cliente: "Exportador agroindustrial · experiencia profesional del equipo",
            servicios: ["software", "integracion"],
            estado: "exp",
            lead: "Una capa de gestión sobre un sistema anterior que no se podía tocar, con un motor de optimización que asigna lotes a contratos y un agente que lee los informes de laboratorio que llegan en PDF.",
            problema: [
              "Lotes de calidad superior asignados a contratos que no la pagan",
              "Sin producto disponible para el destino de mayor precio",
              "25 formatos de informe de laboratorio transcriptos a mano",
              "Gestión en planillas sobre un sistema anterior frágil",
            ],
            solucion: [
              "Motor de optimización: el sistema propone, la persona decide",
              "Lectura automática de informes con IA y semáforo por destino",
              "Trazabilidad del tambor al embarque",
              "Lectura del sistema anterior, sin reemplazarlo ni ponerlo en riesgo",
            ],
            mas: "Diez módulos con especificación previa y validación módulo a módulo, y más de 300 pruebas de integración. El patrón se replica a granos, aceites, frutas, carnes o vinos a granel.",
            arq: [
              ["Sistema anterior", "Se lee sin modificarlo: la capa nueva trabaja al lado, sin ponerlo en riesgo."],
              ["Servicio", "API asíncrona (FastAPI) con tareas en segundo plano, sobre SQL Server."],
              ["Optimización", "Modelo de programación matemática (PuLP) que propone qué lote va a qué contrato."],
              ["Lectura de documentos", "Flujo automatizado (n8n) que pasa cada informe en PDF por un modelo de lenguaje y carga el resultado."],
              ["Interfaz y calidad", "Aplicación web (React, TypeScript), pruebas de integración y despliegue en contenedores."],
            ],
            stack: ["FastAPI", "PuLP", "SQL Server", "React", "n8n", "LLM", "Docker"],
            demo: "cruce",
            demoQue: "Asigná lotes a contratos con el optimizador y mirá cómo se lee un informe de laboratorio.",
            demoTitulo: "Cruce de calidades y lectura de informes",
          },
        ],
      },
    ],
  },
  {
    id: "gobierno",
    nombre: "Gobierno",
    bajada: "Ministerios y municipios",
    intro: "Herramientas con las que un organismo registra su trabajo, lo ve consolidado y lo consulta en lenguaje natural, sin obligar a las áreas a cambiar todo de un día para otro.",
    grupos: [
      {
        nombre: "Ministerios y secretarías",
        nota: "Plataforma de gestión institucional",
        proyectos: [
          {
            id: "plataforma",
            titulo: "Plataforma de gestión institucional",
            cliente: "Gobierno provincial · en uso diario por las áreas",
            servicios: ["software"],
            estado: "prod",
            lead: "Un portal único donde cada área tiene su módulo y su base, con usuarios, roles y auditoría compartidos, y un resumen territorial para las autoridades: qué programas tiene cada localidad y en qué estado.",
            problema: [
              "Cada área en su planilla, sistema aislado o papel",
              "La conducción pedía informes para ver su propia gestión",
              "Sin historial: imposible saber quién cambió qué",
              "La información se iba con las personas",
            ],
            solucion: [
              "Un servicio y una base por área: crecen sin interrumpirse",
              "Expedientes con estados, paneles territoriales y tablero propio",
              "Planillas que un área no deja, sincronizadas cada hora",
              "Migración de un sistema previo sin corte de servicio",
            ],
            mas: "Más de 2.200 gestiones migradas y activas, paneles territoriales para decenas de municipios y más de 25 decisiones de arquitectura documentadas. Se replica en otro organismo: plataforma base una vez y módulos por nivel de complejidad.",
            arq: [
              ["Portal", "Una sola aplicación web (React) para todas las áreas."],
              ["Entrada", "API Gateway: verifica la identidad y deriva cada pedido a su servicio."],
              ["Servicios", "Un servicio por área (FastAPI en Cloud Run): un cambio en un módulo no afecta a los demás."],
              ["Datos", "Una base PostgreSQL por servicio. Los servicios se consultan por interfaces internas, nunca cruzando bases."],
              ["Permisos", "Roles definidos en la base de datos: un cambio de rol o una baja tiene efecto inmediato."],
            ],
            stack: ["FastAPI", "PostgreSQL", "React", "Cloud Run", "API Gateway"],
            demo: "plataforma",
            demoQue: "Cambiá de rol y mirá qué ve cada uno del resumen territorial.",
            demoTitulo: "Resumen territorial por rol",
          },
          {
            id: "agenteGestiones",
            titulo: "Agente conversacional de gestiones",
            cliente: "Gobierno provincial · consulta por Telegram o API",
            servicios: ["integracion"],
            estado: "proto",
            lead: "El funcionario pregunta desde el teléfono y recibe datos reales de la base. El modelo interpreta la intención; el sistema ejecuta solo consultas permitidas y pregunta cuando hay ambigüedad.",
            problema: [
              "El dato existe, pero hay que abrir un tablero o pedir un informe",
              "Riesgo de que un modelo invente números o ejecute consultas indebidas",
            ],
            solucion: [
              "Resolución de entidades contra catálogos reales",
              "Consultas predefinidas o validadas, solo de lectura",
              "Aclaración con botones ante la duda; memoria de conversación",
              "Proveedor de modelo intercambiable por configuración",
            ],
            mas: "Registro completo de cada interacción y conjunto de evaluación de punta a punta. El mismo patrón sirve para ventas, stock o costos.",
            arq: [
              ["Canal", "Telegram o API, sobre un servicio FastAPI."],
              ["Interpretación", "El modelo de lenguaje identifica la intención y las entidades, que se validan contra catálogos reales."],
              ["Consulta", "El sistema ejecuta consultas predefinidas o validadas, solo de lectura, sobre una vista analítica (BigQuery)."],
              ["Memoria y evaluación", "Memoria de conversación, registro de cada interacción y pruebas de punta a punta."],
            ],
            stack: ["FastAPI", "LLM", "BigQuery", "Telegram", "Docker"],
            demo: "agenteGestiones",
            demoQue: "Preguntale en lenguaje natural y mirá qué entendió y qué consulta ejecutó.",
            demoTitulo: "Preguntale a la base de gestiones",
          },
        ],
      },
      {
        nombre: "Municipios",
        nota: "Atención al vecino en tres escalones",
        escalones: ["1 · Reportes Vecinales", "2 · Sistema Integral de Reclamos", "3 · Agente de Reclamos"],
        proyectos: [
          {
            id: "reportes",
            titulo: "Reportes Vecinales",
            cliente: "Escalón 1 · canal abierto · se implementa en días",
            servicios: ["software"],
            estado: "pilot",
            lead: "El vecino marca un pozo, un basural o una luminaria apagada en un mapa público desde el celular, en menos de un minuto y sin registrarse. Lo reportado queda a la vista de todos.",
            problema: [
              "Reclamos dispersos y sin visibilidad",
              "El vecino no sabe si alguien ya lo reportó",
            ],
            solucion: [
              "Mapa público con filtros por categoría",
              "Geolocalización de la dirección y ajuste del pin",
              "Panel simple para cambiar estados",
            ],
            mas: "Mapas abiertos, sin claves ni costo por uso. Requiere definir con el municipio la política de moderación antes de publicar.",
            arq: [
              ["Aplicación", "Next.js con TypeScript: el mapa público y el panel de administración en una sola aplicación."],
              ["Mapa", "Leaflet sobre OpenStreetMap, con geocodificación abierta: sin claves ni costo por uso."],
              ["Datos", "PostgreSQL, con migraciones automáticas al iniciar."],
              ["Despliegue", "Contenedores (Docker Compose): se levanta en un paso, en un servicio de bajo costo o en un servidor propio."],
            ],
            stack: ["Next.js", "Leaflet", "OpenStreetMap", "PostgreSQL"],
            demo: "reportes",
            demoQue: "Marcá un problema en el mapa, filtrá por categoría y cambiá estados como administrador.",
            demoTitulo: "Mapa ciudadano",
          },
          {
            id: "reclamos",
            titulo: "Sistema Integral de Reclamos",
            cliente: "Escalón 2 · del vecino a la cuadrilla",
            servicios: ["software"],
            estado: "pilot",
            lead: "El ciclo completo: ingreso, clasificación automática, asignación a cuadrillas, resolución en campo, aviso al vecino y métricas. Tres portales (vecino, supervisor y técnico) y auditoría inmutable.",
            problema: [
              "Reclamos por teléfono, WhatsApp, redes y papel",
              "Asignación a ojo y vecinos que vuelven a llamar",
              "Sin datos de zonas críticas ni de cumplimiento",
            ],
            solucion: [
              "Expediente con número y QR de seguimiento",
              "Clasificación automática y detección de duplicados",
              "Control de plazos por tipo y semáforo",
              "Estándar abierto Open311 y opción de servidores propios",
            ],
            mas: "Parametrizado por municipio para replicarlo. Nivel avanzado propuesto: rutas para cuadrillas, alertas de anomalías por zona, ingreso por WhatsApp y resumen ejecutivo diario.",
            arq: [
              ["Portales", "Tres aplicaciones web (React): vecino, supervisor y técnico."],
              ["Servicio", "API FastAPI con tareas programadas (Celery) para plazos y avisos."],
              ["Datos", "PostgreSQL con PostGIS para las consultas geográficas; fotos en almacenamiento compatible con S3."],
              ["Interoperabilidad", "API Open311 GeoReport v2, el estándar internacional de reclamos urbanos."],
              ["Despliegue", "Contenedores (Docker Compose); puede correr en servidores del propio municipio."],
            ],
            stack: ["FastAPI", "PostGIS", "Celery", "React", "Open311"],
            demo: "reclamos",
            demoQue: "Seguí un reclamo de punta a punta: vecino, supervisor y técnico.",
            demoTitulo: "Un reclamo de punta a punta",
          },
          {
            id: "agenteReclamos",
            titulo: "Agente de Reclamos",
            cliente: "Escalón 3 · consulta en lenguaje natural",
            servicios: ["integracion"],
            estado: "proto",
            lead: "El funcionario pregunta y el agente elige cómo buscar: por significado en el texto de los reclamos, estadísticas, fechas o cercanía. Responde en segundos y aprende las preguntas frecuentes.",
            problema: [
              "Miles de textos de vecinos sin explotar",
              "Preguntas simples que requieren pedirle una consulta a sistemas",
            ],
            solucion: [
              "Reescritura del lenguaje coloquial al vocabulario municipal",
              "Búsqueda por significado y consultas de solo lectura validadas",
              "Caché por significado para preguntas parecidas",
            ],
            mas: "Evaluación automática con umbrales mínimos que bloquean cambios que empeoren la calidad. Se adapta a otro municipio sin tocar código.",
            arq: [
              ["Orquestación", "Un grafo de pasos (LangGraph) elige cómo buscar según la pregunta."],
              ["Búsqueda por significado", "Base vectorial (Qdrant) con el texto de los reclamos."],
              ["Datos estructurados", "Consultas de solo lectura validadas, para estadísticas, fechas y cercanía."],
              ["Modelo", "Modelo de lenguaje abierto e intercambiable: cada pieza crítica está detrás de una interfaz."],
              ["Calidad", "Evaluación automática con umbrales mínimos, que bloquea los cambios que empeoren las respuestas."],
            ],
            stack: ["LangGraph", "Qdrant", "FastAPI", "Modelos abiertos"],
            demo: "agenteReclamos",
            demoQue: "Preguntá por los reclamos y mirá cómo elige la forma de buscar.",
            demoTitulo: "Preguntale a los reclamos",
          },
        ],
      },
    ],
  },
];
