# Curso de JavaScript → TypeScript → Vue 3

Un camino completo, de cero a poder leer y tocar un proyecto real de **Vue 3
con TypeScript**.

Mismo formato en todo el curso: **teoría corta + ejemplo + ejercicios**, todo
dentro del mismo archivo. No hay que saltar entre carpetas, y las soluciones
están al final de cada archivo. Los ejercicios son de **sintaxis**, cortos y
directos: la idea es que reconozcas las cosas al verlas, no perder horas en
acertijos.

---

## Cómo se corrige

```bash
node verificar.js          # niveles 1 a 4 (JavaScript), todos los temas
node verificar.js 22       # solo el tema 22

npm run ts                 # nivel 5 (TypeScript), ejecuta los ejercicios
npm run ts 33              # solo el tema 33
npm run tipos              # nivel 5, revisa SOLO los tipos (sin ejecutar)

cd 06-vue/playground && npm run dev    # nivel 6 (Vue), en el navegador
```

Cada prueba sale como:

| | |
|---|---|
| `PASA` | correcto |
| `FALLA` | lo intentaste pero el resultado no coincide (te dice qué esperaba) |
| `PENDIENTE` | todavía no lo escribiste |

> La primera vez, si algo falla: `npm install` en la raíz.

---

## Ruta de aprendizaje

### Nivel 1 · Fundamentos — `01-basicos/`

| # | Archivo | Qué se aprende |
|---|---|---|
| 01 | `01-variables-y-tipos.js` | `let`, `const`, string, number, boolean, `typeof` |
| 02 | `02-operadores.js` | `+ - * / %`, comparaciones, `&&` y `\|\|` |
| 03 | `03-strings.js` | template literals, métodos de texto |
| 04 | `04-condicionales.js` | `if` / `else if` / `else`, ternario |
| 05 | `05-bucles.js` | `for`, `while`, acumuladores |
| 06 | `06-arrays.js` | arrays, `map`, `filter`, `reduce` |

### Nivel 2 · Sintaxis moderna — `02-sintaxis/`

| # | Archivo | Qué se aprende |
|---|---|---|
| 07 | `07-funciones-flecha.js` | `=>` en sus tres formas |
| 08 | `08-objetos.js` | crear, leer, shorthand, `Object.keys` |
| 09 | `09-desestructuracion.js` | **esto es "props"** |
| 10 | `10-spread-y-rest.js` | los tres puntos `...` |
| 11 | `11-datos-reales.js` | arrays de objetos, `map`/`filter`/`find` |
| 12 | `12-valores-opcionales.js` | `?.`, `??`, parámetros por defecto |

### Nivel 3 · JavaScript a fondo — `03-js-a-fondo/`

| # | Archivo | Qué se aprende |
|---|---|---|
| 13 | `13-funciones-a-fondo.js` | callbacks, funciones que devuelven funciones, closures, pureza |
| 14 | `14-arrays-metodos.js` | `find`, `some`, `every`, `sort`, `reduce`, encadenar |
| 15 | `15-objetos-a-fondo.js` | claves dinámicas, `entries`, agrupar, anidados |
| 16 | `16-referencias-y-copias.js` | valor vs referencia, copias, inmutabilidad |
| 17 | `17-clases-y-this.js` | `this`, `class`, getters, herencia, errores propios |
| 18 | `18-modulos-import-export.js` | `import`/`export` vs `require`, alias `@`, lazy |
| 19 | `19-errores-y-excepciones.js` | `try/catch/finally`, `throw`, patrones de error |
| 20 | `20-json-fechas-numeros.js` | `JSON`, `Date`, formateo, `toFixed`, `NaN` |
| 21 | `21-map-set-y-regex.js` | `Set`, `Map` y las cuatro regex de siempre |

### Nivel 4 · JavaScript asíncrono — `04-js-asincrono/`

| # | Archivo | Qué se aprende |
|---|---|---|
| 22 | `22-callbacks-timers-event-loop.js` | por qué el código no espera, `setTimeout`, event loop |
| 23 | `23-promesas.js` | `then`/`catch`, `Promise.all`, `race`, `allSettled` |
| 24 | `24-async-await.js` | `async`/`await`, errores, serie vs paralelo |
| 25 | `25-fetch-y-apis.js` | `fetch`, GET/POST/PUT/DELETE, errores HTTP, services |
| 26 | `26-patrones-async.js` | debounce, throttle, cancelar, caché, race conditions |
| 27 | `27-dom-y-eventos.js` | DOM, eventos, burbujeo, delegación (lo que Vue hace por ti) |

