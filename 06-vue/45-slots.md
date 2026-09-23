# 45 · Slots

> **Nivel 6 · Vue**
> Las props pasan **datos**. Los slots pasan **HTML**. Es lo que convierte un
> componente rígido en uno reutilizable de verdad.

---

## 45.1 · El slot por defecto

```vue
<!-- Tarjeta.vue -->
<template>
  <div class="tarjeta">
    <slot />          <!-- aquí entra lo que ponga el padre -->
  </div>
</template>
```

```vue
<!-- el padre -->
<Tarjeta>
  <h3>Título</h3>
  <p>Lo que se me ocurra, con cualquier etiqueta.</p>
</Tarjeta>
```

Contenido por defecto (se usa solo si el padre no pone nada):

```vue
<slot>Sin contenido</slot>
```

**La diferencia con una prop:**

```vue
<Tarjeta titulo="Hola" />           <!-- prop: solo texto -->
<Tarjeta><h3>Hola</h3></Tarjeta>    <!-- slot: HTML, componentes, lo que sea -->
```

---

## 45.2 · Slots con nombre

```vue
<!-- Panel.vue -->
<template>
  <div class="panel">
    <header><slot name="cabecera">Sin título</slot></header>
    <main><slot /></main>                     <!-- el "default" -->
    <footer><slot name="pie" /></footer>
  </div>
</template>
```

```vue
<Panel>
  <template #cabecera>
    <h2>Resumen del mes</h2>
  </template>

  <p>Este contenido va al slot por defecto.</p>

  <template #pie>
    <button>Cerrar</button>
  </template>
</Panel>
```

* `#cabecera` es el atajo de `v-slot:cabecera`.
* El contenido suelto (sin `<template #...>`) va al slot por defecto.
* Un slot sin contenido ni respaldo no dibuja nada: no molesta.

Para saber si un slot trae algo (y no dibujar el `<footer>` vacío):

```vue
<script setup lang="ts">
import { useSlots } from 'vue';
const slots = useSlots();
</script>

<template>
  <footer v-if="slots.pie"><slot name="pie" /></footer>
</template>
```

---

## 45.3 · Slots con datos (scoped slots)

Aquí está la parte potente: el **hijo** le pasa datos al HTML que escribe el
**padre**.

```vue
<!-- Lista.vue -->
<script setup lang="ts">
interface Props { items: Producto[] }
defineProps<Props>();
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- le paso el item y el índice a quien me use -->
      <slot name="fila" :item="item" :indice="items.indexOf(item)">
        {{ item.nombre }}      <!-- por si el padre no personaliza nada -->
      </slot>
    </li>
  </ul>
</template>
```

```vue
<!-- el padre decide CÓMO se ve cada fila -->
<Lista :items="productos">
  <template #fila="{ item, indice }">
    <strong>{{ indice + 1 }}. {{ item.nombre }}</strong>
    <span class="tenue"> — S/ {{ item.precio }}</span>
    <button @click="borrar(item.id)">Borrar</button>
  </template>
</Lista>
```

El componente `Lista` se encarga del `v-for`, el `:key` y el estado vacío; el
padre solo dice cómo pintar una fila. Así funcionan por dentro las tablas de
Vuetify, PrimeVue o Element Plus:

```vue
<DataTable :value="pedidos">
  <Column field="estado" header="Estado">
    <template #body="{ data }">
      <Etiqueta :color="colorDe(data.estado)" />
    </template>
  </Column>
</DataTable>
```

Cuando veas `#body="{ data }"` ya sabes exactamente qué está pasando.

---

## 45.4 · Cuándo prop y cuándo slot

| Situación | Solución |
|---|---|
| Un texto, un número, un booleano | prop |
| Contenido que cambia de forma según quién lo use | slot |
| Una estructura fija con "huecos" (layout) | slots con nombre |
| Una lista donde cada fila se dibuja distinto | scoped slot |
| Un ícono opcional al lado del texto | slot con nombre |

Regla práctica: si te encuentras agregando props del tipo `mostrarIcono`,
`textoBoton`, `htmlExtra`… probablemente querías un slot.

---

