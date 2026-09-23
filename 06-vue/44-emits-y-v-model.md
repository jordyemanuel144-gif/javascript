# 44 · Eventos (`emit`) y `v-model` en componentes

> **Nivel 6 · Vue**
> Las props bajan, los eventos suben. Esta lección es la mitad que falta de la
> comunicación entre componentes.

---

## 44.1 · Emitir eventos

```vue
<!-- Hijo.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  guardar: [id: number];              // evento con un dato
  borrar: [id: number, forzar: boolean];  // con dos
  cerrar: [];                         // sin datos
}>();

function alHacerClic() {
  emit('guardar', 7);
}
</script>

<template>
  <button @click="alHacerClic">Guardar</button>
  <button @click="emit('cerrar')">Cerrar</button>
</template>
```

```vue
<!-- Padre.vue -->
<template>
  <Hijo @guardar="alGuardar" @borrar="alBorrar" @cerrar="visible = false" />
</template>

<script setup lang="ts">
function alGuardar(id: number) { console.log('guardar', id); }
function alBorrar(id: number, forzar: boolean) { ... }
</script>
```

* En el hijo el evento se llama `guardar`; en el padre se escucha con
  `@guardar`.
* La sintaxis `{ evento: [tipo, tipo] }` es una tupla con los argumentos. Con
  eso TypeScript tipa el handler del padre automáticamente.
* Nombres: en el `emit` se usa camelCase (`actualizarTotal`) y en el template
  del padre funciona tanto `@actualizarTotal` como `@actualizar-total`.

> ⚠ Un evento que nadie escucha no falla: simplemente no pasa nada. Si tu
> handler no se ejecuta, revisa que el nombre coincida exactamente.

---

## 44.2 · El flujo completo

```
   Padre                                  Hijo
   ─────                                  ────
   :titulo="x"        ──── props ───▶     props.titulo   (solo lectura)

   @guardar="fn"      ◀─── emit ─────     emit('guardar', dato)
```

Esa es toda la comunicación directa entre padre e hijo. Cuando dos componentes
lejanos necesitan hablar, la respuesta no es encadenar diez props: es un store
(tema 48) o `provide/inject` (tema 51).

---

## 44.3 · `v-model` en un componente propio

`v-model` sobre un componente es azúcar de una prop + un evento:

```vue
<MiInput v-model="nombre" />

<!-- equivale a -->
<MiInput :modelValue="nombre" @update:modelValue="nombre = $event" />
```

Así se implementa el hijo (forma clásica, funciona en cualquier versión de Vue 3):

```vue
<!-- MiInput.vue -->
<script setup lang="ts">
interface Props { modelValue: string }
defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [valor: string];
}>();

function alEscribir(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>

<template>
  <input :value="modelValue" @input="alEscribir" />
</template>
```

---

## 44.4 · `defineModel` — la forma corta (Vue 3.4+)

```vue
<!-- MiInput.vue -->
<script setup lang="ts">
const valor = defineModel<string>();          // ¡eso es todo!
</script>

<template>
  <input v-model="valor" />
</template>
```

`defineModel` declara la prop y el evento por ti, y devuelve un ref que puedes
leer y escribir. Con opciones:

```ts
const valor = defineModel<string>({ required: true });
const contador = defineModel<number>({ default: 0 });
```

Y varios `v-model` en el mismo componente:

```vue
<!-- hijo -->
<script setup lang="ts">
const nombre = defineModel<string>('nombre');
const edad = defineModel<number>('edad');
</script>

<!-- padre -->
<Formulario v-model:nombre="persona.nombre" v-model:edad="persona.edad" />
```

> Si el proyecto del trabajo es Vue 3.3 o anterior, `defineModel` no existe y
> hay que usar la forma de 44.3. Míralo en el `package.json`.

---

## 44.5 · Un caso real: modal con confirmación

```vue
<!-- ModalConfirmar.vue -->
<script setup lang="ts">
interface Props {
  titulo: string;
  mensaje?: string;
}
withDefaults(defineProps<Props>(), { mensaje: '¿Seguro?' });

const abierto = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  confirmar: [];
  cancelar: [];
}>();

function confirmar() {
  emit('confirmar');
  abierto.value = false;
}
function cancelar() {
  emit('cancelar');
  abierto.value = false;
}
</script>

<template>
  <div v-if="abierto" class="fondo" @click.self="cancelar">
    <div class="modal">
      <h3>{{ titulo }}</h3>
      <p>{{ mensaje }}</p>
      <button @click="cancelar">Cancelar</button>
      <button @click="confirmar">Confirmar</button>
    </div>
  </div>
</template>
```

