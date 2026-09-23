# 48 · Pinia (estado global)

> **Nivel 6 · Vue**
> Un store es un estado que vive **fuera** de los componentes y que todos
> comparten. Pinia es el oficial de Vue 3 (reemplaza a Vuex).

---

## 48.1 · Cuándo hace falta un store

| Situación | Solución |
|---|---|
| Un dato que solo usa un componente | `ref` local |
| Padre → hijo | props |
| Hijo → padre | emits |
| Dos componentes lejanos, el mismo dato | **store** |
| Usuario logueado, permisos, carrito, tema | **store** |
| Pasar una prop por 4 niveles para llegar abajo | **store** o `provide/inject` |

No metas todo en el store. Empieza local y sube solo lo que de verdad se
comparta.

---

## 48.2 · Instalar y declarar

```ts
// main.ts
import { createPinia } from 'pinia';
app.use(createPinia());
```

```ts
// stores/contador.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useContadorStore = defineStore('contador', () => {
  // STATE: los refs
  const n = ref(0);

  // GETTERS: los computed
  const doble = computed(() => n.value * 2);

  // ACTIONS: las funciones
  function subir(cuanto = 1) { n.value += cuanto; }
  function reiniciar() { n.value = 0; }

  return { n, doble, subir, reiniciar };   // ← hay que devolver TODO
});
```

* El primer argumento (`'contador'`) es el **id**: tiene que ser único en toda
  la app. Es el que se ve en las devtools.
* Esta forma se llama **setup store** y se escribe igual que un composable.
* Lo que no devuelvas, no existe para el resto de la app.

Forma alternativa (*options store*), que también verás:

```ts
export const useContadorStore = defineStore('contador', {
  state: () => ({ n: 0 }),
  getters: { doble: (s) => s.n * 2 },
  actions: { subir(c = 1) { this.n += c; } },
});
```

Las dos funcionan. La primera se lleva mejor con TypeScript y es la que
recomienda la documentación actual.

---

## 48.3 · Usarlo en un componente

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContadorStore } from '@/stores/contador';

const store = useContadorStore();

// state y getters: CON storeToRefs para no perder la reactividad
const { n, doble } = storeToRefs(store);

// actions: directo, sin storeToRefs
const { subir, reiniciar } = store;
</script>

<template>
  <p>{{ n }} · doble: {{ doble }}</p>
  <button @click="subir()">+1</button>
  <button @click="subir(5)">+5</button>
  <button @click="reiniciar">Reiniciar</button>

  <!-- también se puede usar el store directo, sin desestructurar: -->
  <p>{{ store.n }}</p>
</template>
```

> ⚠ **El error número uno con Pinia:**
> ```ts
> const { n } = useContadorStore();     // ✗ n deja de ser reactivo
> const { n } = storeToRefs(store);     // ✓
> ```
> `storeToRefs` es solo para **state y getters**. Las acciones son funciones y
> se desestructuran sin problema.

> ⚠ El segundo error: llamar a `useContadorStore()` **fuera** de un componente
> y antes de que Pinia esté instalada. Da *"getActivePinia() was called but
> there was no active Pinia"*. Llámalo dentro del `<script setup>` o dentro de
> una función, nunca en el nivel superior de un módulo suelto.

---

## 48.4 · Un store de verdad: sesión

```ts
// stores/sesion.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Usuario } from '@/types/usuario';

export const useSesionStore = defineStore('sesion', () => {
  const usuario = ref<Usuario | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const cargando = ref(false);

  const autenticado = computed(() => token.value !== null);
  const esAdmin = computed(() => usuario.value?.rol === 'admin');

  async function entrar(email: string, clave: string) {
    cargando.value = true;
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clave }),
      });
      if (!r.ok) throw new Error('Credenciales inválidas');

      const datos = (await r.json()) as { token: string; usuario: Usuario };
      token.value = datos.token;
      usuario.value = datos.usuario;
      localStorage.setItem('token', datos.token);
    } finally {
      cargando.value = false;
    }
  }

  function salir() {
    token.value = null;
    usuario.value = null;
    localStorage.removeItem('token');
  }

  return { usuario, token, cargando, autenticado, esAdmin, entrar, salir };
});
```

Desde cualquier componente, sin pasar props por ningún lado:

```vue
<script setup lang="ts">
const sesion = useSesionStore();
</script>

<template>
  <button v-if="sesion.autenticado" @click="sesion.salir">Salir</button>
  <RouterLink v-if="sesion.esAdmin" to="/admin">Panel</RouterLink>
