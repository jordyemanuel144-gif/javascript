# 42 · Directivas: `v-if`, `v-for`, `v-model` y las demás

> **Nivel 6 · Vue**
> Las directivas son los atributos que empiezan con `v-`. Con estas cinco se
> escribe el 95% de los templates.

---

## 42.1 · `v-if` / `v-else-if` / `v-else`

```vue
<template>
  <p v-if="cargando">Cargando...</p>
  <p v-else-if="error">Error: {{ error }}</p>
  <p v-else-if="items.length === 0">No hay nada que mostrar.</p>
  <ul v-else>
    <li v-for="i in items" :key="i.id">{{ i.nombre }}</li>
  </ul>
</template>
```

* `v-if` **crea y destruye** el elemento del DOM de verdad.
* Los `v-else-if` / `v-else` tienen que ir pegados al `v-if`, sin nada en medio.
* Para agrupar varios elementos sin ensuciar el HTML, se usa `<template>`:

```vue
<template v-if="esAdmin">
  <h2>Panel</h2>
  <button>Borrar todo</button>
</template>
```

Este bloque de cuatro estados (cargando / error / vacío / datos) es el patrón
que vas a repetir en cada pantalla. Escríbelo siempre completo: el caso "vacío"
es el que más se olvida y el que más se nota.

---

## 42.2 · `v-show`

```vue
<div v-show="visible">Hola</div>
```

`v-show` **no** saca el elemento: siempre está en el DOM y solo le cambia
`display: none`.

| | `v-if` | `v-show` |
|---|---|---|
| Al ser false | se borra del DOM | queda oculto |
| Costo al alternar | alto | bajísimo |
| Costo inicial | nulo si es false | siempre se renderiza |
| `v-else` | sí | no |

**Regla:** si alterna mucho (un acordeón, una pestaña), `v-show`. Si depende de
permisos o de si hay datos, `v-if`.

---

## 42.3 · `v-for` — y el `:key`

```vue
<li v-for="producto in productos" :key="producto.id">
  {{ producto.nombre }}
</li>

<!-- con índice -->
<li v-for="(producto, i) in productos" :key="producto.id">
  {{ i + 1 }}. {{ producto.nombre }}
</li>

<!-- sobre un objeto: valor, clave, índice -->
<li v-for="(valor, clave) in objeto" :key="clave">{{ clave }}: {{ valor }}</li>

<!-- un rango: 1..5 (empieza en 1, no en 0) -->
<span v-for="n in 5" :key="n">{{ n }}</span>
```

> ⚠ **`:key` es obligatorio y tiene que ser único y estable.**
>
> * `:key="producto.id"` ✓
> * `:key="i"` (el índice) ✗ — si la lista se reordena o borras un elemento del
>   medio, Vue reutiliza los nodos equivocados: checkboxes que se marcan solos,
>   inputs con el texto de otra fila. Es un bug clásico y difícil de ver.
> * sin key ✗ — Vue avisa en consola.

**No pongas `v-if` y `v-for` en el mismo elemento.** En Vue 3 el `v-if` tiene
prioridad y ni siquiera puede ver la variable del `v-for`. Las dos salidas:

```vue
<!-- ✓ filtrar con un computed (lo mejor) -->
<li v-for="p in disponibles" :key="p.id">{{ p.nombre }}</li>

<!-- ✓ o envolver con un template -->
<template v-for="p in productos" :key="p.id">
  <li v-if="p.stock > 0">{{ p.nombre }}</li>
</template>
```

---

## 42.4 · `v-model` — el doble enlace

```vue
<script setup lang="ts">
import { ref } from 'vue';
const texto = ref('');
</script>

<template>
  <input v-model="texto" />
  <p>Escribiste: {{ texto }}</p>
</template>
```

`v-model` es azúcar para esto:

```vue
<input :value="texto" @input="texto = ($event.target as HTMLInputElement).value" />
```

Por eso es tan cómodo: lee y escribe a la vez.

Con cada tipo de campo:

```vue
<input v-model="nombre" />                        <!-- texto -->
<input type="number" v-model.number="edad" />     <!-- .number convierte a número -->
<textarea v-model="notas"></textarea>
<input type="checkbox" v-model="acepto" />        <!-- booleano -->
<input type="checkbox" v-model="roles" value="admin" />   <!-- array -->
<input type="radio" v-model="plan" value="pro" />
<select v-model="pais">
  <option value="pe">Perú</option>
  <option value="cl">Chile</option>
</select>
<select v-model="etiquetas" multiple>...</select>  <!-- array -->
```

**Modificadores:**

| Modificador | Qué hace |
|---|---|
| `.number` | convierte a número (si no, `"5"` es texto) |
| `.trim` | quita espacios de los extremos |
| `.lazy` | actualiza al salir del campo (`change`), no en cada tecla |

```vue
<input v-model.number.trim="edad" />
```

> ⚠ Un `<input type="number">` sin `.number` devuelve **texto**. Es el origen
> de sumas que concatenan: `"5" + 1` da `"51"`.

