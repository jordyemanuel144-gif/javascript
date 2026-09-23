# 39 · El archivo `.vue` (SFC) y `<script setup>`

> **Nivel 6 · Vue**
> Un componente Vue es un archivo con tres bloques. Esta lección es la
> gramática del archivo: qué va en cada bloque y cómo se comunican.

---

## 39.1 · Los tres bloques

```vue
<script setup lang="ts">
// 1) LA LÓGICA: imports, estado, funciones. TypeScript normal.
import { ref } from 'vue';
const nombre = ref('Ana');
function saludar() { alert(`Hola ${nombre.value}`); }
</script>

<template>
  <!-- 2) EL HTML: lo que se dibuja. Aquí se usa lo de arriba SIN .value -->
  <p>Hola {{ nombre }}</p>
  <button @click="saludar">Saludar</button>
</template>

<style scoped>
/* 3) LOS ESTILOS. `scoped` = solo afectan a ESTE componente */
p { color: steelblue; }
</style>
```

* Solo `<template>` es obligatorio en la práctica.
* `lang="ts"` es lo que activa TypeScript. Sin eso, el bloque es JS.
* `scoped` hace que Vue agregue un atributo único a los elementos y acote el
  CSS. Sin `scoped`, ese `p { color: ... }` pintaría **todos** los párrafos de
  la app.
* El orden habitual es script → template → style, pero da igual.

> ⚠ En Vue 3 un `<template>` puede tener **varios elementos raíz**. En Vue 2
> había que envolver todo en un solo div. Si ves un `<div class="wrapper">` que
> no hace nada, probablemente viene de ahí.

---

## 39.2 · Qué hace `setup` exactamente

Sin `setup`, un componente se escribe así (y así lo verás en código viejo):

```vue
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const nombre = ref('Ana');
    return { nombre };          // ← hay que devolver TODO lo que use el template
  },
});
</script>
```

Con `<script setup>`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
const nombre = ref('Ana');      // ← el template lo ve automáticamente
</script>
```

**La regla de oro:** todo lo que declares en el nivel superior de
`<script setup>` (variables, funciones, componentes importados) está
disponible en el template. No hay que exportar ni devolver nada.

Eso incluye los componentes:

```vue
<script setup lang="ts">
import Tarjeta from '@/components/Tarjeta.vue';   // ← con importarlo alcanza
</script>

<template>
  <Tarjeta />                                      <!-- ya se puede usar -->
</template>
```

---

## 39.3 · Interpolación: `{{ }}`

```vue
<template>
  <p>{{ nombre }}</p>                      <!-- una variable -->
  <p>{{ nombre.toUpperCase() }}</p>        <!-- una expresión -->
  <p>{{ edad >= 18 ? 'mayor' : 'menor' }}</p>
  <p>{{ items.length }} items</p>
  <p>{{ precio * 1.21 }}</p>
</template>
```

Dentro de `{{ }}` va **una expresión**, no instrucciones:

```vue
{{ if (x) {...} }}        <!-- ✗ no se puede -->
{{ const y = 5 }}         <!-- ✗ tampoco -->
{{ x ? 'sí' : 'no' }}     <!-- ✓ ternario sí -->
```

> ⚠ Dentro del template **no se escribe `.value`**. Vue desenvuelve los refs
> solo. En el `<script>` sí hace falta. Esta asimetría confunde al principio:
>
> ```vue
> <script setup>
> const n = ref(0);
> console.log(n.value);      // en el script: CON .value
> </script>
> <template>{{ n }}</template>   <!-- en el template: SIN .value -->
> ```

---

## 39.4 · Atributos dinámicos: `v-bind` / `:`

```vue
<template>
  <img v-bind:src="urlImagen" />
  <img :src="urlImagen" />                 <!-- atajo, es lo que se usa -->

  <a :href="`/usuarios/${id}`">Ver</a>
  <button :disabled="cargando">Guardar</button>
  <div :class="claseActiva"></div>
  <div :style="{ color: colorTexto }"></div>

  <!-- pasar varios atributos de golpe -->
  <Tarjeta v-bind="objetoConProps" />
</template>
```

La diferencia clave:

```vue
<Boton texto="hola" />        <!-- pasa el TEXTO "hola" -->
<Boton :texto="hola" />       <!-- pasa el VALOR de la variable hola -->
<Boton :veces="3" />          <!-- pasa el NÚMERO 3 -->
<Boton veces="3" />           <!-- pasa el TEXTO "3"  ← error clásico -->
```

**Clases y estilos dinámicos** (esto se usa todo el tiempo):

```vue
<div :class="{ activo: estaActivo, error: hayError }"></div>
<!-- pone la clase 'activo' si estaActivo es true -->

<div :class="[claseBase, estaActivo ? 'activo' : '']"></div>