</template>
```

---

## 48.5 · Un store de lista (CRUD)

```ts
// stores/productos.ts
export const useProductosStore = defineStore('productos', () => {
  const items = ref<Producto[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  const total = computed(() => items.value.length);
  const disponibles = computed(() => items.value.filter(p => p.stock > 0));
  const porId = computed(() => (id: number) => items.value.find(p => p.id === id));

  async function cargar() {
    cargando.value = true;
    error.value = null;
    try {
      items.value = await api.productos.listar();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error';
    } finally {
      cargando.value = false;
    }
  }

  async function crear(datos: NuevoProducto) {
    const creado = await api.productos.crear(datos);
    items.value = [...items.value, creado];       // actualizo la lista local
    return creado;
  }

  async function borrar(id: number) {
    await api.productos.borrar(id);
    items.value = items.value.filter(p => p.id !== id);
  }

  return { items, cargando, error, total, disponibles, porId, cargar, crear, borrar };
});
```

Fíjate en el patrón: la acción llama a la API y **después** actualiza la lista
local, en vez de recargar todo. La pantalla responde al instante.

---

## 48.6 · Un store desde otro store

```ts
export const useCarritoStore = defineStore('carrito', () => {
  const sesion = useSesionStore();       // ← se llama adentro, sin problema
  const items = ref<Item[]>([]);

  async function confirmar() {
    if (!sesion.autenticado) throw new Error('Hay que iniciar sesión');
    await api.pedidos.crear({ items: items.value, usuarioId: sesion.usuario!.id });
    items.value = [];
  }

  return { items, confirmar };
});
```

---

## 48.7 · Persistir y depurar

```ts
// guardar el carrito entre recargas, a mano:
watch(items, (v) => localStorage.setItem('carrito', JSON.stringify(v)), { deep: true });
```

O con el plugin `pinia-plugin-persistedstate`, que lo hace por configuración.

**Vue DevTools** (extensión del navegador) tiene una pestaña Pinia donde ves
el estado en vivo, el historial de cambios y puedes editar valores a mano. Es
la mejor herramienta para entender un proyecto ajeno.

---

## Ejercicios

**E1.** Escribe un store `useContadorStore` con `n`, `doble` y `subir`.

**E2.** Úsalo en un componente conservando la reactividad de `n` y `doble`.

**E3.** ¿Qué está mal?
```ts
const { n, subir } = useContadorStore();
```

**E4.** Escribe la línea que saca las acciones `entrar` y `salir` del store de
sesión.

**E5.** Escribe un store `useTemaStore` con `tema` (`'claro' | 'oscuro'`) y la
acción `alternar()`.

**E6.** Agrega al store de productos un getter `agotados`.

**E7.** Agrega un getter `porId` que reciba un id y devuelva el producto.

**E8.** Escribe la acción `borrar(id)` que llama a la API y saca el item de la
lista local sin mutarla.

**E9.** Desde un componente, muestra la lista de productos del store con el
estado de carga.

**E10.** ¿Qué significa el error *"getActivePinia() was called but there was no
active Pinia"* y cuáles son las dos causas típicas?

**E11.** ¿Store o `ref` local? 1) si un modal está abierto, 2) el usuario
logueado, 3) el texto de un buscador dentro de una pantalla, 4) el idioma de la
app.

**E12.** En el playground, abre `src/stores/contador.ts` y agrega una acción
`bajar()` que no deje bajar de 0.

---

## Soluciones

**E1.**
```ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useContadorStore = defineStore('contador', () => {
  const n = ref(0);
  const doble = computed(() => n.value * 2);
  function subir(c = 1) { n.value += c; }
  return { n, doble, subir };
});
```

**E2.**
```ts
const store = useContadorStore();
const { n, doble } = storeToRefs(store);
const { subir } = store;
```

**E3.** Al desestructurar el store directamente, `n` deja de ser reactivo
(queda el valor de ese instante). Hay que usar `storeToRefs` para el state y
los getters.

**E4.** `const { entrar, salir } = useSesionStore();`

**E5.**
```ts
export const useTemaStore = defineStore('tema', () => {
  const tema = ref<'claro' | 'oscuro'>('claro');
  function alternar() {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro';
  }
  return { tema, alternar };
});
```

**E6.** `const agotados = computed(() => items.value.filter(p => p.stock === 0));`

**E7.** `const porId = computed(() => (id: number) => items.value.find(p => p.id === id));`

**E8.**
```ts
async function borrar(id: number) {
  await api.productos.borrar(id);
  items.value = items.value.filter(p => p.id !== id);
}
```

**E9.**
```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductosStore } from '@/stores/productos';

const store = useProductosStore();
const { items, cargando, error } = storeToRefs(store);
onMounted(store.cargar);
</script>

<template>
  <p v-if="cargando">Cargando...</p>
  <p v-else-if="error">{{ error }}</p>
  <ul v-else>
    <li v-for="p in items" :key="p.id">{{ p.nombre }}</li>
  </ul>
</template>
```

**E10.** Que llamaste a un store antes de que Pinia estuviera instalada. Causas
típicas: falta `app.use(createPinia())` en `main.ts`, o llamaste
`useAlgoStore()` en el nivel superior de un módulo (fuera de un componente o de
una función).

**E11.** 1 → ref local · 2 → store · 3 → ref local · 4 → store

**E12.**
```ts
function bajar(cuanto = 1) {
  n.value = Math.max(0, n.value - cuanto);
}
```
(y acordarse de devolverlo en el `return` del store)
