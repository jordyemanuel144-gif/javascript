# 52 · Leer un proyecto ajeno y depurarlo

> **Nivel 6 · Vue**
> La última lección es la más práctica: te sientas frente a un proyecto que no
> escribiste y tienes que entenderlo. Esto es un método, no teoría.

---

## 52.1 · El recorrido de 20 minutos

Hazlo en este orden. Con eso sabes de qué va el proyecto.

**1. `package.json`** — qué librerías usa y qué versión de Vue.

```jsonc
"vue": "^3.4.0"          // ¿3.4+? entonces hay defineModel
"pinia"                  // hay estado global
"vue-router"             // hay varias pantallas
"axios"                  // las llamadas no son con fetch
"vuetify" / "primevue" / "element-plus"   // librería de componentes
"@vueuse/core"           // hay composables listos, míralos antes de escribir
"vee-validate" / "zod"   // validación de formularios
```

Y los scripts: cómo se levanta (`dev`) y cómo se compila (`build`).

**2. `src/main.ts`** — qué plugins hay instalados. Todo lo que aparezca aquí
está disponible en toda la app.

**3. `src/router/index.ts`** — **el mapa del proyecto**. La lista de rutas te
dice cuántas pantallas hay y cómo se llaman. Empieza siempre por acá.

**4. `src/stores/`** — qué datos son globales. Los nombres de los stores son
los conceptos del negocio (sesión, carrito, pedidos).

**5. `src/services/` o `api/`** — con qué backend habla y qué endpoints usa.

**6. Una view completa** — elige la pantalla más simple y léela entera, de
arriba a abajo, siguiendo los imports.

**7. `.env` y `vite.config.ts`** — a qué URL apunta y si hay proxy o alias.

---

## 52.2 · Cómo leer un `.vue` que no escribiste

```vue
<script setup lang="ts">
// 1) LOS IMPORTS: te dicen de qué depende esta pantalla
import { ref, computed, onMounted } from 'vue';     // qué usa de Vue
import { useRoute } from 'vue-router';              // ¿lee la URL?
import { usePedidosStore } from '@/stores/pedidos'; // ¿qué store toca?
import TablaPedidos from '@/components/TablaPedidos.vue';   // qué hijos tiene

// 2) EL ESTADO: qué datos maneja
const cargando = ref(false);

// 3) LOS COMPUTED: qué se deriva de qué
const visibles = computed(() => ...);

// 4) LAS FUNCIONES: qué puede hacer el usuario
async function guardar() { ... }

// 5) LOS HOOKS: qué pasa al entrar y al salir
onMounted(cargar);
</script>
```

Y en el template, busca en este orden:

1. Los `v-if` / `v-else` de arriba: te dicen los **estados** de la pantalla.
2. Los `v-for`: cuáles son las **listas**.
3. Los `@eventos`: qué **acciones** hay.
4. Los componentes con mayúscula: los **hijos** (y ve a verlos si hace falta).

**El truco más útil:** `Ctrl+clic` sobre cualquier import, componente o función
te lleva a su definición. Y `Shift+F12` (VS Code) te muestra todos los lugares
donde se usa algo.

---

## 52.3 · Vue DevTools

Instálala en el navegador (Chrome/Edge/Firefox). Con la app corriendo, F12 →
pestaña **Vue**:

* **Components**: el árbol de componentes. Al seleccionar uno ves sus props,
  su estado y sus computed **en vivo**, y puedes editarlos.
* **Pinia**: todos los stores, su estado y el historial de cambios.
* **Routes**: la ruta actual, sus params y meta.
* **Timeline**: eventos, cambios de estado y rendimiento.

Es la forma más rápida de responder "¿de dónde sale este dato?": lo seleccionas
en Components y ves el componente que lo tiene.

---

## 52.4 · Depurar de verdad

```ts
// el clásico, pero mejor:
console.log({ usuario: usuario.value, cargando: cargando.value });
// ↑ con llaves, imprime los nombres además de los valores

console.table(productos.value);   // arrays de objetos, como tabla
debugger;                         // pausa la ejecución en el navegador
```

En el template:

```vue
<pre>{{ JSON.stringify(datos, null, 2) }}</pre>
```

> ⚠ Si imprimes un ref o un objeto reactivo, la consola muestra un Proxy. Para
> ver el objeto limpio:
> ```ts
> console.log(JSON.parse(JSON.stringify(datos.value)));
> import { toRaw } from 'vue'; console.log(toRaw(datos.value));
> ```

Para ver por qué se recalcula algo:

```ts
watchEffect(() => {
  console.log('se recalculó porque cambió algo de acá:', filtro.value, pagina.value);
});
```

Y la pestaña **Network** del navegador para ver qué se pidió, con qué
cabeceras y qué contestó el servidor. La mitad de los "bugs del front"
terminan siendo una respuesta del backend distinta a la esperada.

---

## 52.5 · Los 15 errores más frecuentes (y su causa)

| Síntoma | Causa casi segura |
|---|---|
| El valor no se actualiza en pantalla | falta `.value` en el script |
| `Cannot read properties of undefined` | el dato todavía no llegó → usa `?.` o `v-if` |
| `Property 'value' does not exist` | le estás poniendo `.value` a algo que no es un ref |
| El store no reacciona | desestructuraste sin `storeToRefs` |
| `getActivePinia() was called...` | falta `app.use(createPinia())` o llamaste al store fuera de un componente |
| El formulario recarga la página | falta `@submit.prevent` |
| Las filas se mezclan al ordenar | `:key` con el índice en vez del id |
| El detalle no recarga al cambiar de id | falta `watch` sobre `route.params.id` |
| `Cannot find module './X.vue'` | falta `env.d.ts`, o el nombre tiene otras mayúsculas |
| La ruta hija no se ve | falta `<RouterView />` en el componente padre |
| La app va más lenta con el tiempo | falta limpiar intervalos/listeners en `onUnmounted` |
| `"5" + 1` da `"51"` | falta `v-model.number` |
| El modal queda detrás / cortado | necesita `<Teleport to="body">` |
| "Set operation on key ... failed: target is readonly" | estás mutando una prop |
| Al recargar `/pedidos/7` da 404 | el servidor no está redirigiendo todo a `index.html` |

