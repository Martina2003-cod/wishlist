# Informe — WISHLIST

**Trabajo Práctico 2 · Desarrollo Frontend II** · Prof. Joaquín Cerviño · UADE · 2.º cuatrimestre 2026

**Apellido y nombre:** ______________________ **L.U.:** __________

| Entregable | Enlace |
| --- | --- |
| Aplicación publicada (Vercel) | https://wishlist-two-khaki.vercel.app |
| Repositorio (GitHub) | https://github.com/Martina2003-cod/wishlist |
| Bitácora del proceso | https://github.com/Martina2003-cod/wishlist/blob/main/BITACORA.md |

> **Primera visita:** la app usa login anónimo, así que cada navegador empieza con una wishlist vacía. El botón **"Cargar prendas de ejemplo"** guarda 6 prendas en Firestore para recorrerla.

---

## 1. Idea y público

**WISHLIST — *Save it. Style it. Make it yours.*** es un archivo personal de deseos de moda. Permite guardar en un solo lugar las prendas y accesorios que queremos comprar, que suelen quedar dispersos en capturas, links, redes sociales y carritos de distintas tiendas. A diferencia de un ecommerce, no vende productos: sirve para organizarlos, comparar precios, priorizarlos y planificar el presupuesto.

**Público destinatario:** jóvenes de 18 a 35 años interesados en la moda, que descubren productos en Instagram, Pinterest, TikTok o tiendas online y valoran la estética y la planificación de sus compras. La necesidad principal es **guardar una prenda en pocos pasos y encontrarla fácil cuando decidan comprarla**.

La **vuelta de tuerca** respecto de una lista de tareas está en tres cosas:
- la experiencia visual de **revista de moda** (Luxury Editorial);
- el **resumen de presupuesto** (total pendiente y total invertido);
- la **prioridad**, que ayuda a decidir qué comprar primero.

## 2. Funciones implementadas

| Función | Operación en Firestore |
| --- | --- |
| **Agregar prenda:** nombre, marca, precio, categoría, imagen (URL), enlace a la tienda y prioridad | Crear (`addDoc`) |
| **Ver la colección** en una grilla que se actualiza en tiempo real | Consultar (`onSnapshot`) |
| **Editar** cualquier dato de la prenda | Modificar (`updateDoc`) |
| **Marcar como comprado / volver a pendiente** | Modificar (`updateDoc`) |
| **Eliminar**, con confirmación previa | Eliminar (`deleteDoc`) |
| **Cargar prendas de ejemplo** cuando la wishlist está vacía | Crear en lote (`writeBatch`) |
| **Filtros:** pestañas Todo / My Wishlist / Purchased, categorías, prioridad, búsqueda y orden | — (sobre los datos ya consultados) |
| **Resumen:** guardados, pendientes, comprados, total invertido y total pendiente en ARS | — |

**Experiencia de uso:**
- **Validaciones:** campos obligatorios, precio mayor a 0 y URLs válidas.
- **Información de carga:** skeletons y spinners.
- **Mensajes de éxito y de error:** si una operación falla en Firebase, la interfaz lo informa.
- **Pantallas vacías** con indicaciones de qué hacer.
- **Diseño responsive:** funciona en computadora y en celular.
- **Accesibilidad:** se puede usar con teclado y el foco queda dentro de los modales.

**Pantallas:** una Home en cinco secciones (Header, Hero editorial, Resumen personal, My Collection y Footer). *Add Item* e *Item Detail* se abren como paneles sobre la Home.

## 3. Información guardada en Firebase

Los datos se guardan en **Cloud Firestore** (edición Standard, región São Paulo `southamerica-east1`). Cada visitante se identifica con **Firebase Authentication anónima**, y sus prendas se guardan en:

```
users/{uid}/items/{itemId}
```

| Campo | Tipo | Ejemplo |
| --- | --- | --- |
| `name` | string | "Blazer Oversized" |
| `brand` | string | "Zara" |
| `price` | number | 129900 |
| `category` | string | "Abrigos" (Ropa, Abrigos, Calzado, Carteras, Accesorios o Belleza) |
| `imageUrl` | string | URL de la foto |
| `link` | string | URL de la tienda |
| `priority` | string | "alta", "media" o "baja" |
| `status` | string | "pending" o "purchased" |
| `createdAt` | timestamp | fecha de creación |
| `purchasedAt` | timestamp o null | fecha de compra |

