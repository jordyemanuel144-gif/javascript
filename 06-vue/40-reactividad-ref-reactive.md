# 40 · Reactividad: `ref` y `reactive`

> **Nivel 6 · Vue**
> "Reactivo" significa: si el dato cambia, la pantalla se redibuja sola. Este
> es el corazón de Vue y el origen del 80% de los "no se actualiza".

---

## 40.1 · `ref` — el que vas a usar siempre

```ts
import { ref } from 'vue';

const contador = ref(0);
const nombre = ref('Ana');
const usuario = ref<Usuario | null>(null);
const items = ref<string[]>([]);

contador.value++;            // en el SCRIPT: con .value
items.value = [...items.value, 'nuevo'];
```

```vue
<template>
  <p>{{ contador }}</p>      <!-- en el TEMPLATE: sin .value -->
</template>
```

`ref` envuelve el valor en un objeto con una propiedad `.value`. Ese envoltorio
es lo que le permite a Vue enterarse de los cambios.

**Por qué `.value`:** JavaScript no puede detectar cuando reasignas una
variable suelta (`let n = 0; n = 1;` no avisa a nadie). Pero sí puede detectar
el acceso a una propiedad. Por eso el valor vive dentro de `.value`.

> ⚠ **El error número uno de todo Vue 3**: olvidarse el `.value` en el script.
>
> ```ts
> const n = ref(0);
> n++;                // ✗ no hace nada útil (y TS te avisa)
> n.value++;          // ✓
>
> if (usuario) {}           // ✗ un ref SIEMPRE es truthy, hasta si vale null
> if (usuario.value) {}     // ✓
> ```

`ref` funciona con cualquier cosa: números, textos, booleanos, objetos, arrays.

---

## 40.2 · `reactive` — solo para objetos

```ts
import { reactive } from 'vue';

const estado = reactive({
  nombre: 'Ana',
  edad: 30,
  direccion: { ciudad: 'Lima' },
});

estado.nombre = 'Eva';        // sin .value
estado.direccion.ciudad = 'Cusco';   // también funciona: es profundo
```

Se ve más cómodo… hasta que aparecen sus tres límites:

```ts
// 1) NO funciona con primitivos
const n = reactive(0);              // ✗ no sirve

// 2) Se ROMPE al reasignar el objeto entero
let estado = reactive({ a: 1 });
estado = { a: 2 };                  // ✗ la pantalla no se entera

// 3) Se ROMPE al desestructurar
const { nombre } = estado;          // ✗ `nombre` ya no es reactivo
```

**La recomendación oficial y la de la mayoría de equipos: usa `ref` para todo.**
`reactive` solo cuando de verdad convenga agrupar un formulario, y con cuidado.

| | `ref` | `reactive` |
|---|---|---|
| Primitivos | ✅ | ❌ |
| Objetos y arrays | ✅ | ✅ |
| Reasignar entero | ✅ `x.value = {...}` | ❌ se rompe |
| Desestructurar | ⚠ con `toRefs` | ❌ se rompe |
| En el script | `.value` | directo |
| En el template | directo | directo |

---

## 40.3 · Objetos y arrays dentro de un `ref`

```ts
const usuario = ref({ nombre: 'Ana', edad: 30 });

usuario.value.edad = 31;              // ✓ funciona: ref es profundo
usuario.value = { nombre: 'Eva', edad: 25 };   // ✓ reemplazar entero también
```

Con arrays valen las dos formas:

```ts
const items = ref<string[]>([]);

items.value.push('a');                 // ✓ Vue detecta push/splice/etc.
items.value = [...items.value, 'a'];   // ✓ y también reemplazar (más seguro)
```

Los patrones inmutables del tema 16 se aplican igual:

```ts
// agregar
items.value = [...items.value, nuevo];
// quitar
items.value = items.value.filter(i => i.id !== id);
// editar uno
items.value = items.value.map(i => i.id === id ? { ...i, hecho: true } : i);
```

> ⚠ Lo que **no** funciona nunca: cambiar una variable que no es reactiva.
> ```ts
> let total = 0;          // ✗ una variable normal: el template no se entera
> const total = ref(0);   // ✓
> ```

---

## 40.4 · `toRef`, `toRefs` y `storeToRefs`

Desestructurar un objeto reactivo rompe la reactividad. Para arreglarlo:

```ts
const estado = reactive({ nombre: 'Ana', edad: 30 });

const { nombre } = estado;          // ✗ se rompe
const { nombre } = toRefs(estado);  // ✓ `nombre` es un Ref<string>
nombre.value = 'Eva';               // y cambia el estado original

const edad = toRef(estado, 'edad'); // ✓ un solo campo
```