---

## 52.6 · Convenciones que conviene respetar

* **Nombres de componentes en PascalCase**, con dos palabras como mínimo:
  `TablaPedidos.vue`, no `Table.vue` ni `tabla.vue`.
* **Un archivo por componente.** Si pasa de ~200 líneas, algo se puede extraer.
* **`components/` reutilizable, `views/` por ruta.**
* **La lógica repetida se va a un composable**, no se copia.
* **Los tipos compartidos en `types/`**, importados con `import type`.
* Antes de tocar nada: mira cómo está hecho lo de al lado y hazlo igual. La
  consistencia vale más que tu estilo preferido.

---

## 52.7 · Checklist antes de dar algo por terminado

- [ ] ¿Maneja los cuatro estados (cargando, error, vacío, datos)?
- [ ] ¿El botón de guardar se deshabilita mientras guarda?
- [ ] ¿Los `v-for` tienen `:key` única y estable?
- [ ] ¿Se limpian intervalos y listeners en `onUnmounted`?
- [ ] ¿Los errores se muestran al usuario, no solo en la consola?
- [ ] ¿`vue-tsc --noEmit` pasa sin errores?
- [ ] ¿Quedaron `console.log` olvidados?
- [ ] ¿Anda al recargar la página estando en esa ruta?
- [ ] ¿Y si la lista viene vacía? ¿Y si la API tarda 10 segundos?

---

## Ejercicios

**E1.** Te dan un proyecto Vue nuevo. Nombra los tres primeros archivos que
abres y qué buscas en cada uno.

**E2.** ¿Qué archivo te dice cuántas pantallas tiene la app?

**E3.** Ves `"vue": "^3.2.0"` en el package.json. ¿Puedes usar `defineModel`?

**E4.** ¿Cómo sabes con qué backend habla la app?

**E5.** Un dato aparece en pantalla y no sabes de dónde sale. ¿Qué haces?

**E6.** Diagnostica: escribes en un input y el `{{ texto }}` no cambia.

**E7.** Diagnostica: al ordenar una tabla, los checkboxes se marcan en filas
equivocadas.

**E8.** Diagnostica: navegas de `/pedido/1` a `/pedido/2` y sigue mostrando el
pedido 1.

**E9.** Diagnostica: al mandar el formulario, la página se recarga entera.

**E10.** Diagnostica: `Uncaught TypeError: Cannot read properties of undefined
(reading 'nombre')` al cargar una pantalla.

**E11.** Diagnostica: cambias un valor del store y la pantalla no se entera.

**E12.** Diagnostica: la app anda bien, pero después de 20 minutos navegando se
vuelve lenta.

**E13.** ¿Qué imprimes para ver un objeto reactivo sin el Proxy?

**E14.** Nombra tres cosas de la checklist final que sueles olvidar.

---

## Soluciones

**E1.** `package.json` (librerías y versión de Vue), `src/main.ts` (plugins
instalados) y `src/router/index.ts` (el mapa de pantallas).

**E2.** `src/router/index.ts`.

**E3.** No: `defineModel` llegó en 3.4. Hay que usar la prop `modelValue` + el
evento `update:modelValue`.

**E4.** Por `.env` (`VITE_API_URL`), por `vite.config.ts` (si hay proxy) y por
la carpeta `services/`.

**E5.** Vue DevTools → pestaña Components: seleccionas el elemento y ves de qué
componente viene y qué props/estado tiene. Si es global, pestaña Pinia.

**E6.** Falta el `v-model`, o estás usando `:value` sin `@input`. Si el texto
sí cambia en la variable pero no en pantalla, revisa el `.value`.

**E7.** El `v-for` usa el índice como `:key`. Hay que usar el id.

**E8.** El componente se reutiliza y `onMounted` no vuelve a correr. Falta
`watch(() => route.params.id, cargar, { immediate: true })`.

**E9.** Falta `@submit.prevent` en el `<form>`.

**E10.** El dato todavía no llegó de la API. Hay que proteger con `v-if="dato"`
o con `?.`, e inicializar el ref con un valor razonable.

**E11.** Desestructuraste el store sin `storeToRefs`, o modificaste una copia
en vez del estado del store.

**E12.** Hay fugas: intervalos, listeners de `window` o suscripciones que no se
limpian en `onUnmounted`.

**E13.** `console.log(JSON.parse(JSON.stringify(obj)))` o
`console.log(toRaw(obj))`.

**E14.** (Respuesta personal — las más habituales son el estado "vacío",
deshabilitar el botón mientras guarda y los `console.log` olvidados.)

---

## Y ahora qué

Ya recorriste el camino completo: JavaScript → TypeScript → Vue. Lo que queda
es **usarlo en el proyecto del trabajo**. Una forma de seguir:

1. Abre el proyecto y haz el recorrido de 20 minutos de 52.1.
2. Elige la pantalla más simple y léela entera. Anota lo que no entiendas.
3. Busca cada duda en la lección que le corresponde (el índice está en el
   `README.md` de la raíz).
4. Haz un cambio chico de verdad: un texto, una columna, una validación.
5. Repite con una pantalla más grande.

Las chuletas de `99-chuletas/` están para tener todo a mano mientras tanto.
