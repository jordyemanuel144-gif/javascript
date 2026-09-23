# 38 · Anatomía de un proyecto Vue 3 + TypeScript

> **Nivel 6 · Vue**
> Antes de escribir una línea, hay que saber qué es cada archivo. Esta lección
> es un mapa: cuando abras el proyecto del trabajo, vas a reconocer todo.
>
> Para probar: `cd 06-vue/playground` y `npm run dev`.

---

## 38.1 · El árbol de carpetas

```
mi-proyecto/
├── index.html              ← la ÚNICA página html. Tiene <div id="app">
├── package.json            ← dependencias y scripts (npm run dev/build)
├── vite.config.ts          ← configuración de Vite: plugins, alias, proxy
├── tsconfig.json           ← configuración de TypeScript
├── env.d.ts                ← tipos de los .vue y de import.meta.env
├── .env                    ← variables: VITE_API_URL=https://...
├── public/                 ← archivos que se copian tal cual (favicon, robots)
└── src/
    ├── main.ts             ← arranca la app (createApp).  EL PUNTO DE ENTRADA
    ├── App.vue             ← el componente raíz
    ├── router/index.ts     ← las rutas
    ├── stores/             ← Pinia: estado global (uno por dominio)
    ├── views/              ← una pantalla por ruta (Home.vue, Detalle.vue)
    ├── components/         ← piezas reutilizables (BotonPrimario.vue)
    ├── composables/        ← lógica reutilizable (useUsuarios.ts)
    ├── services/ o api/    ← llamadas HTTP agrupadas
    ├── types/              ← interfaces compartidas
    └── assets/             ← css, imágenes que pasan por el bundler
```

**La diferencia entre `views/` y `components/`**: una *view* es una pantalla
completa y está atada a una ruta. Un *component* es una pieza que se usa dentro
de varias views. No hay regla del lenguaje, es una convención — pero está en
todos los proyectos.

---

## 38.2 · El recorrido del arranque

Cuando entras a la app, pasa esto, en este orden:

```
index.html
   └─ <script type="module" src="/src/main.ts">
         └─ main.ts:  createApp(App).use(pinia).use(router).mount('#app')
               └─ App.vue  (componente raíz)
                     └─ <RouterView />  → la view de la ruta actual
                           └─ componentes hijos
```

**`src/main.ts` — el archivo más importante que nadie mira:**

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);   // 1) crea la app con el componente raíz
app.use(createPinia());       // 2) instala Pinia
app.use(router);              // 3) instala el router
app.mount('#app');            // 4) la inyecta en el div del html
```

Cada `app.use(...)` es un **plugin**. Ahí se enchufan también las librerías de
UI (Vuetify, PrimeVue), i18n, etc. Si algo "no está disponible" en toda la app,
casi siempre falta un `app.use`.

---

## 38.3 · package.json: los scripts que vas a usar

```json
{
  "scripts": {
    "dev": "vite",                          // servidor local con recarga en caliente
    "build": "vue-tsc --noEmit && vite build",  // revisa tipos y compila a dist/
    "preview": "vite preview",              // sirve lo compilado, para probar
    "lint": "eslint . --fix",
    "test": "vitest"
  }
}
```

* `npm run dev` levanta en `http://localhost:5173`. Guardas un archivo y el
  navegador se actualiza **sin recargar la página** (HMR: Hot Module
  Replacement). Si pierdes el estado al guardar, es que hubo un error y Vite
  recargó entero.
* `npm run build` genera `dist/`, que es lo que se sube al servidor.
* **`vue-tsc`, no `tsc`**: `tsc` no sabe leer archivos `.vue`.

**Dependencias vs devDependencies**: las primeras van al navegador (vue, pinia,
axios); las segundas solo se usan para construir (vite, typescript, eslint).

---

## 38.4 · vite.config.ts y el alias `@`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      // todo lo que empiece con /api se reenvía al backend:
      // evita el error de CORS en desarrollo
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
});
```

El alias `@` = `src/`. Por eso ves `import Boton from '@/components/Boton.vue'`
en vez de `'../../../components/Boton.vue'`.

> ⚠ El alias hay que declararlo **dos veces**: en `vite.config.ts` (para que
> funcione al ejecutar) y en `tsconfig.json` → `paths` (para que TypeScript lo
> entienda). Si autocompleta pero falla al correr, o al revés, falta uno de los dos.

---

## 38.5 · Variables de entorno

Archivo `.env` en la raíz:

```
VITE_API_URL=https://api.miempresa.com
VITE_MODO=produccion
```

Se usan así:

```ts
const base = import.meta.env.VITE_API_URL;
```

Reglas que cuestan una tarde si no se saben:

1. **Tienen que empezar con `VITE_`**. Si no, no llegan al navegador.
2. Se leen **al compilar**, no en tiempo de ejecución: si cambias el `.env`,
   hay que reiniciar `npm run dev`.
3. **No son secretas**: terminan dentro del JS que baja el usuario. Nunca pongas
   ahí una contraseña o una clave de API privada.
4. Hay archivos por entorno: `.env.development`, `.env.production`.

Para que TypeScript las conozca, en `env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 38.6 · Options API vs Composition API

