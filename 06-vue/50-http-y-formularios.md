# 50 · HTTP, formularios y estados de carga

> **Nivel 6 · Vue**
> La pantalla típica de un sistema: traer datos, mostrarlos, editarlos y
> guardarlos, avisando siempre en qué estado va la cosa.

---

## 50.1 · La capa de servicios

Las llamadas HTTP **no** van dentro de los componentes. Se agrupan:

```ts
// services/http.ts
const BASE = import.meta.env.VITE_API_URL;

export class ErrorHttp extends Error {
  constructor(mensaje: string, public codigo: number) {
    super(mensaje);
    this.name = 'ErrorHttp';
  }
}

export async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  let r: Response;
  try {
    r = await fetch(`${BASE}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new ErrorHttp('Sin conexión con el servidor', 0);
  }

  if (!r.ok) {
    const cuerpo = await r.json().catch(() => ({}));
    throw new ErrorHttp(cuerpo.mensaje ?? `HTTP ${r.status}`, r.status);
  }

  return r.status === 204 ? (null as T) : ((await r.json()) as T);
}
```

```ts
// services/productos.ts
import { pedir } from './http';
import type { Producto, NuevoProducto } from '@/types/producto';

export const productosApi = {
  listar: () => pedir<Producto[]>('/productos'),
  traer: (id: number) => pedir<Producto>(`/productos/${id}`),
  crear: (datos: NuevoProducto) =>
    pedir<Producto>('/productos', { method: 'POST', body: JSON.stringify(datos) }),
  actualizar: (id: number, datos: Partial<Producto>) =>
    pedir<Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  borrar: (id: number) =>
    pedir<void>(`/productos/${id}`, { method: 'DELETE' }),
};
```

Desde el componente: `await productosApi.listar()`. La URL, el token y el
manejo de errores están en un solo lugar.

**Si el proyecto usa axios** (muy común), la idea es la misma:

```ts
import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) useSesionStore().salir();
    return Promise.reject(error);
  },
);
```

Diferencias de axios frente a fetch: lanza solo con 4xx/5xx, convierte el JSON
solo (`r.data`), y tiene interceptores. A cambio, es una dependencia más.

---

## 50.2 · Los cuatro estados de una pantalla

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productosApi } from '@/services/productos';
import type { Producto } from '@/types/producto';

const productos = ref<Producto[]>([]);
const cargando = ref(false);
const error = ref<string | null>(null);

async function cargar() {
  cargando.value = true;
  error.value = null;
  try {
    productos.value = await productosApi.listar();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error desconocido';
  } finally {
    cargando.value = false;          // pase lo que pase
  }
}

onMounted(cargar);
</script>

<template>
  <p v-if="cargando">Cargando...</p>

  <div v-else-if="error">
    <p>{{ error }}</p>
    <button @click="cargar">Reintentar</button>
  </div>

  <p v-else-if="productos.length === 0">Todavía no hay productos.</p>

  <ul v-else>
    <li v-for="p in productos" :key="p.id">{{ p.nombre }}</li>
  </ul>
</template>
```

Los cuatro estados: **cargando · error · vacío · datos**. El "vacío" y el botón
de "reintentar" son los que separan una pantalla terminada de una a medias.

---

## 50.3 · Un formulario completo

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { productosApi } from '@/services/productos';

const form = reactive({
  nombre: '',
  precio: 0,
  categoria: '',
});

const errores = ref<Record<string, string>>({});
const guardando = ref(false);
const errorGeneral = ref<string | null>(null);

const valido = computed(() =>
  form.nombre.trim().length >= 3 && form.precio > 0 && form.categoria !== '',
);