> Los temas 25 y 27 traen una API y un DOM **de mentira** (en `lib/`) para
> poder practicar sin internet y sin navegador.

### Nivel 5 · TypeScript — `05-typescript/`

| # | Archivo | Qué se aprende |
|---|---|---|
| 28 | `28-tipos-basicos.ts` | anotaciones, inferencia, `unknown`, `null` estricto |
| 29 | `29-objetos-interface-type.ts` | `interface` vs `type`, anidados, tipar la API |
| 30 | `30-funciones-tipadas.ts` | parámetros, retorno, tipo función, `Promise<T>` |
| 31 | `31-arrays-tuplas-enums.ts` | arrays, tuplas, unión de literales, `enum`, `as const` |
| 32 | `32-union-narrowing.ts` | uniones, narrowing, uniones discriminadas, type guards |
| 33 | `33-genericos.ts` | `<T>`, `extends`, tipos e interfaces genéricas |
| 34 | `34-utility-types.ts` | `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`… |
| 35 | `35-keyof-typeof-mapeados.ts` | `keyof`, `typeof`, indexados, mapeados, `satisfies` |
| 36 | `36-clases-e-interfaces.ts` | modificadores, `implements`, `abstract`, errores propios |
| 37 | `37-typescript-en-la-practica.ts` | `tsconfig`, `as`, `!`, `.d.ts`, tipos de Vue, errores |

### Nivel 6 · Vue 3 + TypeScript — `06-vue/`

Lecciones en `.md` + un **playground real** para probar
(`cd 06-vue/playground && npm run dev`). Ver `06-vue/README.md`.

| # | Archivo | Qué se aprende |
|---|---|---|
| 38 | `38-anatomia-de-un-proyecto.md` | carpetas, `main.ts`, Vite, `.env`, scripts |
| 39 | `39-sfc-y-script-setup.md` | los 3 bloques, `{{ }}`, `:atributo`, `@evento` |
| 40 | `40-reactividad-ref-reactive.md` | `ref`, `reactive`, `.value`, `toRefs` |
| 41 | `41-computed-y-watch.md` | valores derivados vs efectos |
| 42 | `42-directivas-y-listas.md` | `v-if`, `v-for` + `:key`, `v-model` |
| 43 | `43-props-tipadas.md` | `defineProps`, `withDefaults` |
| 44 | `44-emits-y-v-model.md` | `defineEmits`, `defineModel` |
| 45 | `45-slots.md` | slots por defecto, con nombre y con datos |
| 46 | `46-ciclo-de-vida-y-refs.md` | `onMounted`, `onUnmounted`, refs al DOM, `nextTick` |
| 47 | `47-composables.md` | reutilizar lógica con estado |
| 48 | `48-pinia.md` | estado global, `storeToRefs` |
| 49 | `49-vue-router.md` | rutas, params, guards, anidadas |
| 50 | `50-http-y-formularios.md` | services, 4 estados, validación, debounce |
| 51 | `51-patrones-avanzados.md` | provide/inject, Teleport, Suspense, KeepAlive |
| 52 | `52-leer-un-proyecto-ajeno.md` | método para entender y depurar código ajeno |

### Chuletas — `99-chuletas/`

* `chuleta-javascript.md` — toda la sintaxis de JS en una página
* `chuleta-typescript.md` — tipos, utility types, genéricos
* `chuleta-vue.md` — componentes, reactividad, router, Pinia
* `errores-comunes.md` — **búscalo aquí cuando algo falle**

---

## Cómo trabajar cada archivo

1. Ábrelo y lee el bloque de teoría (son 5–15 líneas por sección).
2. Mira el ejemplo, que siempre tiene el resultado comentado al lado.
3. Resuelve los ejercicios de esa sección, ahí mismo.
4. Corre el corrector y repite hasta que esté verde.
5. Si te atascas, baja al bloque `SOLUCIONES` del final del archivo.

No hace falta terminar un nivel para asomarse al siguiente, pero el orden está
pensado: cada tema usa cosas del anterior.

---

## Progreso

**Nivel 1 — Fundamentos**
- [x] 01 Variables y tipos
- [x] 02 Operadores
- [x] 03 Strings
- [x] 04 Condicionales
- [x] 05 Bucles
- [x] 06 Arrays

