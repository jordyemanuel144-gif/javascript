# 43 · Props tipadas

> **Nivel 6 · Vue**
> Las props son los datos que el padre le pasa al hijo. Van **siempre hacia
> abajo** y el hijo **no puede modificarlas**.

---

## 43.1 · Declarar props con TypeScript

```vue
<!-- Tarjeta.vue (el hijo) -->
<script setup lang="ts">
interface Props {
  titulo: string;
  cantidad: number;
  activo?: boolean;            // opcional
  items?: string[];
}

const props = defineProps<Props>();
</script>

<template>
  <h3>{{ props.titulo }}</h3>
  <p>{{ titulo }}</p>          <!-- también se puede sin `props.` -->
</template>
```

```vue
<!-- el padre -->
<Tarjeta titulo="Ventas" :cantidad="42" :activo="true" :items="['a', 'b']" />
```

* `defineProps` es una **macro del compilador**: no se importa, ya existe
  dentro de `<script setup>`.
* La versión con genérico (`defineProps<Props>()`) es la que da tipos de
  verdad. Es la forma recomendada en proyectos TS.
* En el template puedes escribir `titulo` a secas o `props.titulo`; en el
  script **siempre** `props.titulo`.

> ⚠ `:cantidad="42"` pasa el número 42. `cantidad="42"` pasa el texto `"42"` y
> TypeScript te va a marcar el error.

---

## 43.2 · Valores por defecto: `withDefaults`

```vue
<script setup lang="ts">
interface Props {
  titulo: string;
  variante?: 'primario' | 'secundario';
  tamano?: 'sm' | 'md' | 'lg';
  items?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  variante: 'primario',
  tamano: 'md',
  items: () => [],        // ← objetos y arrays: SIEMPRE con función
});
</script>
```

> ⚠ Un array u objeto por defecto va dentro de una **función**
> (`items: () => []`). Si pusieras `items: []`, todas las instancias del
> componente compartirían el mismo array — el mismo problema de referencias del
> tema 16.

En Vue 3.5+ también existe la forma corta con desestructuración:

```ts
const { titulo, variante = 'primario' } = defineProps<Props>();
```

---

## 43.3 · Las props son de SOLO LECTURA

```ts
props.titulo = 'otro';        // ✗ error: Cannot assign to read only property
```

Vue avisa en consola: *"Set operation on key 'titulo' failed: target is
readonly"*. Es a propósito: si el hijo pudiera cambiar la prop, el padre y el
hijo quedarían desincronizados y nadie sabría quién manda.

Las tres salidas correctas:

```ts
// 1) copiar a un estado local (si el hijo lo maneja por su cuenta)
const local = ref(props.valorInicial);

// 2) avisarle al padre con un evento (tema 44)  ← lo normal
emit('update:modelValue', nuevo);

// 3) derivar con computed (si solo es para mostrar)
const titularMayus = computed(() => props.titulo.toUpperCase());
```

> ⚠ Si copias a un ref (`ref(props.x)`), esa copia **no** se actualiza cuando
> el padre cambia la prop. Si lo necesitas:
> ```ts
> watch(() => props.x, (v) => { local.value = v; });
> ```

---

## 43.4 · Props complejas

```vue
<script setup lang="ts">
import type { Usuario } from '@/types/usuario';

interface Props {
  usuario: Usuario;                          // un objeto tipado
  usuarios: Usuario[];                       // una lista
  seleccionado: Usuario | null;              // puede no haber
  estado: 'ok' | 'error' | 'cargando';       // unión de literales
  alGuardar: (u: Usuario) => void;           // una función como prop
  columnas: { clave: keyof Usuario; titulo: string }[];
}

const props = defineProps<Props>();
</script>
```

Las uniones de literales son lo que hace que el editor te autocomplete los
valores válidos de `variante`, `tamano`, `estado`… y que un typo se vea al
escribir, no en producción.

---

## 43.5 · Atributos que caen solos (`$attrs`)

Lo que le pasas al hijo y **no** está declarado como prop se aplica al elemento
raíz del hijo:

```vue
<MiBoton class="ancho" id="guardar" data-test="btn" />
```

`class`, `id` y `data-test` terminan en el `<button>` de adentro sin que hagas
nada. Eso se llama *fallthrough*.

Para controlarlo:

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false });   // no lo apliques automáticamente
</script>

