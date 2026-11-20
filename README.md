# Landing · Peirone & Bonafé

Página estática (HTML, CSS y JavaScript sin dependencias ni compilación). Abrir `index.html` en el navegador o publicarla tal cual en GitHub Pages.

> "Peirone & Bonafé" es un nombre provisorio. Se cambia en una línea: `BRAND` en `data.js` (y el `<title>` de `index.html`).

## Recorrido de la página

1. **Inicio**: titular, mosaico animado "de disperso a ordenado" y franja de datos verificables con contador
2. **Qué hacemos**: los tres ejes (Conectar, Medir, Gestionar) como pestañas; cada uno cuenta problema, lo que hacemos, lo que cambia y qué incluye
3. **Demos**: galería con las 7 demos interactivas; cada tarjeta abre la demo en un modal
4. **Sectores y casos**: pestañas Industria y Gobierno; cada una trae el contexto del sector, su gráfico animado (caja a 13 semanas o mapa de celdas), los tres ejes aplicados y las fichas de los casos
5. **Cómo trabajamos**: cinco pasos con una línea que se completa al entrar en pantalla
6. **Por qué nosotros**: seis diferenciales
7. **Equipo**
8. **Contacto**: formulario que arma el correo y lo abre en el cliente de correo

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Estructura y textos fijos (titulares, equipo, contacto) |
| `data.js` | **Contenido editable**: marca, correo, datos de la franja, ejes, sectores, pasos, diferenciales y casos |
| `demos.js` | Las demos interactivas (datos ficticios, todo en el navegador) |
| `app.js` | Render, gráficos SVG animados, pestañas, navegación, tema y modal |
| `tokens.css` | Paleta y tipografía de la línea estética "Mosaico de datos", en claro y oscuro |
| `styles.css` | Estilos de la página (solo tokens) y, al final, los de las demos |
| `files/*-480.jpg` | Fotos del equipo. Los `.png` originales no se publican (`.gitignore`) |

## Demos

Enlace directo: `index.html#demo-<clave>`. El botón "Copiar enlace" del modal lo genera.

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

- Definir marca, logo y dominio.
- Casilla de contacto (`CONTACT_EMAIL` en `data.js`): todavía lleva el nombre anterior. El formulario usa `mailto:`; para recibir mensajes sin depender del cliente de correo del visitante, conectar un servicio de formularios (Formspree, Getform o similar).
- Equipo: la maestría y la especialización terminan en 2026; al recibirse, pasar "Mg." y "Esp." a "Magíster" y "Especialista".
- Sección "Quiénes confían en nosotros": comentada en `index.html` hasta tener autorizaciones.
- Imagen para compartir (`og:image`, 1200 × 630) cuando haya logo.
