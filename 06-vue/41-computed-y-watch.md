# 41 · `computed` y `watch`

> **Nivel 6 · Vue**
> Dos herramientas que se confunden todo el tiempo.
> **`computed` = calcular un valor. `watch` = reaccionar con un efecto.**

---

## 41.1 · `computed` — un valor derivado de otros

```ts
import { ref, computed } from 'vue';

const precio = ref(100);
const cantidad = ref(2);

const total = computed(() => precio.value * cantidad.value);

total.value;       // 200  (en el script, con .value como cualquier ref)
```

```vue
<template>
  <p>Total: {{ total }}</p>    <!-- sin .value -->
</template>
```

Tres cosas que hay que saber:

1. **Se recalcula solo** cuando cambia alguna de las cosas que usa adentro.
2. **Cachea**: si lo usas 5 veces en el template, se calcula una sola vez.
3. **Debe ser puro**: solo calcular y devolver. Nada de llamar a la API,
   modificar otros refs ni escribir en `localStorage` (para eso está `watch`).

Los casos de siempre:

```ts
const visibles = computed(() =>
  productos.value.filter(p => p.activo),
);

const nombreCompleto = computed(() => `${nombre.value} ${apellido.value}`);

const hayErrores = computed(() => Object.keys(errores.value).length > 0);

const totalCarrito = computed(() =>
  carrito.value.reduce((t, i) => t + i.precio * i.cantidad, 0),
);
```

> ⚠ Un `computed` **no recibe parámetros**. Si necesitas pasarle algo, lo que
> quieres es una función normal, o un computed que devuelve una función:
> ```ts
> const porId = computed(() => (id: number) => items.value.find(i => i.id === id));
> // en el template: {{ porId(3) }}
> ```

---

## 41.2 · `computed` vs método vs `ref`

```vue
<template>
  <p>{{ total }}</p>          <!-- computed: cachea, se recalcula solo -->
  <p>{{ calcularTotal() }}</p><!-- método: se ejecuta en CADA redibujado -->
</template>
```

| Necesitas | Usa |
|---|---|
| Un valor que depende de otros | `computed` |
| Hacer algo cuando el usuario actúa | una función normal (`@click`) |
| Un dato propio que tú cambias | `ref` |
| Disparar un efecto ante un cambio | `watch` |

**Señal de que estás usando la herramienta equivocada:** si tienes un `watch`
que lo único que hace es asignar otro `ref`, eso era un `computed`.

```ts
// ✗ complicado y propenso a desincronizarse
const total = ref(0);
watch([precio, cantidad], () => { total.value = precio.value * cantidad.value; });

// ✓ una línea
const total = computed(() => precio.value * cantidad.value);
```

---

## 41.3 · `computed` con get y set

Por defecto un computed es de solo lectura. Si necesitas que sea escribible:

```ts
const nombre = ref('Ana');
const apellido = ref('Pérez');

const completo = computed({
  get: () => `${nombre.value} ${apellido.value}`,
  set: (valor: string) => {
    const [n, a] = valor.split(' ');
    nombre.value = n ?? '';
    apellido.value = a ?? '';
  },
});

completo.value = 'Eva Díaz';    // dispara el set
```

Se usa sobre todo para hacer `v-model` sobre algo calculado, y para envolver el
estado de un store en un formulario.

---

## 41.4 · `watch` — reaccionar a un cambio

```ts
import { watch } from 'vue';

watch(busqueda, (nuevo, anterior) => {
  console.log(`cambió de ${anterior} a ${nuevo}`);
});
```

Formas de la primera parte (la "fuente"):

```ts
watch(unRef, cb);                       // un ref
watch(() => props.id, cb);              // una prop → SIEMPRE con función
watch(() => estado.campo, cb);          // un campo de un reactive
watch([a, b], ([nuevoA, nuevoB]) => {}); // varias cosas a la vez
```

Opciones:

```ts
watch(filtros, cargar, {
  immediate: true,   // ejecuta también ahora mismo, no solo al cambiar
  deep: true,        // mira DENTRO del objeto, no solo la referencia
});
```

> ⚠ **`watch` sobre un objeto no se dispara si mutas por dentro**, porque la
> referencia no cambió (tema 16.6). Ahí hace falta `deep: true` — que es más
> lento, así que úsalo solo si hace falta.

Para qué se usa de verdad:

```ts
// buscar cuando el usuario cambia el filtro
watch(busqueda, async (texto) => {
  resultados.value = await api.buscar(texto);
});

// guardar en localStorage cada vez que cambia el carrito
watch(carrito, (c) => {
  localStorage.setItem('carrito', JSON.stringify(c));
}, { deep: true });

// recargar al cambiar de ruta (el id de la URL)
watch(() => route.params.id, cargar, { immediate: true });
```