**Reglas de seguridad** ([`firestore.rules`](firestore.rules)): un usuario sólo puede leer y modificar los documentos de su propio `uid`. Además, al crear o modificar se valida el tipo y el largo de cada campo, que el precio sea mayor a 0 y que la categoría, la prioridad y el estado sean valores permitidos. La base **no** queda abierta a lecturas o escrituras sin restricciones.

**Dónde se conecta Firebase en el código:**

| Archivo | Qué hace |
| --- | --- |
| `.env` / `.env.example` | Variables `VITE_FIREBASE_*` con la configuración web |
| `src/firebase.js` | Inicializa Firebase (`initializeApp`), Firestore y el login anónimo (`ensureUser`) |
| `src/services/wishlistService.js` | Todas las operaciones sobre Firestore: `addDoc`, `updateDoc`, `deleteDoc`, `onSnapshot` y `writeBatch` |
| `src/hooks/useWishlist.js` | Conecta esas operaciones con el estado de React |
| `src/App.jsx` | Los formularios y botones llaman a `addItem`, `editItem`, `setStatus` y `removeItem` |

## 4. Herramientas de IA utilizadas

- **Claude (Anthropic), mediante Claude Code**, en la aplicación de escritorio. Lo usé para:
  - generar el proyecto React + Vite, los componentes y los estilos a partir de mi propuesta escrita;
  - escribir la integración con Firebase y las reglas de seguridad;
  - probar la app en un navegador y corregir los errores encontrados;
  - guiarme en la configuración de Firebase, GitHub y Vercel;
  - implementar las mejoras de las versiones 2 y 3;
  - grabar la demostración y redactar la documentación.

**Lo que definí yo:**
- el concepto, el nombre y la tagline;
- el público y las funcionalidades;
- la estética *Luxury Editorial* (paleta, tipografías, referencias de *Vogue* y *The Row*);
- la estructura de la Home en cinco secciones;
- el plan de tres versiones.

También revisé y probé cada versión publicada. Los pasos que requerían mis cuentas (iniciar sesión, aceptar términos, autorizar permisos, códigos de verificación) los hice yo.

## 5. Ejemplos representativos de instrucciones dadas a la IA

1. **Definición del proyecto**, a partir de mi propuesta completa (concepto, funcionalidades, modelo de datos, pantallas, paleta y tipografías):
   > "Y en cuanto a la estética quiero que sea Luxury Editorial. Vamos a diseñar la pantalla principal de WISHLIST como una plataforma de moda de lujo, inspirada en el diseño editorial de revistas como Vogue y The Row. […] La estética tendrá cuatro características principales: fotografías grandes, tipografía editorial, mucho espacio en blanco y una paleta neutra con pequeños acentos de rojo oscuro."

2. **Estructura de la Home:**
   > "La pantalla estará organizada en cinco secciones, siguiendo un recorrido visual de arriba hacia abajo. 01 — Header / Navegación: Logo · My Wishlist · Purchased · Add Item. 02 — Hero editorial […] 03 — Resumen personal […] 04 — My Collection: Filtros · Grilla de productos · Acciones. 05 — Footer."

3. **Entorno y ejecución:**
   > "Instalame node y corré la app."

4. **Integración con Firebase:**
   > "Ayudame a conectar el FireBase."

5. **Publicación:**
   > "Subilo a GitHub y publicalo en Vercel."

6. **Iteración y documentación:**
   > "Necesito que hagas todos esos pasos vos y una vez esté todo listo para entregar me digas."

7. **Uso real desde el celular:**
   > "Cómo agrego una imagen cuando me pide el URL."

## 6. Versiones

| Versión | Cambios principales |
| --- | --- |
| [`v1.0`](https://github.com/Martina2003-cod/wishlist/tree/v1.0) — Aplicación funcional | CRUD con Firestore, login anónimo y reglas, validaciones, filtros, resumen de presupuesto, diseño editorial, deploy en Vercel |
| [`v2.0`](https://github.com/Martina2003-cod/wishlist/tree/v2.0) — Mejoras de experiencia | Botón "Cargar prendas de ejemplo" (la app publicada ya no arranca vacía) y total invertido en compras |
| [`v3.0`](https://github.com/Martina2003-cod/wishlist/tree/v3.0) — Versión final | Código de la app de 612 KB a 32 KB (Firebase y React en paquetes separados), foco atrapado en los modales, metadatos para compartir el link |

El detalle de cada versión está en la [bitácora](BITACORA.md): las decisiones de diseño, las capturas, cómo se verificó cada despliegue, las pruebas y las dificultades con sus soluciones.