<template>
  <div class="envoltura">
    <button v-bind="$attrs">            <!-- lo aplico yo, donde quiero -->
      <slot />
    </button>
  </div>
</template>
```

Es lo que hace falta cuando tu componente tiene un `div` de por medio y quieres
que el `class` del padre llegue al `input` de adentro.

---

## 43.6 · Un componente reutilizable completo

```vue
<!-- components/BotonPrimario.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  texto: string;
  variante?: 'primario' | 'peligro';
  cargando?: boolean;
  deshabilitado?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variante: 'primario',
  cargando: false,
  deshabilitado: false,
});

const clases = computed(() => ({
  boton: true,
  'boton--peligro': props.variante === 'peligro',
  'boton--cargando': props.cargando,
}));
</script>

<template>
  <button :class="clases" :disabled="deshabilitado || cargando">
    <span v-if="cargando">Guardando...</span>
    <span v-else>{{ texto }}</span>
  </button>
</template>
```

Uso:

```vue
<BotonPrimario texto="Guardar" :cargando="guardando" @click="guardar" />
<BotonPrimario texto="Borrar" variante="peligro" @click="borrar" />
```

---

## Ejercicios

**E1.** Declara las props de un componente `Avatar`: `url` (string obligatorio)
y `tamano` (number opcional).

**E2.** Agrega el valor por defecto `40` a `tamano`.

**E3.** Declara una prop `etiquetas` que sea un array de strings con
`[]` por defecto (¡cuidado con la sintaxis!).

**E4.** Declara una prop `variante` que solo acepte `'info' | 'aviso' | 'error'`.

**E5.** Desde el padre, pasa el número 40 a `tamano`. Escribe la línea.

**E6.** ¿Qué está mal aquí?
```vue
<Avatar url="{{ foto }}" tamano="40" />
```

**E7.** Dentro del hijo, escribe un computed que devuelva el estilo
`{ width: '40px', height: '40px' }` a partir de la prop `tamano`.

**E8.** El hijo necesita un estado editable que arranque con el valor de la
prop `valorInicial`. Escribe las dos líneas (el ref y el watch que lo
resincroniza).

**E9.** ¿Por qué esto está mal y qué habría que hacer?
```ts
function marcar() { props.activo = true; }
```

**E10.** Declara una prop `usuario` del tipo `Usuario` importándolo como tipo.

**E11.** Declara una prop `columnas` como array de objetos con `clave` y
`titulo`, ambos string.

**E12.** Escribe un componente `Etiqueta` completo (script + template) que
reciba `texto` y `color` (con `'gris'` por defecto) y muestre
`<span :class="...">{{ texto }}</span>`.

---

## Soluciones

**E1.**
```ts
interface Props {
  url: string;
  tamano?: number;
}
const props = defineProps<Props>();
```

**E2.**
```ts
const props = withDefaults(defineProps<Props>(), { tamano: 40 });
```

**E3.**
```ts
interface Props { etiquetas?: string[] }
const props = withDefaults(defineProps<Props>(), { etiquetas: () => [] });
```

**E4.** `variante?: 'info' | 'aviso' | 'error';`

**E5.** `<Avatar :url="foto" :tamano="40" />`

**E6.** Dos errores: `{{ }}` no se usa en atributos (es `:url="foto"`), y
`tamano="40"` pasa el texto `"40"` en vez del número (`:tamano="40"`).

**E7.**
```ts
const estilo = computed(() => ({
  width: `${props.tamano}px`,
  height: `${props.tamano}px`,
}));
```

**E8.**
```ts
const local = ref(props.valorInicial);
watch(() => props.valorInicial, (v) => { local.value = v; });
```

**E9.** Las props son de solo lectura: el hijo no manda sobre los datos del
padre. Hay que emitir un evento y que el padre cambie el valor:
```ts
const emit = defineEmits<{ 'update:activo': [boolean] }>();
function marcar() { emit('update:activo', true); }
```

**E10.**
```ts
import type { Usuario } from '@/types/usuario';
interface Props { usuario: Usuario }
const props = defineProps<Props>();
```

**E11.** `columnas: { clave: string; titulo: string }[];`

**E12.**
```vue
<script setup lang="ts">
interface Props {
  texto: string;
  color?: 'gris' | 'verde' | 'rojo';
}
const props = withDefaults(defineProps<Props>(), { color: 'gris' });
</script>

<template>
  <span :class="`etiqueta etiqueta--${props.color}`">{{ texto }}</span>
</template>
```
