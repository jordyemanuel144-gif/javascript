/* ============================================================================
   BORRADOR — tu hoja en blanco para probar JavaScript
   ----------------------------------------------------------------------------
   Déjalo corriendo en una terminal con:

       npm run b

   y cada vez que guardes (Ctrl+S) se vuelve a ejecutar solo y ves el resultado
   abajo. Es el equivalente al Ctrl+Shift+E de SQL: escribes, guardas, miras.

   Para cortar el modo vigilancia: Ctrl+C en la terminal.

   Truco: comenta con Ctrl+K Ctrl+C (o Ctrl+/) lo que no quieras que corra, y
   deja solo lo que estás probando.
   ============================================================================ */

// Para ver algo hay que imprimirlo: `console.log(...)`.
// Con llaves alrededor, imprime también el NOMBRE de cada variable:
const nombre = 'Ana';
const edad = 30;
console.log({ nombre, edad });          // { nombre: 'Ana', edad: 30 }

// Arrays de objetos: console.table los muestra como una tabla
const productos = [
  { id: 1, nombre: 'Teclado', precio: 120 },
  { id: 2, nombre: 'Mouse', precio: 80 },
];
console.table(productos);

// A partir de aquí, prueba lo que quieras ------------------------------------

console.log(productos.map(p => p.nombre));


/* ----------------------------------------------------------------------------
   ¿Quieres usar algo que ya escribiste en una lección? Impórtalo:

     const m = require('./03-js-a-fondo/14-arrays-metodos');
     console.log(m.conStock(m.PRODUCTOS));

   ¿Quieres probar await? Envuélvelo en una función async y llámala:

     (async () => {
       const { fetchFalso } = require('./lib/api-falsa');
       const r = await fetchFalso('/api/usuarios');
       console.log(await r.json());
     })();
---------------------------------------------------------------------------- */
