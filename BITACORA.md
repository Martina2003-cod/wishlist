# Bitácora — WISHLIST

Registro del proceso de desarrollo, versiones y uso de herramientas de IA.
Completá las capturas y fechas a medida que avances.

---

## Versión 1 — Aplicación funcional

**Fecha:** _completar_

**Objetivo:** tener la app conectada a Firebase con las cuatro operaciones CRUD.

**Cambios:**
- Proyecto React + Vite.
- Configuración de Firebase (`src/firebase.js`) con login anónimo.
- Servicio de datos `wishlistService.js` con `createItem`, `subscribeItems`, `updateItem`, `deleteItem`.
- Formulario de alta y edición con validaciones (nombre, marca, precio > 0, categoría, URLs válidas).
- Grilla de productos en tiempo real (`onSnapshot`).
- Reglas de Firestore por usuario (`firestore.rules`).

**Captura:** _pegar captura_

---

## Versión 2 — Mejoras de experiencia

**Fecha:** _completar_

**Cambios:**
- Pestañas *Todo / My Wishlist / Purchased*.
- Filtros por categoría (chips), prioridad, búsqueda y orden.
- Marcar como comprado / volver a pendiente.
- Confirmación antes de eliminar.
- Mensajes de éxito y error (toasts), estados de carga y estados vacíos.
- Ajustes responsive (mobile: 2 columnas, modales tipo hoja inferior).

**Captura:** _pegar captura_

---

## Versión 3 — Diseño final

**Fecha:** _completar_

**Cambios:**
- Identidad Luxury Editorial: Cormorant Garamond + Inter, paleta off-white / carbón / arena / rojo editorial.
- Home en 5 secciones numeradas (Header, Hero, Resumen, My Collection, Footer).
- Resumen de presupuesto (total pendiente en ARS y barra de progreso de compras).
- Microinteracciones: zoom de imágenes, acciones al pasar el mouse, subrayados animados, fade de imágenes.
- Vista previa en vivo en el formulario.
- README, deploy en Vercel.

**Captura:** _pegar captura_

---

## Pruebas realizadas

| Prueba | Resultado esperado | OK |
| --- | --- | --- |
| Guardar formulario vacío | Muestra errores en cada campo obligatorio | ☐ |
| Precio 0 o negativo | Error “Ingresá un precio mayor a 0” | ☐ |
| URL de imagen inválida | Error de URL | ☐ |
| Agregar prenda | Aparece en la grilla y toast de éxito | ☐ |
| Recargar la página | La prenda sigue ahí (persistencia en Firestore) | ☐ |
| Editar precio | Se actualiza la tarjeta y el total pendiente | ☐ |
| Marcar como comprado | Pasa a la pestaña Purchased y suma en “Comprados” | ☐ |
| Eliminar | Pide confirmación y desaparece | ☐ |
| Filtrar por categoría | Muestra sólo esa categoría | ☐ |
| Otro navegador / incógnito | Ve una wishlist vacía (datos separados por usuario) | ☐ |
| Mobile (375px) | Sin scroll horizontal, 2 columnas | ☐ |

---

## Uso de IA

**Herramienta:** Claude (Anthropic) — Claude Code.

**Para qué se usó:**
- Generar la estructura inicial del proyecto y los componentes React.
- Escribir la capa de datos con Firebase (Auth anónimo + Firestore) y las reglas de seguridad.
- Proponer el sistema visual en CSS a partir de la propuesta de diseño (paleta, tipografías, secciones).
- Redactar el README y esta bitácora.

**Qué revisé / modifiqué yo:** _completar (ej.: textos, imágenes, colores, pruebas en Firebase, ajustes de diseño)_

**Prompts principales:** _completar con los pedidos más relevantes_

**Reflexión:** _completar — qué aprendiste, qué tuviste que corregir, límites de la herramienta_
