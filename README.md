# Landing · KAIROS Analytics

Página estática (HTML, CSS y JavaScript sin dependencias ni compilación). Abrir `index.html` en el navegador o publicarla tal cual en GitHub Pages. Las demos viven en una página aparte, `demo/index.html` (ruta `/demo/`).

> Marca: **KAIROS Analytics** (definida el 20-nov-2026). Se cambia en `BRAND` en `data.js` y en el `<title>` y `og:site_name` de `index.html`. Logo: cubo de celdas (propuesta 07), en `files/logo-claro.svg` y `files/logo-oscuro.svg`; elegido el 20-nov-2026 como provisorio.

## Recorrido de la página

1. **Inicio**: titular, mosaico animado "de disperso a ordenado" sobre ejes con flecha, y franja de datos verificables con contador
2. **Qué hacemos**: los tres ejes (Conectar, Medir, Construir) como pestañas; cada uno cuenta el problema, lo que hacemos, la solución y qué incluye, y termina con el botón "Ver demos"
3. **Sectores y casos**: primer nivel Privado / Público (`AMBITOS`) y segundo nivel por subsector (Industrias, Comercios, Logística, Construcción; Ministerios, Municipios). Cada uno trae el contexto del sector, su gráfico animado (programación de planta para Industrias, ventas por día y hora para Comercios, rutas para Logística, obras de bloques para Construcción, red de áreas para Ministerios y mapa de celdas para Municipios; una vertical puede pisar el gráfico de su sector con sus propios `grafico*`), los tres ejes aplicados y las fichas de los casos; los subsectores sin caso publicado invitan al diagnóstico
4. **Cómo trabajamos**: una columna por eje (Conectar, Medir, Construir) con sus pasos (`PASOS`), y una línea que se completa al entrar en pantalla
5. **Por qué nosotros**: seis diferenciales
6. **Equipo**
7. **Confían en nosotros**: logos de clientes en gris (`CLIENTES` en `data.js`, SVG de un solo color en `files/clientes/`) y, si se cargan, testimonios (`TESTIMONIOS`). Oculta si las dos listas están vacías
8. **Diagnóstico inicial y reunión**: tres pasos. (1) Datos de la empresa; (2) las 14 preguntas de la Auditoría Express de Agustín (Costos y Precios, Análisis Económico, Análisis Financiero) más 4 de Datos y Sistemas, con escala Sí / Más o menos / No; (3) evaluación final con los cortes 40 % y 70 %, lectura por bloque, brecha, por dónde empezar y calculadora de rentabilidad opcional. Los campos obligatorios avisan qué falta. Se envía sin salir de la página con Web3Forms (`WEB3FORMS_KEY`); sin clave, o si el servicio falla, abre el programa de correo. También se puede copiar. Si `CALENDAR_URL` tiene un enlace, ofrece elegir horario

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Estructura y textos fijos (titulares, equipo, contacto) |
| `data.js` | **Contenido editable**: marca, correos, datos de la franja, ejes, ámbitos, sectores, pasos, diferenciales, casos, testimonios, agenda y cuestionario del diagnóstico |
| `demos.js` | Las demos interactivas (datos ficticios, todo en el navegador) |
| `demo/index.html`, `demo/demo.js` | Página de demos: galería y modal. Usa `data.js`, `demos.js` y los estilos de la raíz |
| `app.js` | Render de la landing, gráficos SVG animados, pestañas, navegación, tema y diagnóstico |
| `tokens.css` | Paleta y tipografía de la línea estética "Mosaico de datos", en claro y oscuro |
| `styles.css` | Estilos de la página (solo tokens) y, al final, los de las demos |
| `files/*-480.jpg` | Fotos del equipo. Los `.png` originales no se publican (`.gitignore`) |
| `files/og-image.png` | Imagen para compartir (1200 × 630): logo, titular, lema y mosaico. Se usa en `og:image` de las dos páginas |

## Demos

Enlace directo: `demo/#demo-<clave>`. El botón "Copiar enlace" del modal lo genera. Los enlaces viejos (`index.html#demo-<clave>`) redirigen a la página de demos.

| Clave | Qué muestra |
|---|---|
| `costeo` | Margen, punto de equilibrio y caja a 13 semanas con alertas |
| `cruce` | Optimización lote → contrato y lectura de informes de laboratorio |
| `plataforma` | Resumen territorial y permisos por rol |
| `agenteGestiones` | Chat con interpretación, consulta predefinida y aclaración |
| `reportes` | Mapa ciudadano: reportar, filtrar y administrar estados |
| `reclamos` | Un reclamo de punta a punta entre vecino, supervisor y técnico |
| `agenteReclamos` | Chat con reescritura, elección de herramienta y caché |

`renta` (comparador de renta fija) sigue en `demos.js` sin uso: Finanzas está en espera.

## Criterios

- Casos sin nombre de cliente. Demos con datos ficticios; los agentes están simulados con reglas.
- La franja de datos (`PRUEBAS` en `data.js`) solo usa cantidades que constan en las fichas, no cifras de impacto.
- Movimiento suave y corto; se desactiva con `prefers-reduced-motion`.
- El color sale solo de `tokens.css`. El gradiente se reserva para los gráficos, la barra de lectura y los detalles de las tarjetas de demo.

## Pendiente

- Dominio (revisar disponibilidad de dominio y marca en INPI). El logo actual (cubo 07) puede cambiar.
- Contacto: Web3Forms escribe a una sola casilla por clave (`WEB3FORMS_KEY`); para que el diagnóstico llegue a las dos de `CONTACT_EMAILS`, reenviar desde esa casilla o sumar la otra en el panel de Web3Forms.
- Equipo: la maestría y la especialización terminan en 2026; al recibirse, pasar "Mg." y "Esp." a "Magíster" y "Especialista".
- Confían en nosotros: sumar testimonios (`TESTIMONIOS`) solo de clientes que autorizaron, con su cita textual. Para un logo nuevo: SVG de un solo color en `files/clientes/` y una línea en `CLIENTES`.
- Comercios, Logística y Construcción no tienen caso publicado; los textos de esos sectores son un borrador para revisar.
