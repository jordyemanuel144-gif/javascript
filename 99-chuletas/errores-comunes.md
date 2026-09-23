# Errores comunes y qué significan de verdad

Busca aquí el mensaje que te salió. Está ordenado por dónde aparece.

---

## En la consola del navegador (JavaScript)

**`Cannot read properties of undefined (reading 'nombre')`**
Entraste con `.` a algo que no existe. Casi siempre: el dato de la API todavía
no llegó.
→ `usuario?.nombre` · `v-if="usuario"` · inicializa el ref con `[]` o `null` y
protege.

**`Cannot read properties of null (reading 'focus')`**
Lo mismo, pero con un template ref usado antes de `onMounted`.
→ mételo dentro de `onMounted` y usa `?.`

**`x is not a function`**
`x` no es lo que creías. Causas típicas: importaste con llaves algo que era
`export default` (o al revés), o te olvidaste de devolverlo desde el store.

**`x is not defined`**
No la declaraste, o hay un typo, o te falta el import.

**`Assignment to constant variable`**
Reasignaste una `const`. Si querías mutar por dentro (`lista.push`) eso sí se
puede; reasignar (`lista = []`) no.

**`Unexpected token '<' ... is not valid JSON`**
Pediste JSON y el servidor devolvió HTML: normalmente una página de error 404
o el `index.html` porque la URL está mal.

**`Maximum call stack size exceeded`**
Recursión infinita. En Vue: un `watch` que modifica lo que está observando.

**`Uncaught (in promise) Error: ...`**
Una promesa se rechazó y nadie la atrapó. Falta un `.catch` o un try/catch
alrededor del `await`.

**`NetworkError` / `Failed to fetch`**
El servidor no responde, no hay internet, o es CORS.

**`has been blocked by CORS policy`**
El backend no autoriza a tu origen. Se arregla **en el backend**, o en
desarrollo con el `proxy` de `vite.config.ts`.

---

## En TypeScript (al escribir o con `vue-tsc`)

**`Object is possibly 'null'` / `'undefined'`**
TS te está salvando: ese valor puede faltar.
→ `if (x)` · `x?.campo` · `x ?? valorPorDefecto`

**`Type 'X' is not assignable to type 'Y'`**
Le diste X donde pedía Y. Lee: primero lo que pedía, después lo que le diste.
Con objetos, suele faltar o sobrar un campo.

**`Property 'x' does not exist on type 'Y'`**
Typo en el nombre, o la interfaz no tiene ese campo (¿el backend cambió?).

**`Parameter 'x' implicitly has an 'any' type`**
Falta anotar un parámetro de función.

**`Property 'value' does not exist on type 'number'`**
Le pusiste `.value` a algo que no es un ref.

**`Cannot find module './Algo.vue' or its corresponding type declarations`**
Falta `env.d.ts` con el `declare module '*.vue'`, o el archivo no existe con
esas mayúsculas exactas, o estás usando `tsc` en vez de `vue-tsc`.

**`Type 'string' is not assignable to type '"a" | "b"'`**
La variable es `string` genérico y se espera un literal exacto.
→ `as const`, o tipa la variable con la unión.

**`Argument of type 'X' is not assignable to parameter of type 'Y'`**
El argumento no encaja con lo que pide la función.

---

## En Vue (consola o comportamiento raro)

**No se actualiza la pantalla**
1. falta `.value` en el script
2. es un `let` normal en vez de un `ref`
3. desestructuraste un store sin `storeToRefs`
4. reasignaste un objeto `reactive` entero
5. estás mutando una copia y no el original

**`Set operation on key "x" failed: target is readonly`**
Estás modificando una **prop**. Las props son del padre.
→ emite un evento (`update:x`) o copia a un ref local.

**`[Vue warn]: Property "x" was accessed during render but is not defined`**
Usaste `x` en el template pero no existe en el script (typo o falta declararla).

**`getActivePinia() was called but there was no active Pinia`**
Falta `app.use(createPinia())` en `main.ts`, o llamaste `useXStore()` en el
nivel superior de un módulo, fuera de un componente.

**`Missing required prop: "titulo"`**
El padre no le pasó una prop obligatoria.

**`Invalid prop: type check failed`**
Pasaste un tipo distinto. Clásico: `veces="3"` (texto) en vez de `:veces="3"`.

**Las filas se mezclan / los checkboxes se marcan solos**
`:key` con el índice en un `v-for`. Usa el id.

**El formulario recarga la página**
Falta `@submit.prevent`.

**El detalle no se actualiza al cambiar el id de la URL**
El componente se reutiliza y `onMounted` no vuelve a correr.
→ `watch(() => route.params.id, cargar, { immediate: true })`

**La ruta hija no se ve**
Falta `<RouterView />` en el componente padre.

**Al recargar `/pedidos/7` da 404**
El servidor no redirige todo a `index.html` (configuración del hosting), o hay
que usar `createWebHashHistory()`.

**La app se pone lenta con el tiempo**
Intervalos o listeners que no se limpian en `onUnmounted`.

**`"5" + 1` da `"51"`**
Falta `v-model.number` en el input numérico.

**El modal queda cortado o detrás de otra cosa**
Un padre tiene `overflow: hidden` o un `z-index` que lo encierra.
→ `<Teleport to="body">`

**El `@click` del hijo dispara también el del padre**
Burbujeo. → `@click.stop`

---

## Al instalar o compilar

**`Cannot find module 'X' or its corresponding type declarations`**
Falta `npm install X`, o faltan sus tipos: `npm i -D @types/X`.

**`Failed to resolve import "@/..."`**
El alias `@` no está configurado en `vite.config.ts` (`resolve.alias`) o en
`tsconfig.json` (`paths`). Hacen falta los dos.

**`The requested module does not provide an export named 'X'`**
Importaste con llaves algo que se exporta por defecto, o al revés.

**Las variables de entorno llegan `undefined`**
No empiezan con `VITE_`, o no reiniciaste `npm run dev` después de tocar
el `.env`.

**En Windows: el import funciona en tu máquina pero falla en el servidor**
Windows no distingue mayúsculas y Linux sí. Revisa que
`import X from './Boton.vue'` coincida exactamente con el nombre del archivo.
