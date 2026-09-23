# 46 · Ciclo de vida y referencias al DOM

> **Nivel 6 · Vue**
> Cuándo se ejecuta cada cosa, y cómo llegar a un elemento real del navegador
> cuando de verdad hace falta.

---

## 46.1 · Los hooks del ciclo de vida

```ts
import {
  onBeforeMount, onMounted,
  onBeforeUpdate, onUpdated,
  onBeforeUnmount, onUnmounted,
  onErrorCaptured,
} from 'vue';

onMounted(() => {
  // el componente ya está en la pantalla
});
```

El orden real:

```
  <script setup>  ← el cuerpo se ejecuta primero (equivale a "created")
        ↓
  onBeforeMount   ← todavía no hay HTML
        ↓
  [ se dibuja ]
        ↓
  onMounted       ← ya hay DOM: aquí van las peticiones y las librerías
        ↓
  ...vive, y cada cambio dispara onBeforeUpdate / onUpdated...
        ↓
  onBeforeUnmount ← todavía existe: momento de limpiar
        ↓
  onUnmounted     ← ya no está
```

Lo que se usa el 95% del tiempo:

```ts
onMounted(async () => {
  datos.value = await api.traer();          // cargar datos
  grafico = new Chart(canvas.value!, ...);  // inicializar una librería
  window.addEventListener('resize', alRedimensionar);
});

onUnmounted(() => {
  window.removeEventListener('resize', alRedimensionar);   // ¡limpiar!
  clearInterval(idIntervalo);
  grafico?.destroy();
});
```

> ⚠ **Todo lo que enciendas hay que apagarlo en `onUnmounted`**: intervalos,
> listeners de `window`, WebSockets, suscripciones. Si no, siguen corriendo
> aunque cambies de pantalla, y con el tiempo la app se pone lenta o se
> comporta raro. Es la fuga de memoria más común en Vue.

---

## 46.2 · ¿Dónde cargo los datos?

```ts
// Opción A: en el cuerpo del script (arranca antes, no espera al DOM)
const { datos, cargar } = useDatos();
cargar();

// Opción B: en onMounted (lo más habitual y lo más claro)
onMounted(cargar);

// Opción C: con watch immediate, si depende de una prop o de la ruta
watch(() => props.id, cargar, { immediate: true });
```

Las tres son correctas. La C es la que hay que usar cuando el id puede cambiar
**sin** que el componente se vuelva a crear (pasa al navegar de `/pedido/1` a
`/pedido/2`).

---

## 46.3 · Template refs: llegar a un elemento real

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const campo = ref<HTMLInputElement | null>(null);

onMounted(() => {
  campo.value?.focus();       // recién aquí existe el elemento
});
</script>

<template>
  <input ref="campo" />       <!-- el atributo ref, con el MISMO nombre -->
</template>
```

Tres reglas:

1. El nombre del `ref="campo"` tiene que coincidir con el de la variable.
2. Antes de `onMounted` vale `null`: por eso se tipa `| null` y se usa `?.`.
3. Se tipa con el elemento concreto (`HTMLInputElement`, `HTMLCanvasElement`,
   `HTMLDivElement`) para tener autocompletado.

**Refs dentro de un `v-for`** — Vue los junta en un array:

```vue
<script setup lang="ts">
const filas = ref<HTMLElement[]>([]);
</script>

<template>
  <li v-for="i in items" :key="i.id" ref="filas">{{ i.nombre }}</li>
</template>
```

> En Vue 3.5+ existe `useTemplateRef('campo')`, que evita tener que repetir el
> nombre. Si el proyecto es anterior, se usa la forma de arriba.

---

## 46.4 · Ref a un componente hijo

```vue
<script setup lang="ts">
import Formulario from '@/components/Formulario.vue';

const form = ref<InstanceType<typeof Formulario> | null>(null);

function enviar() {
  form.value?.validar();      // llamo a un método del hijo
}
</script>

<template>
  <Formulario ref="form" />
</template>
```

Para que el padre pueda llamar algo del hijo, el hijo tiene que **exponerlo**:

```vue
<!-- Formulario.vue -->
<script setup lang="ts">
function validar() { ... }
function limpiar() { ... }

defineExpose({ validar, limpiar });   // sin esto, el padre no ve nada
</script>
```

`<script setup>` es cerrado por defecto: nada sale del componente salvo lo que
pongas en `defineExpose`. Úsalo con moderación: normalmente es mejor props +
eventos que llamar métodos del hijo.

---

## 46.5 · `nextTick` — esperar al redibujado

Vue agrupa los cambios y actualiza el DOM **después**, no en la misma línea:

```ts
mostrarCampo.value = true;
campo.value?.focus();          // ✗ todavía no existe en el DOM