<div :style="{ width: ancho + 'px', color: 'red' }"></div>
```

---

## 39.5 · Eventos: `v-on` / `@`

```vue
<template>
  <button v-on:click="guardar">Guardar</button>
  <button @click="guardar">Guardar</button>       <!-- atajo -->

  <button @click="contador++">Sumar</button>       <!-- expresión en línea -->
  <button @click="borrar(item.id)">Borrar</button> <!-- con argumento -->
  <button @click="manejar($event)">Con evento</button>

  <input @input="alEscribir" @blur="validar" @keyup.enter="buscar" />
  <form @submit.prevent="enviar">...</form>
</template>
```

**Modificadores** (el punto después del evento):

| Modificador | Qué hace |
|---|---|
| `.prevent` | `event.preventDefault()` — el clásico en `@submit` |
| `.stop` | `event.stopPropagation()` — corta el burbujeo |
| `.once` | se ejecuta una sola vez |
| `.self` | solo si el evento nació en ESE elemento |
| `.enter` `.esc` `.tab` | solo con esa tecla |
| `.ctrl` `.shift` | solo con esa tecla modificadora apretada |

```vue
<form @submit.prevent="guardar">   <!-- sin esto, la página se recarga -->
<div @click.self="cerrar">         <!-- cerrar el modal solo al clic en el fondo -->
<input @keyup.enter="buscar" />
```

> ⚠ `@click="guardar"` pasa la función. `@click="guardar()"` también funciona en
> el template (Vue lo envuelve), pero si necesitas el evento usa
> `@click="guardar($event)"`.

---

## 39.6 · Estilos: scoped, deep y CSS modules

```vue
<style scoped>
.titulo { font-size: 1.2rem; }         /* solo este componente */
</style>

<style>
.global { ... }                        /* toda la app: úsalo con cuidado */
</style>
```

Para pisar el estilo de un componente hijo desde el padre (típico con
librerías de UI), `scoped` no alcanza y hace falta `:deep()`:

```vue
<style scoped>
.tabla :deep(.celda) { padding: 0; }
</style>
```

También se puede usar una variable del script dentro del CSS:

```vue
<script setup lang="ts">
const color = ref('tomato');
</script>

<style scoped>
p { color: v-bind(color); }      /* cambia solo cuando cambia el ref */
</style>
```

---

## Ejercicios

> Escribe el código en `playground/src/views/Laboratorio.vue` y míralo en el
> navegador, o resuélvelos mentalmente y compara con las soluciones.

**E1.** Escribe el esqueleto de un `.vue` con los tres bloques, con TypeScript
y estilos acotados al componente.

**E2.** En el template, muestra la variable `titulo` en mayúsculas.

**E3.** Escribe un `<img>` cuyo `src` salga de la variable `foto` y cuyo `alt`
sea el texto fijo `"avatar"`.

**E4.** Escribe un botón que quede deshabilitado mientras `cargando` sea true.

**E5.** Escribe un `<div>` que tenga la clase `activo` solo cuando
`seleccionado` sea true.

**E6.** Escribe un formulario que llame a `guardar` al enviarse y **no**
recargue la página.

**E7.** Escribe un `<li>` que al hacer clic llame a `borrar(item.id)`.

**E8.** Escribe un input que llame a `buscar` solo cuando se apriete Enter.

**E9.** ¿Cuál es la diferencia entre estas dos líneas?
```vue
<Tarjeta cantidad="5" />
<Tarjeta :cantidad="5" />
```

**E10.** Corrige el error:
```vue
<script setup lang="ts">
const n = ref(0);
</script>
<template>
  <p>{{ n.value }}</p>
</template>
```

**E11.** Escribe un div que muestre el estilo con el ancho dinámico de la
variable `porcentaje` (en %).

**E12.** ¿Qué hace `@click.stop` y en qué caso real lo usarías?

---

## Soluciones

**E1.**
```vue
<script setup lang="ts">
</script>

<template>
</template>

<style scoped>
</style>
```

**E2.** `{{ titulo.toUpperCase() }}`

**E3.** `<img :src="foto" alt="avatar" />`

**E4.** `<button :disabled="cargando">Guardar</button>`

**E5.** `<div :class="{ activo: seleccionado }"></div>`

**E6.** `<form @submit.prevent="guardar"> ... </form>`

**E7.** `<li @click="borrar(item.id)">{{ item.nombre }}</li>`

**E8.** `<input @keyup.enter="buscar" />`

**E9.** La primera pasa el **texto** `"5"`; la segunda pasa el **número** `5`.
Con `:` el contenido se evalúa como expresión de JavaScript.

**E10.** En el template no se usa `.value`:
```vue
<p>{{ n }}</p>
```
(y falta `import { ref } from 'vue'`).

**E11.** `<div :style="{ width: porcentaje + '%' }"></div>`

**E12.** Es `event.stopPropagation()`: evita que el clic siga subiendo a los
elementos padres. Caso típico: un botón "Borrar" dentro de una fila que también
es clickeable — sin `.stop`, borras **y** abres el detalle.
