/* ==========================================================================
   Contenido editable de la landing.
   Fuente: ..\..\proyectos\00_quienes_somos.md (definición del 11-oct-2026)
   y las fichas de ..\..\proyectos\.
   Respeta las cautelas de cada ficha: casos sin nombre, estados reales,
   sin cifras de impacto no medidas y demos con datos ficticios.
   ========================================================================== */

// Cambiar acá cuando la marca esté definida (se reemplaza en nav y footer).
const BRAND = "KAIROS Analytics";

// Casillas de contacto: el formulario escribe a todas a la vez.
const CONTACT_EMAILS = ["bonafepedro@gmail.com", "cr.apeirone@gmail.com"];

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
  [7, "", "demos interactivas para probar en línea"],
];

// Nombre con el que la página se refiere a conectar, medir y construir.
const EJES = "los tres ejes";

/* --------------------------------------------------------------------------
   Los tres ejes. `id` se usa para etiquetar cada caso. Cada uno se cuenta
   en tres pasos: el problema, lo que hacemos y la solución.
   -------------------------------------------------------------------------- */
const SERVICIOS = [
  {
    id: "integracion", verbo: "conectar",
    t: "Integración, Automatización e IA",
    frase: "De sistemas sueltos y planillas a una empresa que se gestiona con números.",
    problema: "Hoy tus sistemas viven aislados: el ERP, los bancos, la planta y el área comercial guardan cada uno su parte y no dialogan entre sí. Para obtener un dato útil hay que consultar varias planillas, exportar, copiar y pegar. Cuando el número llega, ya es viejo o no coincide con el de otra área.",
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
    t: "Consultoría en Costos, Rentabilidad y Finanzas",
    frase: "Entendé y decidí con tus números reales, no con una planilla desactualizada.",
    problema: "Sabés cuánto vendés, pero no siempre la rentabilidad de tus productos o servicios, si tus precios cubren los costos o cuánta plata vas a tener el mes que viene. Y muchas veces esos números viven en una planilla que solo entiende quien la armó.",
    solucion: "Ordenamos tu estructura de costos, analizamos y medimos cuánto aporta cada unidad de negocio. Armamos tu estado de resultados y tu flujo de fondos (cash flow) proyectado con tableros, y lo volcamos a una herramienta simple, que tu equipo puede usar de forma autónoma y que se actualiza sola con tus datos.",
    mejora: "Sabés qué productos te convienen, cuál es el punto de equilibrio de tu empresa y cuándo puede faltar caja, con tiempo para decidir con previsibilidad.",
    items: [
      ["Esquemas de costeo", "Por producto, por línea y por centro de costos."],
      ["Modelo económico", "Estado de resultados de gestión, margen de contribución y punto de equilibrio."],
      ["Modelo financiero", "Flujo de fondos proyectado, capital de trabajo y escenarios."],
      ["Seguimiento", "Se actualiza solo, en lugar de vivir en una planilla que depende de una persona."],
    ],
  },
  {
    id: "software", verbo: "construir",
    t: "Software de Gestión a Medida",
    frase: "Sistemas adaptados a las necesidades de tu empresa.",
    problema: "Tu PyME creció y los sistemas estándar no resuelven tus problemas. Lo que distingue a tu empresa queda afuera: esa parte de la operación termina en muchas planillas sueltas, en correos y en la memoria de quien la lleva. Cuando el sistema no se adapta, es tu equipo el que tiene que cambiar su forma de trabajar.",
    solucion: "Relevamos tu proceso real y construimos un sistema hecho para tu forma de trabajar, que se adapta y convive con lo que ya usás. Es un software a medida porque parte de cómo opera tu empresa, y no de un producto enlatado. Se entrega por módulos, cada uno validado con tu equipo de trabajo.",
    mejora: "Tu operación ya no depende de las planillas: cada pedido, lote o contrato queda registrado con su historial, y tu stock siempre actualizado. Los informes y tableros que necesitás viven en el mismo sistema.",
    items: [
      ["Gestión", "Planta y proceso productivo, stock, pedidos, contratos, clientes, embarques y ventas."],
      ["Reportería", "Generación de informes y documentos."],
      ["Análisis", "Tableros financieros, comerciales y de marketing dentro del mismo sistema."],
      ["Optimización", "Modelos matemáticos que proponen la mejor asignación donde hoy hay una decisión manual repetida."],
    ],
  },
];