## 45.5 · Un layout con slots

```vue
<!-- LayoutPagina.vue -->
<script setup lang="ts">
interface Props { titulo: string }
defineProps<Props>();
</script>

<template>
  <section>
    <header class="cabecera">
      <h1>{{ titulo }}</h1>
      <div class="acciones"><slot name="acciones" /></div>
    </header>

    <slot />

    <footer v-if="$slots.pie"><slot name="pie" /></footer>
  </section>
</template>
```

```vue
<LayoutPagina titulo="Pedidos">
  <template #acciones>
    <button @click="nuevo">Nuevo pedido</button>
    <button @click="exportar">Exportar</button>
  </template>

  <TablaPedidos :items="pedidos" />

  <template #pie>
    <p class="tenue">{{ pedidos.length }} pedidos en total</p>
  </template>
</LayoutPagina>
```

`$slots` está disponible en el template sin importar nada.

---

## Ejercicios

**E1.** Escribe un componente `Caja` que dibuje un `<div class="caja">` con el
contenido que le pase el padre.

**E2.** Agrega un contenido por defecto `"(vacío)"` a ese slot.

**E3.** Desde el padre, usa `Caja` poniéndole un `<h3>` y un `<p>`.

**E4.** Escribe un componente `Panel` con tres slots: `cabecera`, el por
defecto y `pie`.

**E5.** Úsalo desde el padre llenando los tres.

**E6.** ¿Cuál es el atajo de `v-slot:cabecera`?

**E7.** En `Panel`, haz que el `<footer>` solo se dibuje si el slot `pie` tiene
contenido.

**E8.** Escribe un componente `Repetidor` que reciba `items: string[]` y para
cada uno exponga un slot llamado `fila` con el item y su índice.

**E9.** Úsalo desde el padre mostrando `1) manzana` en negrita.

**E10.** ¿Prop o slot? 1) el título de una tarjeta, 2) los botones de acción de
una tarjeta, 3) si la tarjeta está deshabilitada, 4) cómo se ve cada fila de
una tabla.

**E11.** Lee esta línea de una librería y explica qué es cada parte:
```vue
<template #body="{ data, index }">
```

**E12.** Convierte este componente lleno de props en uno con slots:
```vue
<Alerta titulo="Error" texto="Falló" textoBoton="Reintentar" mostrarBoton />
```

---

## Soluciones

**E1.**
```vue
<template>
  <div class="caja"><slot /></div>
</template>
```

**E2.** `<slot>(vacío)</slot>`

**E3.**
```vue
<Caja>
  <h3>Título</h3>
  <p>Contenido</p>
</Caja>
```

**E4.**
```vue
<template>
  <div class="panel">
    <header><slot name="cabecera" /></header>
    <main><slot /></main>
    <footer><slot name="pie" /></footer>
  </div>
</template>
```

**E5.**
```vue
<Panel>
  <template #cabecera><h2>Título</h2></template>
  <p>Cuerpo</p>
  <template #pie><button>Cerrar</button></template>
</Panel>
```

**E6.** `#cabecera`

**E7.** `<footer v-if="$slots.pie"><slot name="pie" /></footer>`

**E8.**
```vue
<script setup lang="ts">
defineProps<{ items: string[] }>();
</script>

<template>
  <ul>
    <li v-for="(item, i) in items" :key="item">
      <slot name="fila" :item="item" :indice="i">{{ item }}</slot>
    </li>
  </ul>
</template>
```

**E9.**
```vue
<Repetidor :items="['manzana', 'pera']">
  <template #fila="{ item, indice }">
    <strong>{{ indice + 1 }}) {{ item }}</strong>
  </template>
</Repetidor>
```

**E10.** 1 → prop · 2 → slot · 3 → prop · 4 → scoped slot

**E11.** `#body` es el nombre del slot (`v-slot:body`); `{ data, index }` es la
desestructuración de los datos que el componente hijo le pasa a ese slot: en
este caso la fila actual y su posición.

**E12.**
```vue
<Alerta titulo="Error">
  Falló
  <template #acciones>
    <button @click="reintentar">Reintentar</button>
  </template>
</Alerta>
```
