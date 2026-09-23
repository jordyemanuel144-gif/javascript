# Chuleta de JavaScript

Todo en una página, para copiar y pegar.

---

## Variables

```js
const x = 1;        // no se reasigna (pero un objeto sí se puede mutar por dentro)
let y = 2;          // se reasigna
// var: no lo uses
```

## Textos

```js
`Hola ${nombre}, tienes ${edad} años`     // template literal
texto.length                texto.toUpperCase()      texto.toLowerCase()
texto.trim()                texto.includes('x')      texto.startsWith('x')
texto.slice(0, 3)           texto.split(',')         texto.replace('a', 'b')
texto.replaceAll('a', 'b')  texto.padStart(2, '0')   texto.repeat(3)
```

## Números

```js
Number('12')       parseInt('12px')    parseFloat('1.5')    +'12'
(1.5).toFixed(2)   // "1.50"  ← TEXTO
Math.round / floor / ceil / abs / max / min / random
Number.isNaN(x)    Number.isFinite(x)
Number(n.toFixed(2))   // redondear devolviendo número
```

## Arrays

```js
// LEER (no mutan)
lista.map(x => ...)          lista.filter(x => ...)      lista.find(x => ...)
lista.findIndex(x => ...)    lista.some(x => ...)        lista.every(x => ...)
lista.includes(v)            lista.indexOf(v)            lista.slice(0, 3)
lista.join(', ')             lista.concat(otra)          lista.flat()
lista.reduce((acc, x) => acc + x, 0)

// MUTAN el original  ← ojo en Vue
lista.push(x)    lista.pop()    lista.shift()    lista.unshift(x)
lista.splice(i, 1)    lista.sort()    lista.reverse()

// copia segura antes de ordenar
[...lista].sort((a, b) => a - b)        // números ascendente
[...lista].sort((a, b) => b - a)        // descendente
[...lista].sort((a, b) => a.n.localeCompare(b.n))   // textos

[...new Set(lista)]          // sin duplicados
Array.from({ length: 3 }, (_, i) => i)  // [0, 1, 2]
```

## Objetos

```js
obj.campo            obj['campo']         obj[variable]
'campo' in obj       delete obj.campo
Object.keys(obj)     Object.values(obj)   Object.entries(obj)
Object.fromEntries([['a', 1]])
{ ...obj }                       // copia superficial
{ ...base, ...cambios }          // mezclar (la derecha pisa)
{ ...obj, [clave]: valor }       // copia con un campo cambiado
structuredClone(obj)             // copia profunda
```

## Desestructuración

```js
const { nombre, edad } = persona;
const { nombre: n } = persona;              // renombrar
const { pais = 'PE' } = persona;            // por defecto
const { a, ...resto } = obj;                // rest
const [primero, , tercero] = lista;         // array, por posición
function f({ nombre, edad }) { }            // en el parámetro (esto son "props")
```

## Funciones

```js
function f(a, b) { return a + b; }
const f = (a, b) => a + b;
const f = (a) => ({ id: a });               // devolver objeto: con paréntesis
const f = (a = 1, ...resto) => { };         // defecto + rest
const sumador = (n) => (x) => x + n;        // devuelve función (closure)
```

## Condiciones

```js
if (a) { } else if (b) { } else { }
const x = cond ? 'sí' : 'no';
a ?? b        // b solo si a es null o undefined
a || b        // b si a es falsy (0, '', false también)
a?.b?.c       // no revienta si falta un nivel
a?.[0]        // lo mismo para índices
a?.()         // lo mismo para funciones
switch (x) { case 1: ...; break; default: ... }
```

Falsy: `false 0 -0 '' null undefined NaN`. Todo lo demás es truthy
(¡incluidos `[]` y `{}`).

## Bucles

```js
for (const x of lista) { }              // VALORES de un array
for (const k in obj) { }                // CLAVES de un objeto
for (const [k, v] of Object.entries(obj)) { }
for (let i = 0; i < n; i++) { }
lista.forEach((x, i) => { });           // no devuelve nada
```

## Clases

```js
class Producto extends Base {
  campo = 0;
  constructor(nombre) { super(); this.nombre = nombre; }
  metodo() { return this.nombre; }
  get doble() { return this.campo * 2; }
  static crear() { return new Producto('x'); }
}
new Producto('a') instanceof Producto      // true
```

## Módulos

```js
// ESM (Vue/Vite)
export const x = 1;          export default fn;       export { a, b };
import fn, { a, b as c } from './archivo.js';
import * as todo from './archivo.js';
const m = await import('./archivo.js');    // dinámico

// CommonJS (Node)
module.exports = { a, b };   const { a } = require('./archivo');
```

## Asíncrono

```js
const dormir = (ms) => new Promise(r => setTimeout(r, ms));

async function f() {
  try {
    const datos = await pedir();
    return datos;
  } catch (e) {
    console.error(e.message);
  } finally {
    cargando = false;
  }
}

await Promise.all([a(), b()]);        // en paralelo
await Promise.allSettled([a(), b()]); // nunca falla
await Promise.race([a(), b()]);       // la primera
for (const x of lista) await f(x);    // en serie
await Promise.all(lista.map(f));      // en paralelo
lista.forEach(async x => await f(x)); // ✗ NO espera nada
```

## fetch

```js
const r = await fetch('/api/x');
if (!r.ok) throw new Error(`HTTP ${r.status}`);   // ← fetch NO lanza con 404/500
const datos = await r.json();

await fetch('/api/x', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos),
});

new URLSearchParams({ q: 'ana', pagina: 2 }).toString();   // "q=ana&pagina=2"
```

## Errores

```js
throw new Error('mensaje');
try { } catch (e) { e.message } finally { }
e instanceof Error
class ErrorPropio extends Error {
  constructor(msg, codigo) { super(msg); this.name = 'ErrorPropio'; this.codigo = codigo; }
}
```

## JSON, fechas, Map/Set

```js
JSON.stringify(obj)        JSON.stringify(obj, null, 2)      JSON.parse(texto)

new Date()                 new Date('2026-03-15')
d.getFullYear()            d.getMonth() + 1      // ¡empieza en 0!
d.toISOString().slice(0, 10)                     // "2026-03-15"
(fin - inicio) / (1000 * 60 * 60 * 24)           // días
a.getTime() === b.getTime()                      // comparar

new Set([1, 1, 2])    s.add / has / delete / size    [...s]
new Map()             m.set / get / has / delete / size    [...m.entries()]
```

## Regex

```js
/^\d+$/.test(texto)                       // solo dígitos
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)  // email
texto.replace(/\D/g, '')                  // deja solo dígitos
texto.replace(/\s+/g, ' ').trim()         // normalizar espacios
```

## Patrones inmutables (los de Vue)

```js
lista = [...lista, nuevo];                                   // agregar
lista = lista.filter(x => x.id !== id);                      // quitar
lista = lista.map(x => x.id === id ? { ...x, n: 1 } : x);    // editar uno
obj = { ...obj, campo: valor };                              // cambiar campo
```

## Timers y patrones async

```js
const id = setTimeout(fn, 1000);      clearTimeout(id);
const id = setInterval(fn, 1000);     clearInterval(id);

// debounce
let t; const f = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), 300); };

// cancelar fetch
const c = new AbortController();
fetch(url, { signal: c.signal });
c.abort();
```