**Nivel 2 — Sintaxis moderna**
- [x] 07 Funciones flecha
- [x] 08 Objetos
- [x] 09 Desestructuración
- [x] 10 Spread y rest
- [x] 11 Datos reales
- [x] 12 Valores opcionales

**Nivel 3 — JavaScript a fondo**
- [ ] 13 Funciones a fondo
- [ ] 14 Métodos de array
- [ ] 15 Objetos a fondo
- [ ] 16 Referencias y copias
- [ ] 17 Clases y `this`
- [ ] 18 Módulos
- [ ] 19 Errores
- [ ] 20 JSON, fechas y números
- [ ] 21 Map, Set y regex

**Nivel 4 — Asíncrono**
- [ ] 22 Callbacks, timers y event loop
- [ ] 23 Promesas
- [ ] 24 async / await
- [ ] 25 fetch y APIs
- [ ] 26 Patrones async
- [ ] 27 DOM y eventos

**Nivel 5 — TypeScript**
- [ ] 28 Tipos básicos
- [ ] 29 interface y type
- [ ] 30 Funciones tipadas
- [ ] 31 Arrays, tuplas, enums
- [ ] 32 Uniones y narrowing
- [ ] 33 Genéricos
- [ ] 34 Utility types
- [ ] 35 keyof, typeof, mapeados
- [ ] 36 Clases e interfaces
- [ ] 37 TS en la práctica

**Nivel 6 — Vue 3 + TS**
- [ ] 38 Anatomía del proyecto
- [ ] 39 SFC y script setup
- [ ] 40 Reactividad
- [ ] 41 computed y watch
- [ ] 42 Directivas y listas
- [ ] 43 Props tipadas
- [ ] 44 Emits y v-model
- [ ] 45 Slots
- [ ] 46 Ciclo de vida y refs
- [ ] 47 Composables
- [ ] 48 Pinia
- [ ] 49 Vue Router
- [ ] 50 HTTP y formularios
- [ ] 51 Patrones avanzados
- [ ] 52 Leer un proyecto ajeno

---

## Probar código al vuelo (el equivalente al Ctrl+Shift+E de SQL)

Hay dos formas, y conviene tener las dos a mano.

### 1. Seleccionar y ejecutar — `Ctrl+Shift+E`

Igual que en SQL: seleccionas unas líneas en un archivo `.js` o `.ts`, aprietas
**`Ctrl+Shift+E`** y se ejecuta **solo eso** en la terminal. Sin selección,
ejecuta el archivo entero.

* Lo hace la extensión **Code Runner**, ya instalada y configurada.
* Cada ejecución es un proceso nuevo: no arrastra variables de la anterior.
* `Ctrl+Shift+Alt+E` corta una ejecución que se quedó colgada.
* Fuera de archivos JS/TS, `Ctrl+Shift+E` sigue abriendo el explorador de
  VS Code como siempre.

> Para ver algo hay que **imprimirlo**: una selección que solo calcula no
> muestra nada. Envuélvela en `console.log(...)`.
>
> ```js
> const lista = [1, 2, 3];
> console.log(lista.map(n => n * 2));     // ← selecciona las dos líneas
> ```

### 2. Escribir y guardar — `npm run b`

Un borrador que se vuelve a ejecutar solo cada vez que guardas:

```bash
npm run b      # vigila borrador.js   (JavaScript)
npm run bt     # vigila borrador.ts   (TypeScript)
```

Abres `borrador.js`, escribes, `Ctrl+S`, y miras el resultado en la terminal.
Es más cómodo cuando estás probando algo largo o con varios pasos.
`Ctrl+C` en la terminal lo detiene.

### Otras formas

```bash
npm run repl                                       # consola interactiva de Node
node mi-prueba.js                                  # un archivo JS cualquiera
npx tsx mi-prueba.ts                               # un archivo TypeScript
node 03-js-a-fondo/18-modulos-demo/esm-demo.mjs    # ver ESM funcionando
```

Y para cualquier cosa de Vue, el playground: `cd 06-vue/playground && npm run dev`.

### Cómo imprimir para que se entienda

```js
console.log({ nombre, edad });     // muestra los NOMBRES además de los valores
console.table(arrayDeObjetos);     // lo dibuja como tabla
console.log(JSON.stringify(obj, null, 2));   // objetos anidados, legibles
```