Vas a encontrar los dos estilos. Este curso usa el segundo, que es el estándar
en proyectos nuevos y el que mejor se lleva con TypeScript.

```vue
<!-- Options API (Vue 2 y Vue 3) -->
<script>
export default {
  data() { return { n: 0 }; },
  computed: { doble() { return this.n * 2; } },
  methods: { subir() { this.n++; } },
  mounted() { console.log('listo'); },
};
</script>
```

```vue
<!-- Composition API con script setup (lo que usaremos) -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const n = ref(0);
const doble = computed(() => n.value * 2);
function subir() { n.value++; }
onMounted(() => console.log('listo'));
</script>
```

Equivalencias, para traducir código viejo:

| Options API      | Composition API           |
|------------------|---------------------------|
| `data()`         | `ref()` / `reactive()`    |
| `computed: {}`   | `computed()`              |
| `methods: {}`    | funciones normales        |
| `watch: {}`      | `watch()`                 |
| `mounted()`      | `onMounted()`             |
| `props: {}`      | `defineProps<>()`         |
| `this.n`         | `n.value`                 |

---

## Ejercicios

> Respuestas al final del archivo. Son de reconocimiento y ubicación: no hay
> que programar nada todavía.

**E1.** ¿En qué archivo se monta la app (`createApp(...).mount(...)`)?

**E2.** Tienes `src/views/Perfil.vue` y quieres importar
`src/components/Avatar.vue`. Escribe el import con alias.

**E3.** Escribe el mismo import con ruta relativa.

**E4.** Quieres una variable de entorno con la URL de la API. Escribe la línea
del `.env` y la línea de código que la lee.

**E5.** ¿Qué comando compila el proyecto para producción y dónde queda el
resultado?

**E6.** ¿Por qué `tsc --noEmit` no alcanza en un proyecto Vue? ¿Qué se usa?

**E7.** Ves este error al arrancar:
`Failed to resolve import "@/components/Boton.vue"`. Nombra las dos
configuraciones que hay que revisar.

**E8.** Traduce a Composition API:
```js
data() { return { abierto: false }; },
methods: { alternar() { this.abierto = !this.abierto; } }
```

**E9.** ¿Dónde pondrías cada cosa? (`views/`, `components/`, `composables/`,
`stores/`, `services/`)
1. `TablaPaginada.vue` que se usa en 4 pantallas
2. `ListadoPedidos.vue` que responde a la ruta `/pedidos`
3. `useFormulario.ts` con validaciones reutilizables
4. `pedidos.ts` con las llamadas `GET /pedidos`, `POST /pedidos`
5. `sesion.ts` con el usuario logueado, accesible desde toda la app

**E10.** En el playground, abre `src/main.ts` y di qué pasaría si borras la
línea `app.use(createPinia())`.

---

## Soluciones

**E1.** `src/main.ts`.

**E2.** `import Avatar from '@/components/Avatar.vue';`

**E3.** `import Avatar from '../components/Avatar.vue';`

**E4.**
```
VITE_API_URL=https://api.miempresa.com
```
```ts
const base = import.meta.env.VITE_API_URL;
```

**E5.** `npm run build`; el resultado queda en la carpeta `dist/`.

**E6.** Porque `tsc` no entiende los archivos `.vue`. Se usa `vue-tsc --noEmit`.

**E7.** El alias `@` en `vite.config.ts` (`resolve.alias`) y en `tsconfig.json`
(`compilerOptions.paths`). Y de paso: que el archivo exista con esas
mayúsculas exactas.

**E8.**
```ts
const abierto = ref(false);
function alternar() { abierto.value = !abierto.value; }
```

**E9.** 1 → `components/` · 2 → `views/` · 3 → `composables/` ·
4 → `services/` · 5 → `stores/`

**E10.** Cualquier componente que llame a `useAlgoStore()` reventaría con
*"getActivePinia() was called but there was no active Pinia"*: el store no
está instalado en la app.
