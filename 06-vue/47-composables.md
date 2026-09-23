# 47 · Composables

> **Nivel 6 · Vue**
> Un composable es **una función que usa la reactividad de Vue y devuelve
> estado y funciones**. Es la forma de reutilizar lógica sin repetirla en cada
> componente.

---

## 47.1 · El más simple posible

```ts
// composables/useContador.ts
import { ref, computed } from 'vue';

export function useContador(inicial = 0) {
  const n = ref(inicial);
  const doble = computed(() => n.value * 2);

  function subir(cuanto = 1) { n.value += cuanto; }
  function reiniciar() { n.value = inicial; }

  return { n, doble, subir, reiniciar };
}
```

```vue
<script setup lang="ts">
import { useContador } from '@/composables/useContador';

const { n, doble, subir, reiniciar } = useContador(10);
</script>

<template>
  <p>{{ n }} (doble: {{ doble }})</p>
  <button @click="subir()">+1</button>
  <button @click="reiniciar">Reiniciar</button>
</template>
```

Las convenciones (no son obligatorias, pero todo el mundo las sigue):

* el nombre empieza con **`use`**
* vive en `src/composables/`
* devuelve un **objeto** con refs y funciones
* **cada componente que lo llame tiene su propia copia del estado**

> Esa última línea es la diferencia clave con un store: `useContador()` crea un
> contador nuevo cada vez. Si quieres un valor compartido por toda la app,
> necesitas Pinia (tema 48) — o declarar el `ref` **fuera** de la función.

---

## 47.2 · Por qué se puede desestructurar

```ts
const { n, subir } = useContador();   // ✓ no se rompe
```

Funciona porque el composable devuelve un objeto plano **cuyos valores ya son
refs**. Al desestructurar copias la referencia al ref, no su valor. Es
exactamente lo contrario de desestructurar un `reactive` (tema 40.4).

---

## 47.3 · Un composable con datos de una API

```ts
// composables/useUsuarios.ts
import { ref } from 'vue';
import type { Usuario } from '@/types/usuario';

export function useUsuarios() {
  const usuarios = ref<Usuario[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  async function cargar() {
    cargando.value = true;
    error.value = null;
    try {
      const r = await fetch('/api/usuarios');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      usuarios.value = (await r.json()) as Usuario[];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido';
    } finally {
      cargando.value = false;
    }
  }

  return { usuarios, cargando, error, cargar };
}
```

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useUsuarios } from '@/composables/useUsuarios';

const { usuarios, cargando, error, cargar } = useUsuarios();
onMounted(cargar);
</script>

<template>
  <p v-if="cargando">Cargando...</p>
  <p v-else-if="error">{{ error }}</p>
  <ul v-else>
    <li v-for="u in usuarios" :key="u.id">{{ u.nombre }}</li>
  </ul>
</template>
```

Ese trío `datos / cargando / error` es el patrón que vas a repetir en cada
pantalla. Un composable lo escribe **una vez**.

---

## 47.4 · Composable genérico

```ts
// composables/usePeticion.ts
import { ref } from 'vue';

export function usePeticion<T>(fn: () => Promise<T>) {
  const datos = ref<T | null>(null) as Ref<T | null>;
  const cargando = ref(false);
  const error = ref<string | null>(null);

  async function ejecutar() {
    cargando.value = true;
    error.value = null;
    try {
      datos.value = await fn();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error';
    } finally {
      cargando.value = false;
    }
  }

  return { datos, cargando, error, ejecutar };
}
```

```ts
const { datos: pedidos, cargando, error, ejecutar } = usePeticion(
  () => api.pedidos.listar(),
);
```

Con un genérico `<T>` (tema 33) el composable sirve para cualquier endpoint y
`pedidos` sigue estando tipado.

---

## 47.5 · Composables que se limpian solos

```ts
// composables/useAnchoVentana.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useAnchoVentana() {
  const ancho = ref(window.innerWidth);

  function actualizar() { ancho.value = window.innerWidth; }

  onMounted(() => window.addEventListener('resize', actualizar));
  onUnmounted(() => window.removeEventListener('resize', actualizar));

  return { ancho };
}
```

Un composable **puede usar los hooks del ciclo de vida**: se enganchan al
componente que lo llamó. Por eso la limpieza viaja con la lógica y no te puedes
olvidar de ella.

> ⚠ Por eso mismo, un composable hay que llamarlo **en el nivel superior** de
> `<script setup>`, no dentro de un `if`, un `for` ni una función asíncrona.
> Si lo llamas dentro de un `setTimeout`, los hooks no se registran.

---

## 47.6 · Estado compartido: fuera de la función

```ts
// composables/useTema.ts
import { ref } from 'vue';

const tema = ref<'claro' | 'oscuro'>('claro');   // ← FUERA: uno solo para toda la app