function validar(): boolean {
  const e: Record<string, string> = {};
  if (form.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres';
  if (form.precio <= 0) e.precio = 'El precio tiene que ser mayor a 0';
  if (!form.categoria) e.categoria = 'Elige una categoría';
  errores.value = e;
  return Object.keys(e).length === 0;
}

async function guardar() {
  if (!validar()) return;

  guardando.value = true;
  errorGeneral.value = null;
  try {
    await productosApi.crear({ ...form });
    form.nombre = '';
    form.precio = 0;
    form.categoria = '';
    errores.value = {};
  } catch (e) {
    errorGeneral.value = e instanceof Error ? e.message : 'No se pudo guardar';
  } finally {
    guardando.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="guardar">
    <div>
      <label for="nombre">Nombre</label>
      <input id="nombre" v-model.trim="form.nombre" />
      <small v-if="errores.nombre">{{ errores.nombre }}</small>
    </div>

    <div>
      <label for="precio">Precio</label>
      <input id="precio" type="number" v-model.number="form.precio" />
      <small v-if="errores.precio">{{ errores.precio }}</small>
    </div>

    <div>
      <label for="cat">Categoría</label>
      <select id="cat" v-model="form.categoria">
        <option value="">Elegir...</option>
        <option value="perifericos">Periféricos</option>
        <option value="pantallas">Pantallas</option>
      </select>
      <small v-if="errores.categoria">{{ errores.categoria }}</small>
    </div>

    <p v-if="errorGeneral">{{ errorGeneral }}</p>

    <button type="submit" :disabled="!valido || guardando">
      {{ guardando ? 'Guardando...' : 'Guardar' }}
    </button>
  </form>
</template>
```

Detalles que importan:

* `@submit.prevent` — sin eso la página se recarga.
* `:disabled="guardando"` — evita el doble envío (el doble clic nervioso).
* `v-model.number` en el precio, `v-model.trim` en el texto.
* `label` con `for` apuntando al `id`: accesibilidad y clic en la etiqueta.
* Los errores por campo en un objeto: se muestran junto a cada input.

---

## 50.4 · Buscar mientras escribe (con debounce)

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

const busqueda = ref('');
const resultados = ref<Producto[]>([]);
let idTemporizador: number | undefined;
let controlador: AbortController | undefined;

watch(busqueda, (texto) => {
  clearTimeout(idTemporizador);                  // debounce (tema 26)

  if (!texto.trim()) {
    resultados.value = [];
    return;
  }

  idTemporizador = window.setTimeout(async () => {
    controlador?.abort();                        // cancelo la anterior
    controlador = new AbortController();
    try {
      const r = await fetch(`/api/buscar?q=${encodeURIComponent(texto)}`, {
        signal: controlador.signal,
      });
      resultados.value = await r.json();
    } catch (e) {
      if ((e as Error).name !== 'AbortError') console.error(e);
    }
  }, 300);
});
</script>
```

Con VueUse esto son dos líneas:

```ts
import { refDebounced } from '@vueuse/core';
const busquedaLenta = refDebounced(busqueda, 300);
watch(busquedaLenta, buscar);
```

---

## 50.5 · Actualización optimista

Para que la interfaz se sienta instantánea: cambia primero, y si la API falla,
revierte.

```ts
async function alternarHecha(tarea: Tarea) {
  const antes = tarea.hecha;
  tarea.hecha = !antes;                    // 1) cambio ya

  try {
    await tareasApi.actualizar(tarea.id, { hecha: tarea.hecha });
  } catch {
    tarea.hecha = antes;                   // 2) si falla, deshago
    aviso('No se pudo guardar el cambio');
  }
}
```

---

## Ejercicios

**E1.** Escribe el objeto `clientesApi` con `listar`, `traer(id)`, `crear` y
`borrar`, usando un `pedir<T>` genérico.

**E2.** Escribe los tres refs del patrón de carga.

**E3.** Escribe la función `cargar()` con try/catch/finally.

**E4.** Escribe el template con los cuatro estados.

**E5.** Escribe un `<form>` que llame a `guardar` sin recargar la página.

**E6.** Escribe un input numérico atado a `form.precio` que guarde un número.

**E7.** Escribe el botón que se deshabilita mientras `guardando` es true y
cambia su texto.

**E8.** Escribe la función `validar()` que exige nombre de al menos 3 letras y
precio mayor que 0, guardando los errores en un objeto.

**E9.** Muestra el error del campo `nombre` debajo del input.

**E10.** ¿Por qué el `cargando.value = false` va en `finally` y no al final del
`try`?

**E11.** Escribe el patrón de actualización optimista para marcar una tarea
como hecha.

**E12.** ¿Qué hace `encodeURIComponent` y por qué es importante al armar la
query de búsqueda?

---

## Soluciones

**E1.**
```ts
export const clientesApi = {
  listar: () => pedir<Cliente[]>('/clientes'),
  traer: (id: number) => pedir<Cliente>(`/clientes/${id}`),
  crear: (datos: NuevoCliente) =>
    pedir<Cliente>('/clientes', { method: 'POST', body: JSON.stringify(datos) }),
  borrar: (id: number) => pedir<void>(`/clientes/${id}`, { method: 'DELETE' }),
};
```

**E2.**
```ts
const datos = ref<Cliente[]>([]);
const cargando = ref(false);
const error = ref<string | null>(null);
```

**E3.**
```ts
async function cargar() {
  cargando.value = true;
  error.value = null;
  try {
    datos.value = await clientesApi.listar();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error desconocido';
  } finally {
    cargando.value = false;
  }
}
```

**E4.**
```vue
<p v-if="cargando">Cargando...</p>
<div v-else-if="error">
  <p>{{ error }}</p>
  <button @click="cargar">Reintentar</button>
</div>
<p v-else-if="datos.length === 0">No hay datos.</p>
<ul v-else>
  <li v-for="c in datos" :key="c.id">{{ c.nombre }}</li>
</ul>
```

**E5.** `<form @submit.prevent="guardar"> ... </form>`

**E6.** `<input type="number" v-model.number="form.precio" />`

**E7.**
```vue
<button type="submit" :disabled="guardando">
  {{ guardando ? 'Guardando...' : 'Guardar' }}
</button>
```

**E8.**
```ts
function validar(): boolean {
  const e: Record<string, string> = {};
  if (form.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres';
  if (form.precio <= 0) e.precio = 'El precio tiene que ser mayor a 0';
  errores.value = e;
  return Object.keys(e).length === 0;
}
```

**E9.** `<small v-if="errores.nombre">{{ errores.nombre }}</small>`

**E10.** Porque `finally` se ejecuta también cuando hay excepción. Si lo
pusieras al final del `try`, un error dejaría el spinner girando para siempre.

**E11.**
```ts
const antes = tarea.hecha;
tarea.hecha = !antes;
try {
  await tareasApi.actualizar(tarea.id, { hecha: tarea.hecha });
} catch {
  tarea.hecha = antes;
}
```

**E12.** Escapa los caracteres que no son válidos en una URL (espacios,
acentos, `&`, `#`). Sin eso, buscar `"mouse & teclado"` rompe la query o
manda parámetros de más.