```vue
<!-- el padre -->
<script setup lang="ts">
const mostrarModal = ref(false);
function borrarDeVerdad() { ... }
</script>

<template>
  <button @click="mostrarModal = true">Borrar</button>

  <ModalConfirmar
    v-model="mostrarModal"
    titulo="Borrar pedido"
    mensaje="Esta acción no se puede deshacer."
    @confirmar="borrarDeVerdad"
  />
</template>
```

Fíjate en `@click.self="cancelar"`: cierra solo si el clic fue en el fondo
oscuro, no si fue dentro del modal.

---

## 44.6 · Validar antes de emitir

```ts
const emit = defineEmits<{ guardar: [datos: Formulario] }>();

function alEnviar() {
  if (!formulario.value.email) {
    error.value = 'Falta el email';
    return;                       // no emito nada
  }
  emit('guardar', formulario.value);
}
```

El hijo valida su propio formulario; el padre solo se entera cuando hay datos
válidos. Es una división de responsabilidades que se agradece cuando la
pantalla crece.

---

## Ejercicios

**E1.** Declara un `emit` con un evento `cerrar` sin datos.

**E2.** Declara un `emit` con `seleccionar` que lleva un `id: number`.

**E3.** Emite ese evento con el id 5.

**E4.** En el padre, escucha `seleccionar` con la función `alSeleccionar`.

**E5.** Declara un `emit` con dos eventos: `guardar` (lleva un objeto
`Usuario`) y `cancelar` (sin datos).

**E6.** ¿A qué prop y a qué evento equivale `<MiInput v-model="x" />`?

**E7.** Implementa `MiInput` con la forma clásica (prop `modelValue` + evento
`update:modelValue`).

**E8.** Implementa lo mismo con `defineModel`.

**E9.** Escribe un componente `Contador` con `defineModel<number>` y dos
botones (+1 y −1).

**E10.** En el padre, usa ese `Contador` atado a la variable `cantidad`.

**E11.** Un componente tiene dos v-model: `nombre` y `edad`. Escribe la línea
del padre.

**E12.** El hijo tiene una prop `total` y quiere aumentarla al hacer clic.
Explica por qué no puede y escribe la solución completa (hijo y padre).

---

## Soluciones

**E1.** `const emit = defineEmits<{ cerrar: [] }>();`

**E2.** `const emit = defineEmits<{ seleccionar: [id: number] }>();`

**E3.** `emit('seleccionar', 5);`

**E4.** `<Hijo @seleccionar="alSeleccionar" />`

**E5.**
```ts
const emit = defineEmits<{
  guardar: [usuario: Usuario];
  cancelar: [];
}>();
```

**E6.** A la prop `modelValue` y al evento `update:modelValue`.

**E7.**
```vue
<script setup lang="ts">
defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

**E8.**
```vue
<script setup lang="ts">
const valor = defineModel<string>();
</script>

<template>
  <input v-model="valor" />
</template>
```

**E9.**
```vue
<script setup lang="ts">
const valor = defineModel<number>({ default: 0 });
</script>

<template>
  <button @click="valor!--">-1</button>
  <span>{{ valor }}</span>
  <button @click="valor!++">+1</button>
</template>
```
(el `!` es porque `defineModel` sin `required` puede ser `undefined`; con
`{ required: true }` no hace falta)

**E10.** `<Contador v-model="cantidad" />`

**E11.** `<Formulario v-model:nombre="persona.nombre" v-model:edad="persona.edad" />`

**E12.** No puede porque las props son de solo lectura: el dueño del dato es el
padre.

```vue
<!-- hijo -->
<script setup lang="ts">
const props = defineProps<{ total: number }>();
const emit = defineEmits<{ 'update:total': [v: number] }>();
</script>

<template>
  <button @click="emit('update:total', props.total + 1)">+1</button>
</template>
```

```vue
<!-- padre -->
<Hijo :total="total" @update:total="total = $event" />
<!-- o directamente:  <Hijo v-model:total="total" /> -->
```