---

## 41.5 · `watchEffect` — el que se suscribe solo

```ts
import { watchEffect } from 'vue';

watchEffect(() => {
  console.log(`${nombre.value} tiene ${edad.value} años`);
});
```

No le dices qué observar: observa **todo lo que uses adentro**, y se ejecuta
una primera vez de entrada.

| | `watch` | `watchEffect` |
|---|---|---|
| Fuente | explícita | automática |
| Primera ejecución | no (salvo `immediate`) | sí, siempre |
| Valor anterior | sí | no |
| Cuándo usarlo | cuando sabes exactamente qué observas | efectos con varias dependencias |

En la práctica, `watch` es más predecible y es el que verás más.

---

## 41.6 · Limpiar un watch

```ts
// detenerlo a mano
const parar = watch(busqueda, cargar);
parar();

// cancelar lo anterior al volver a dispararse (ideal para peticiones)
watch(busqueda, async (texto, _viejo, onCleanup) => {
  const ctrl = new AbortController();
  onCleanup(() => ctrl.abort());        // se llama al próximo cambio
  const r = await fetch(`/api/buscar?q=${texto}`, { signal: ctrl.signal });
  resultados.value = await r.json();
});
```

Un watch creado dentro de `<script setup>` se detiene solo cuando el componente
se destruye. Si lo creas dentro de una función asíncrona o un `setTimeout`, no:
ahí sí hay que pararlo a mano.

---

## Ejercicios

**E1.** Con `precio` y `cantidad` como refs, escribe el computed `total`.

**E2.** Con `productos` (ref de array), escribe el computed `disponibles` que
deja solo los que tienen `stock > 0`.

**E3.** Escribe el computed `hayResultados` que es true si `resultados.length`
es mayor que 0.

**E4.** Con `nombre` y `apellido`, escribe el computed `iniciales` que devuelve
`"A.P."` para "Ana Pérez".

**E5.** Escribe un computed que ordene `items` por `nombre` **sin mutar** el
array original.

**E6.** Escribe un watch que imprima el valor anterior y el nuevo de
`busqueda`.

**E7.** Escribe un watch sobre `props.id` que llame a `cargar()` y que además
se ejecute la primera vez.

**E8.** Escribe un watch sobre el objeto `formulario` que detecte cambios en
sus campos internos.

**E9.** Escribe un watch que guarde `carrito` en localStorage cada vez que
cambie.

**E10.** Reescribe esto como corresponde:
```ts
const total = ref(0);
watch([precio, cantidad], () => {
  total.value = precio.value * cantidad.value;
});
```

**E11.** Escribe un computed con get y set: `completo` se lee como
`"nombre apellido"` y al asignarlo parte el texto en los dos refs.

**E12.** ¿`computed` o `watch`? Elige para cada caso:
1. Mostrar el total del carrito
2. Guardar en la base cada vez que cambia el estado de un pedido
3. Filtrar una tabla por lo que se escribe en un input
4. Mostrar un cartel cuando el stock llega a 0
5. Formatear una fecha para mostrarla

---

## Soluciones

**E1.** `const total = computed(() => precio.value * cantidad.value);`

**E2.** `const disponibles = computed(() => productos.value.filter(p => p.stock > 0));`

**E3.** `const hayResultados = computed(() => resultados.value.length > 0);`

**E4.**
```ts
const iniciales = computed(() => `${nombre.value[0]}.${apellido.value[0]}.`);
```

**E5.**
```ts
const ordenados = computed(() =>
  [...items.value].sort((a, b) => a.nombre.localeCompare(b.nombre)),
);
```

**E6.**
```ts
watch(busqueda, (nuevo, anterior) => {
  console.log(anterior, '->', nuevo);
});
```

**E7.** `watch(() => props.id, cargar, { immediate: true });`

**E8.** `watch(formulario, guardar, { deep: true });`

**E9.**
```ts
watch(carrito, (c) => {
  localStorage.setItem('carrito', JSON.stringify(c));
}, { deep: true });
```

**E10.** Era un computed:
```ts
const total = computed(() => precio.value * cantidad.value);
```

**E11.**
```ts
const completo = computed({
  get: () => `${nombre.value} ${apellido.value}`,
  set: (v: string) => {
    const [n, a] = v.split(' ');
    nombre.value = n ?? '';
    apellido.value = a ?? '';
  },
});
```

**E12.** 1 → computed · 2 → watch · 3 → computed · 4 → watch (si es para
disparar un aviso o un pedido; si es solo mostrar texto en pantalla, computed)
· 5 → computed