/* --------------------------------------------------------------------------
   Ámbitos: primer nivel de "Sectores y casos". Cada pestaña de VERTICALES
   declara a qué ámbito pertenece.
   -------------------------------------------------------------------------- */
const AMBITOS = [
  { id: "privado", nombre: "Privado", bajada: "Empresas y pymes" },
  { id: "publico", nombre: "Público", bajada: "Gobierno provincial y municipal" },
];

/* --------------------------------------------------------------------------
   Sectores: cómo suele estar cada uno y qué hacemos ahí en cada eje.
   Cada pestaña de VERTICALES lo referencia con `sector` (dos pestañas pueden
   compartir el mismo). `grafico` elige el elemento gráfico ("bars" o "map")
   y `graficoNota` su leyenda.
   -------------------------------------------------------------------------- */
const SECTORES = [
  {
    id: "industria", nombre: "Industrias", grafico: "factories",
    graficoEje: ["línea 1", "margen bajo en la línea 3", "línea 6"],
    graficoNota: "margen de contribución por línea de producto · datos de ejemplo",
    frase: "Tus costos, tu caja y tu operación, en un solo lugar y al día.",
    d: "Empresas productivas y exportadoras: metalúrgicas, fábricas de maquinaria, alimentos, agroindustria y producción apícola. Tienen un ERP que registra bien la operación, pero las respuestas de gestión se siguen armando a mano.",
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
    id: "gobierno", nombre: "Gobierno", grafico: "map",
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
  // Sectores sin caso publicado todavía: se muestra el contexto y los ejes.
  {
    id: "comercio", nombre: "Comercios", grafico: "shop",
    graficoEje: ["con stock", "huecos: faltantes a reponer"],
    graficoNota: "stock por góndola · datos de ejemplo",
    frase: "Qué vendés, qué te deja y qué reponer, sin esperar al cierre.",
    d: "Mayoristas, minoristas, distribuidoras y cadenas con varias sucursales. Venden todos los días, pero el margen real y el estado del stock se conocen tarde.",
    rasgos: [
      ["El sistema de ventas no muestra el margen", "Se sabe cuánto se facturó, no cuánto dejó cada producto o cada sucursal después de descuentos y costos."],
      ["Stock que no coincide con la realidad", "Faltantes de lo que más se vende y mercadería inmovilizada, porque la reposición se decide a ojo."],
      ["Precios que se actualizan a mano", "Cada lista nueva de un proveedor obliga a recalcular precios en una planilla."],
      ["Pagos y cobranzas que no se miran juntos", "La caja se aprieta entre los plazos de proveedores y los de clientes."],
    ],
    servicios: [
      ["integracion", "Unimos el sistema de ventas, el stock, los bancos y las listas de proveedores, y armamos tableros por sucursal, rubro y vendedor."],
      ["finanzas", "Margen por producto y por sucursal, precios que cubren los costos y flujo de fondos que cruza pagos a proveedores con cobranzas."],
      ["software", "Gestión de stock, pedidos y reposición a medida, con alertas de faltantes y listas de precios que se actualizan solas."],
    ],
  },
  {
    id: "logistica", nombre: "Logística", grafico: "routes",
    graficoEje: ["depósito", "entregas del día"],
    graficoNota: "rutas de reparto · datos de ejemplo",
    frase: "Cada viaje, cada entrega y cada costo, a la vista.",
    d: "Transportistas, operadores logísticos y depósitos. Mueven mucho volumen con márgenes finos, y el costo real de cada viaje o de cada cliente no suele estar claro.",
    rasgos: [
      ["No se sabe cuánto cuesta cada viaje", "Combustible, peajes, choferes y mantenimiento se pagan, pero no se asignan a cada viaje ni a cada cliente."],
      ["La operación vive en mensajes y planillas", "Hojas de ruta, remitos y novedades se pasan a mano."],
      ["Tarifas que van detrás de los costos", "Los costos suben y la tarifa se revisa tarde."],
      ["Clientes que preguntan dónde está su carga", "Cada consulta es un llamado o un mensaje que alguien tiene que responder."],
    ],
    servicios: [
      ["integracion", "Unimos rastreo, facturación, combustible y planillas de choferes en una base común, y automatizamos la carga de remitos y comprobantes."],
      ["finanzas", "Costo por viaje, por unidad y por cliente, rentabilidad de cada contrato y tarifas que cubren los costos."],
      ["software", "Gestión de viajes, flota, depósito y entregas, con seguimiento para el cliente y modelos que proponen la mejor asignación."],
    ],
  },
  {
    id: "construccion", nombre: "Construcción", grafico: "blocks",
    graficoEje: ["obra 1", "obra 2", "obra 3 atrasada"],
    graficoNota: "avance real contra presupuesto (línea punteada) · datos de ejemplo",
    frase: "Cada obra con su costo, su avance y su caja.",
    d: "Constructoras y desarrollistas. Cada obra es un proyecto con su presupuesto, sus certificaciones y sus pagos, y cuesta ver a tiempo si se está desviando.",
    rasgos: [
      ["El presupuesto y lo real no se cruzan", "El desvío de una obra se descubre al final, cuando ya no se puede corregir."],
      ["Certificaciones, anticipos y pagos en planillas distintas", "Saber cuánta plata necesita cada obra el mes que viene es un trabajo aparte."],
      ["Costos que cambian durante la obra", "Materiales y mano de obra se actualizan, y el presupuesto queda viejo."],
      ["Información repartida entre la oficina y la obra", "Partes diarios, compras y avances llegan por fotos y mensajes."],
    ],
    servicios: [
      ["integracion", "Unimos compras, contabilidad, bancos y partes de obra en una base común, con tableros por obra."],
      ["finanzas", "Presupuesto contra real por obra y por rubro, rentabilidad de cada proyecto y flujo de fondos consolidado de todas las obras."],
      ["software", "Gestión de obras, compras, certificaciones y avance físico, con carga desde la obra en el celular."],
    ],
  },
];

/* --------------------------------------------------------------------------
   Cómo trabajamos: los pasos de cada eje (id de SERVICIOS), en orden.
   -------------------------------------------------------------------------- */
const PASOS = [
  { eje: "integracion", pasos: [
    ["Relevamiento de fuentes", "Recorremos los sistemas, las planillas y los circuitos de información, hasta el nivel de las fórmulas."],
    ["Integración", "Reunimos las fuentes en una base de datos propia que se actualiza sola, sin reemplazar lo que ya funciona."],
    ["Automatización", "Lo que hoy es exportar, copiar y transcribir pasa a ser automático, con agentes de IA donde suman y con controles."],
  ] },
  { eje: "finanzas", pasos: [
    ["Estructura de costos", "Ordenamos los costos por producto, por línea y por centro de costos, junto con quienes los conocen."],
    ["Modelo económico y financiero", "Armamos el estado de resultados de gestión, el punto de equilibrio y el flujo de fondos proyectado."],
    ["Tableros y seguimiento", "Llevamos los números a tableros que se actualizan con tus datos y los revisamos con vos cada mes."],
  ] },
  { eje: "software", pasos: [
    ["Especificación", "Documentamos qué va a hacer cada módulo y lo validamos con quienes lo van a usar."],
    ["Desarrollo por fases", "Construimos en etapas cortas, con pruebas automatizadas y avances que podés ver en todo momento."],
    ["Puesta en marcha y acompañamiento", "Desplegamos, migramos los datos, capacitamos a los equipos y sumamos lo que sigue sobre una base ordenada."],
  ] },
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
   Casos por subsector (pestañas de segundo nivel). `ambito` es el id de
   AMBITOS y `sector` el de SECTORES. `grupos` puede quedar vacío cuando
   todavía no hay un caso publicado. `demo` referencia una función de demos.js,
   `servicios` los ids de SERVICIOS que intervienen y `arq` las capas de
   la arquitectura (`arqTitulo` cambia el rótulo cuando todavía es un diseño).
   -------------------------------------------------------------------------- */
const VERTICALES = [
  {
    id: "industria", ambito: "privado", sector: "industria",
    nombre: "Industrias",
    bajada: "Metalúrgicas, agroindustria y exportación",
    intro: "Para empresas productivas cuyo ERP registra bien la operación pero no responde las preguntas de decisión, y para exportadores que comprometen producto por calidad y contrato.",
    grupos: [
      {
        nombre: "Fabricante de maquinaria",
        nota: "Estado de resultado y finanzas sobre el ERP",
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
  { id: "comercio", ambito: "privado", sector: "comercio", nombre: "Comercios", bajada: "Mayoristas, minoristas y distribuidoras", grupos: [] },
  { id: "logistica", ambito: "privado", sector: "logistica", nombre: "Logística", bajada: "Transporte y depósitos", grupos: [] },
  { id: "construccion", ambito: "privado", sector: "construccion", nombre: "Construcción", bajada: "Constructoras y desarrollistas", grupos: [] },
  {
    id: "ministerios", ambito: "publico", sector: "gobierno",
    grafico: "network", graficoEje: ["conducción al centro", "áreas y expedientes alrededor"],
    graficoNota: "áreas conectadas a una base común · datos de ejemplo",
    nombre: "Ministerios",
    bajada: "Ministerios y secretarías",
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
    ],
  },
  {
    id: "municipios", ambito: "publico", sector: "gobierno",
    nombre: "Municipios",
    bajada: "Atención al vecino",
    intro: "Del reporte del vecino a la cuadrilla, y de ahí a la consulta en lenguaje natural, en tres escalones que se suman sin perder datos.",
    grupos: [
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

/* --------------------------------------------------------------------------
   Quiénes confían en nosotros. La sección se muestra sola cuando hay al menos
   un elemento. Solo clientes reales que autorizaron aparecer, con su cita
   textual: { org, logo: "files/logo-x.svg" (opcional), cita, autor, cargo }.
   -------------------------------------------------------------------------- */
const TESTIMONIOS = [];

/* --------------------------------------------------------------------------
   Agenda: enlace de reserva (Google Calendar "programación de citas",
   Calendly, Cal.com…). Vacío = el último paso ofrece proponer horario por
   correo en lugar del calendario.
   -------------------------------------------------------------------------- */
const CALENDAR_URL = "";

/* --------------------------------------------------------------------------
   Diagnóstico inicial: cuestionario rápido antes de la reunión.
   Los tres primeros bloques son la Auditoría Express de Agustín (las mismas
   14 preguntas, la misma escala y los mismos textos, para que el resultado
   web se compare con el de la reunión). El cuarto suma datos y sistemas.
   Escala: Sí = 2 · Más o menos = 1 · No = 0. Claridad = puntos / máximo.
   `c` es la frase que se usa en "hoy no se dispone de…"; `extra` pide un
   dato cuando la respuesta es Sí y lo pasa a la calculadora.
   `eje` (id de SERVICIOS) decide "por dónde empezaríamos".
   -------------------------------------------------------------------------- */
const DIAGNOSTICO = {
  tamanos: ["1 a 10 personas", "11 a 50 personas", "51 a 200 personas", "Más de 200 personas"],
  modelos: ["Producción o industria", "Comercio o distribución", "Servicios", "Logística o transporte", "Construcción", "Organismo público", "Otro"],
  escala: [["si", "Sí", 2], ["mm", "Más o menos", 1], ["no", "No", 0]],
  bloques: [
    { id: "cp", eje: "finanzas", nom: "Costos y Precios", desc: "Qué tan preciso es el conocimiento del costo y de cómo se forma el precio.",
      qs: [
        { id: "cp1", c: "los costos variables unitarios discriminados", t: "¿Tenés discriminados tus costos variables unitarios?" },
        { id: "cp2", c: "la identificación del producto o servicio más rentable", t: "¿Sabés cuál es tu producto o servicio más rentable?" },
        { id: "cp3", c: "el margen de contribución del producto principal", t: "¿Sabés qué margen de contribución tenés sobre tu producto o servicio principal?",
          extra: { k: "margen", lbl: "¿Cuál es el margen? (%)" } },
        { id: "cp4", c: "el costo financiero e impositivo incorporado al precio", t: "¿Tenés en cuenta los costos financieros e impositivos al fijar el precio de venta?" },
      ],
      alto: "El nivel de claridad sobre precios y costos es alto. Aun así, hay márgenes que se escapan sin que se vean.",
      bajo: "Se opera con muy baja claridad sobre costos y precios. El resto es intuición, y eso sale caro." },
    { id: "ec", eje: "finanzas", nom: "Análisis Económico", desc: "Si la empresa sabe cuánto gana, con qué producto y a partir de qué volumen.",
      qs: [
        { id: "ec1", c: "claridad sobre qué es un estado de resultados económico", t: "¿Hay claridad sobre qué es un estado de resultados económico?" },
        { id: "ec2", c: "un estado de resultados mensual actualizado", t: "¿Se tiene un estado de resultados mensual actualizado?" },
        { id: "ec3", c: "el detalle de los costos fijos mensuales", t: "¿Se conocen los costos fijos mensuales?",
          extra: { k: "cf", lbl: "Monto mensual de costos fijos ($)" } },
        { id: "ec4", c: "el punto de equilibrio mensual", t: "¿Se conoce el punto de equilibrio mensual?" },
        { id: "ec5", c: "certeza sobre la rentabilidad real", t: "¿Se conoce la rentabilidad con certeza?" },
        { id: "ec6", c: "capacidad de simular escenarios antes de decidir", t: "¿Se pueden tomar decisiones simulando escenarios sobre el estado de resultados?" },
      ],
      alto: "La película económica se entiende bien. El paso siguiente es optimizar márgenes y escalar con estrategia.",
      bajo: "Hay algunas cifras, pero las decisiones no se toman con la foto completa. Eso puede estar costando plata todos los meses." },
    { id: "fi", eje: "finanzas", nom: "Análisis Financiero", desc: "Si el dinero está bajo control y si la caja se anticipa o se sufre.",
      qs: [
        { id: "fi1", c: "la distinción entre el resultado económico y el financiero", t: "¿Hay claridad sobre la diferencia entre el resultado económico y el financiero?" },
        { id: "fi2", c: "un control exhaustivo del flujo de fondos", t: "¿Se lleva un control exhaustivo del flujo de fondos (entradas y salidas)?" },
        { id: "fi3", c: "el calendario de cobros, pagos y vencimientos", t: "¿Hay fechas claras de pagos pendientes, cobros y vencimientos de facturas y cheques?" },
        { id: "fi4", c: "proyecciones de disponibilidades a tres meses", t: "¿Se cuenta con proyecciones de disponibilidades a 3 meses?" },
      ],
      alto: "Hay buen control financiero, pero sin planificación se puede entrar en estrés de caja en cualquier momento.",
      bajo: "Se puede estar vendiendo bien y aun así el dinero no aparece, porque se va por huecos que hoy no se ven." },
    { id: "dt", eje: "integracion", nom: "Datos y Sistemas", desc: "Si la información circula sola o hay que juntarla a mano cada vez.",
      qs: [
        { id: "dt1", c: "los datos de la empresa conectados en una base común", t: "¿Los datos de la empresa (ventas, stock, bancos, producción) están conectados entre sí, sin depender de planillas sueltas?" },
        { id: "dt2", c: "los números consolidados disponibles al día", t: "¿Podés ver ventas, stock y caja consolidados al día, sin pedir un informe?" },
        { id: "dt3", c: "las tareas de carga y transcripción automatizadas", t: "¿Las tareas de copiar, pegar o transcribir datos están automatizadas?" },
        { id: "dt4", c: "un sistema de gestión que cubra la operación", t: "¿El sistema que usan cubre la operación, sin planillas al costado?" },
      ],
      alto: "La información circula bien entre los sistemas. El paso siguiente es automatizar lo que queda y sumar análisis sobre esa base.",
      bajo: "Los datos existen, pero están repartidos y se juntan a mano. Cada número llega tarde y cuesta horas de trabajo." },
  ],
  // Evaluación final (cortes de la Auditoría Express)
  cierre: [
    [0.40, "Se están tomando decisiones con menos del 40% de la información clave. Es manejar a ciegas: el negocio puede estar en rojo sin que nadie lo sepa."],
    [0.70, "El negocio funciona, pero con parches. Así no se crece y mucho menos se escala. Hay información, pero no hay claridad."],
    [1.01, "Hay una base sólida. Lo que falta ahora es precisión, optimización y estrategia para crecer sin caos."],
  ],
  // Lectura de cada bloque: alto desde este valor
  corteAlto: 0.75,
};