Con Pinia el equivalente es `storeToRefs` (tema 48):

```ts
const store = useUsuarioStore();
const { nombre } = store;              // ✗ pierde la reactividad
const { nombre } = storeToRefs(store); // ✓
const { guardar } = store;             // ✓ las ACCIONES se sacan directo
```

---

## 40.5 · Otros refs que verás

```ts
shallowRef(objetoGrande)   // solo reacciona al reemplazo del objeto entero,
                           // no a los cambios internos. Para datos grandes.
readonly(estado)           // versión de solo lectura (para exponer sin dejar tocar)
isRef(x)                   // ¿es un ref?
unref(x)                   // x.value si es ref, si no x tal cual
toRaw(x)                   // el objeto original, sin el envoltorio reactivo
```

El más útil de la lista en el día a día es `readonly`, para devolver estado
desde un composable sin que nadie lo modifique desde afuera.

---

## 40.6 · Cuándo la pantalla NO se actualiza (checklist)

Cuando algo "no se refresca", revisa en este orden:

1. ¿Te olvidaste el `.value`?
2. ¿La variable es un `ref` o es un `let` normal?
3. ¿Desestructuraste un `reactive` o un store sin `storeToRefs`?
4. ¿Reasignaste un objeto `reactive` entero?
5. ¿Estás mutando una **prop**? (las props son de solo lectura, tema 43)
6. ¿El `v-for` tiene `:key` y es única? (tema 42)
7. ¿Estás modificando una copia en vez del original?

---

## Ejercicios

**E1.** Declara un ref para un contador que empieza en 0, y otro para un texto
vacío.

**E2.** Declara un ref que puede ser un `Usuario` o `null`, empezando en `null`.

**E3.** Declara un ref con un array vacío de `Producto`.

**E4.** Escribe la función `subir()` que incrementa el contador de E1.

**E5.** Corrige:
```ts
const n = ref(0);
function subir() { n++; }
```

**E6.** Corrige:
```ts
const usuario = ref<Usuario | null>(null);
if (usuario) { console.log(usuario.nombre); }
```

**E7.** Con `const items = ref<string[]>([])`, escribe la línea que agrega
`'nuevo'` **sin mutar** el array.

**E8.** Con `const items = ref<Item[]>([])`, escribe la línea que quita el item
con id 3.

**E9.** Con `const items = ref<Item[]>([])`, escribe la línea que marca como
`hecho: true` el item con id 3, sin tocar los demás.

**E10.** `const form = reactive({ nombre: '', email: '' })`. Escribe cómo
desestructurar `nombre` **sin** perder la reactividad.

**E11.** ¿Cuál de estas dos líneas se rompe y por qué?
```ts
let estado = reactive({ a: 1 });
estado.a = 2;
estado = { a: 3 };
```

**E12.** Escribe un componente mínimo (script + template) con un contador, un
botón para sumar y otro para reiniciar.

---

## Soluciones

**E1.**
```ts
const contador = ref(0);
const texto = ref('');
```

**E2.** `const usuario = ref<Usuario | null>(null);`

**E3.** `const productos = ref<Producto[]>([]);`

**E4.** `function subir() { contador.value++; }`

**E5.** `function subir() { n.value++; }`

**E6.**
```ts
if (usuario.value) { console.log(usuario.value.nombre); }
```
(un ref es un objeto, así que siempre es "truthy" aunque `.value` sea null)

**E7.** `items.value = [...items.value, 'nuevo'];`

**E8.** `items.value = items.value.filter(i => i.id !== 3);`

**E9.** `items.value = items.value.map(i => i.id === 3 ? { ...i, hecho: true } : i);`

**E10.**
```ts
import { toRefs } from 'vue';
const { nombre } = toRefs(form);
```

**E11.** Se rompe `estado = { a: 3 }`: reasignar el objeto entero descarta el
proxy reactivo y la pantalla deja de enterarse. Con `ref` esto no pasa
(`estado.value = { a: 3 }` sí funciona).

**E12.**
```vue
<script setup lang="ts">
import { ref } from 'vue';

const contador = ref(0);
function subir() { contador.value++; }
function reiniciar() { contador.value = 0; }
</script>

<template>
  <p>Contador: {{ contador }}</p>
  <button @click="subir">+1</button>
  <button @click="reiniciar">Reiniciar</button>
</template>
```