---

## 42.5 · Las demás

```vue
<span v-text="mensaje"></span>          <!-- igual que {{ mensaje }} -->
<div v-html="htmlDelServidor"></div>    <!-- inserta HTML  ← ojo abajo -->
<span v-pre>{{ esto no se procesa }}</span>
<div v-once>{{ soloUnaVez }}</div>      <!-- se dibuja una vez y no cambia más -->
<div v-cloak>...</div>                  <!-- evita el parpadeo inicial -->
```

> ⚠⚠ **`v-html` es un riesgo de seguridad (XSS).** Si el HTML viene de algo que
> escribió un usuario, puede inyectar `<script>`. Úsalo solo con contenido tuyo
> o desinfectado (DOMPurify).

---

## 42.6 · Listas en la vida real

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Producto { id: number; nombre: string; precio: number; stock: number }

const productos = ref<Producto[]>([]);
const busqueda = ref('');
const soloDisponibles = ref(false);
const orden = ref<'nombre' | 'precio'>('nombre');

const visibles = computed(() => {
  let lista = productos.value;

  if (busqueda.value) {
    const q = busqueda.value.toLowerCase();
    lista = lista.filter(p => p.nombre.toLowerCase().includes(q));
  }
  if (soloDisponibles.value) {
    lista = lista.filter(p => p.stock > 0);
  }
  return [...lista].sort((a, b) =>
    orden.value === 'nombre'
      ? a.nombre.localeCompare(b.nombre)
      : a.precio - b.precio,
  );
});
</script>

<template>
  <input v-model="busqueda" placeholder="Buscar" />
  <label><input type="checkbox" v-model="soloDisponibles" /> Solo con stock</label>
  <select v-model="orden">
    <option value="nombre">Nombre</option>
    <option value="precio">Precio</option>
  </select>

  <p v-if="visibles.length === 0">Sin resultados.</p>
  <ul v-else>
    <li v-for="p in visibles" :key="p.id">
      {{ p.nombre }} — {{ p.precio }}
      <span v-if="p.stock === 0" class="tenue">(agotado)</span>
    </li>
  </ul>
</template>
```

Fíjate: **todo el filtrado vive en un `computed`**, no en el template. El
template solo dibuja.

---

## Ejercicios

**E1.** Escribe el bloque de cuatro estados: cargando, error, lista vacía y
lista con datos.

**E2.** Escribe un `v-for` sobre `usuarios` que muestre el nombre, usando el id
como key.

**E3.** Igual, pero mostrando también la posición empezando en 1.

**E4.** Recorre el objeto `config` mostrando `clave: valor`.

**E5.** Escribe un input atado a `email` con `v-model`.

**E6.** Escribe un input numérico atado a `cantidad` que devuelva un **número**.

**E7.** Escribe un checkbox atado a `acepto`.

**E8.** Escribe un `<select>` atado a `pais` con dos opciones.

**E9.** Corrige este código:
```vue
<li v-for="(p, i) in productos" :key="i" v-if="p.activo">{{ p.nombre }}</li>
```

**E10.** ¿`v-if` o `v-show`? 1) un menú desplegable que se abre y cierra mucho,
2) un panel que solo ven los administradores.

**E11.** Escribe el computed `visibles` que filtra `productos` por el texto de
`busqueda` (sin importar mayúsculas).

**E12.** Escribe un `v-model` que quite los espacios de los extremos y que solo
se actualice al salir del campo.

---

## Soluciones

**E1.**
```vue
<p v-if="cargando">Cargando...</p>
<p v-else-if="error">Error: {{ error }}</p>
<p v-else-if="items.length === 0">No hay datos.</p>
<ul v-else>
  <li v-for="i in items" :key="i.id">{{ i.nombre }}</li>
</ul>
```

**E2.** `<li v-for="u in usuarios" :key="u.id">{{ u.nombre }}</li>`

**E3.** `<li v-for="(u, i) in usuarios" :key="u.id">{{ i + 1 }}. {{ u.nombre }}</li>`

**E4.** `<li v-for="(valor, clave) in config" :key="clave">{{ clave }}: {{ valor }}</li>`

**E5.** `<input v-model="email" />`

**E6.** `<input type="number" v-model.number="cantidad" />`

**E7.** `<input type="checkbox" v-model="acepto" />`

**E8.**
```vue
<select v-model="pais">
  <option value="pe">Perú</option>
  <option value="cl">Chile</option>
</select>
```

**E9.** Dos problemas: `v-if` junto a `v-for`, y el índice como key.
```vue
<li v-for="p in activos" :key="p.id">{{ p.nombre }}</li>
```
con `const activos = computed(() => productos.value.filter(p => p.activo));`

**E10.** 1 → `v-show` · 2 → `v-if`

**E11.**
```ts
const visibles = computed(() =>
  productos.value.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  ),
);
```

**E12.** `<input v-model.trim.lazy="texto" />`