export function useTema() {
  function alternar() {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro';
    localStorage.setItem('tema', tema.value);
  }
  return { tema, alternar };
}
```

| Dónde declaras el ref | Resultado |
|---|---|
| **Dentro** de la función | estado por componente |
| **Fuera** de la función | estado compartido (mini store) |

Para cosas chicas (tema, sidebar abierta) alcanza. Para el estado importante de
la app, usa Pinia: trae devtools, SSR y mejores convenciones.

---

## 47.7 · Composables que ya existen

Antes de escribir uno, mira si está en **VueUse** (`npm i @vueuse/core`), que es
la librería estándar de facto:

```ts
import {
  useLocalStorage, useDebounce, useFetch, useMouse,
  useWindowSize, useClipboard, useDark, useIntervalFn,
} from '@vueuse/core';

const tema = useLocalStorage('tema', 'claro');      // persistente y reactivo
const busquedaLenta = useDebounce(busqueda, 300);   // debounce en una línea
const { width } = useWindowSize();
```

Si el proyecto del trabajo ya la tiene, revisa qué hay antes de reinventar.

---

## Ejercicios

**E1.** Escribe un composable `useAlternar` que devuelva `valor` (booleano) y
`alternar()`.

**E2.** Úsalo en un componente para mostrar y ocultar un panel.

**E3.** Escribe `useContador(inicial)` con `n`, `doble`, `subir` y `bajar`.

**E4.** ¿Por qué se puede hacer `const { n } = useContador()` sin perder la
reactividad?

**E5.** Escribe un composable `useLista<T>()` con `items`, `agregar(item)`,
`quitar(indice)` y `vaciar()`.

**E6.** Escribe `useUsuarios()` con `usuarios`, `cargando`, `error` y `cargar()`.

**E7.** Escribe `useTeclaEscape(alPresionar)`: escucha la tecla Escape mientras
el componente esté vivo y limpia el listener al destruirse.

**E8.** ¿Dónde declararías el `ref` si quieres que el valor sea compartido por
toda la app?

**E9.** Nombra tres convenciones de un composable.

**E10.** ¿Qué está mal aquí?
```ts
function cargarTodo() {
  const { usuarios, cargar } = useUsuarios();   // dentro de una función
  cargar();
}
```

**E11.** Escribe `useLocalStorage(clave, inicial)` que lea el valor guardado al
crearse y lo escriba cada vez que cambie.

**E12.** ¿Composable o store de Pinia? 1) el ancho de la ventana, 2) el usuario
logueado, 3) la lógica de un formulario de alta, 4) el carrito de compras.

---

## Soluciones

**E1.**
```ts
import { ref } from 'vue';

export function useAlternar(inicial = false) {
  const valor = ref(inicial);
  function alternar() { valor.value = !valor.value; }
  return { valor, alternar };
}
```

**E2.**
```vue
<script setup lang="ts">
const { valor: abierto, alternar } = useAlternar();
</script>

<template>
  <button @click="alternar">Mostrar/ocultar</button>
  <div v-show="abierto">Contenido</div>
</template>
```

**E3.**
```ts
export function useContador(inicial = 0) {
  const n = ref(inicial);
  const doble = computed(() => n.value * 2);
  function subir() { n.value++; }
  function bajar() { n.value--; }
  return { n, doble, subir, bajar };
}
```

**E4.** Porque el composable devuelve un objeto plano cuyos valores **ya son
refs**: al desestructurar copias la referencia al ref, no el valor suelto.

**E5.**
```ts
export function useLista<T>(inicial: T[] = []) {
  const items = ref<T[]>(inicial) as Ref<T[]>;
  function agregar(item: T) { items.value = [...items.value, item]; }
  function quitar(i: number) { items.value = items.value.filter((_, j) => j !== i); }
  function vaciar() { items.value = []; }
  return { items, agregar, quitar, vaciar };
}
```

**E6.** El de la sección 47.3.

**E7.**
```ts
export function useTeclaEscape(alPresionar: () => void) {
  function manejar(e: KeyboardEvent) {
    if (e.key === 'Escape') alPresionar();
  }
  onMounted(() => window.addEventListener('keydown', manejar));
  onUnmounted(() => window.removeEventListener('keydown', manejar));
}
```

**E8.** Fuera de la función exportada, en el nivel superior del módulo.

**E9.** Empieza con `use`, vive en `composables/`, devuelve un objeto con refs
y funciones (y se llama en el nivel superior del `<script setup>`).

**E10.** Un composable se llama en el nivel superior de `<script setup>`. Ahí
dentro, los hooks (`onMounted`, `onUnmounted`) no se registran en ningún
componente, así que no se limpian nunca.

**E11.**
```ts
export function useLocalStorage(clave: string, inicial: string) {
  const valor = ref(localStorage.getItem(clave) ?? inicial);
  watch(valor, (v) => localStorage.setItem(clave, v));
  return valor;
}
```

**E12.** 1 → composable · 2 → store · 3 → composable · 4 → store