await nextTick();
campo.value?.focus();          // ✓
```

```ts
import { nextTick } from 'vue';

async function agregarYBajar() {
  items.value = [...items.value, nuevo];
  await nextTick();                       // espero a que se dibuje la fila
  contenedor.value?.scrollTo({ top: contenedor.value.scrollHeight });
}
```

Si te encuentras poniendo un `setTimeout(..., 0)` para que "funcione", lo que
querías era `await nextTick()`.

---

## 46.6 · Un ejemplo con todo junto

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const mensajes = ref<string[]>([]);
const caja = ref<HTMLDivElement | null>(null);
const campo = ref<HTMLInputElement | null>(null);
const texto = ref('');
let idReloj: number | undefined;

onMounted(() => {
  campo.value?.focus();
  idReloj = window.setInterval(() => {
    mensajes.value = [...mensajes.value, `tic ${new Date().toLocaleTimeString()}`];
  }, 3000);
});

onUnmounted(() => {
  if (idReloj) clearInterval(idReloj);     // limpiar SIEMPRE
});

async function enviar() {
  if (!texto.value.trim()) return;
  mensajes.value = [...mensajes.value, texto.value];
  texto.value = '';
  await nextTick();                        // espero la nueva fila
  caja.value?.scrollTo({ top: caja.value.scrollHeight });
}
</script>

<template>
  <div ref="caja" class="caja" style="max-height: 200px; overflow: auto">
    <p v-for="(m, i) in mensajes" :key="i">{{ m }}</p>
  </div>

  <form @submit.prevent="enviar">
    <input ref="campo" v-model="texto" placeholder="Escribe algo" />
    <button type="submit">Enviar</button>
  </form>
</template>
```

---

## Ejercicios

**E1.** Escribe el hook que se ejecuta cuando el componente ya está en pantalla.

**E2.** Escribe el hook que se ejecuta al destruirse.

**E3.** Carga datos con `await api.traer()` al montar el componente.

**E4.** Declara un template ref para un `<input>`, tipado y empezando en null.

**E5.** Escribe el `ref="..."` correspondiente en el template.

**E6.** Pon el foco en ese input cuando el componente se monte.

**E7.** Registra un listener de `resize` en `window` al montar y quítalo al
destruir. Escribe las dos partes.

**E8.** Crea un intervalo de 1 segundo al montar y cancélalo al destruir.

**E9.** ¿Qué está mal aquí?
```ts
const campo = ref<HTMLInputElement | null>(null);
campo.value.focus();
```

**E10.** Acabas de agregar un elemento a una lista y quieres hacer scroll hasta
él. Escribe las dos líneas clave.

**E11.** El padre quiere llamar al método `limpiar()` del hijo. Escribe lo que
va en el hijo y lo que va en el padre.

**E12.** Tienes una vista de detalle `/pedido/:id`. Al navegar de `/pedido/1` a
`/pedido/2` no se recargan los datos. ¿Por qué y cómo se arregla?

---

## Soluciones

**E1.** `onMounted(() => { ... });`

**E2.** `onUnmounted(() => { ... });`

**E3.**
```ts
onMounted(async () => {
  datos.value = await api.traer();
});
```

**E4.** `const campo = ref<HTMLInputElement | null>(null);`

**E5.** `<input ref="campo" />`

**E6.**
```ts
onMounted(() => { campo.value?.focus(); });
```

**E7.**
```ts
function alRedimensionar() { ancho.value = window.innerWidth; }

onMounted(() => window.addEventListener('resize', alRedimensionar));
onUnmounted(() => window.removeEventListener('resize', alRedimensionar));
```
(tiene que ser **la misma función** en los dos lados)

**E8.**
```ts
let id: number | undefined;
onMounted(() => { id = window.setInterval(tic, 1000); });
onUnmounted(() => { if (id) clearInterval(id); });
```

**E9.** Fuera de `onMounted` el ref todavía es `null`: revienta con *"Cannot
read properties of null"*. Va dentro de `onMounted` y con `?.`.

**E10.**
```ts
await nextTick();
contenedor.value?.scrollTo({ top: contenedor.value.scrollHeight });
```

**E11.**
```ts
// hijo
defineExpose({ limpiar });
```
```vue
<!-- padre -->
<Formulario ref="form" />
```
```ts
const form = ref<InstanceType<typeof Formulario> | null>(null);
form.value?.limpiar();
```

**E12.** Porque el componente se **reutiliza** al cambiar solo el parámetro: no
se vuelve a montar, así que `onMounted` no corre otra vez. Se arregla con:
```ts
watch(() => route.params.id, cargar, { immediate: true });
```
